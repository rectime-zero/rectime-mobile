import React from 'react';
import {Dimensions, NativeModules, PixelRatio, Platform, type ScaledSize} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createIOSSignature, getIOSCornerEntry} from '../constants/iosCornerRadii';

export type CornerRadii = {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
};

export type UseDisplayCornersResult = {
    corners: CornerRadii;
    source: 'native' | 'hardcoded' | 'safearea_fallback';
};

type NativeDisplayCornersModule = {
    getCorners: () => Promise<CornerRadii>;
};

const zeroCorners: CornerRadii = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0,
};

const displayCornersModule = NativeModules.DisplayCornersModule as NativeDisplayCornersModule | undefined;
const ANDROID_CORNER_RETRY_DELAY_MS = 250;
const ANDROID_CORNER_MAX_ATTEMPTS = 8;

function createUniformCorners(radius: number): CornerRadii {
    return {
        topLeft: radius,
        topRight: radius,
        bottomLeft: radius,
        bottomRight: radius,
    };
}

function inferCornerRadiusFromSafeArea(topInset: number) {
    if (topInset >= 59) {
        return 55;
    }

    if (topInset >= 44) {
        return 39;
    }

    return 0;
}

function getScreenSignature(screen: ScaledSize) {
    const scale = PixelRatio.get();
    const nativeWidth = Math.round(screen.width * scale);
    const nativeHeight = Math.round(screen.height * scale);

    return createIOSSignature(nativeWidth, nativeHeight, scale);
}

export function getLargestCornerRadius(corners: CornerRadii) {
    return Math.max(corners.topLeft, corners.topRight, corners.bottomLeft, corners.bottomRight);
}

export function getTopCornerRadius(corners: CornerRadii) {
    return Math.max(corners.topLeft, corners.topRight);
}

function hasAnyCornerRadius(corners: CornerRadii) {
    return getLargestCornerRadius(corners) > 0;
}

export function useDisplayCorners(): UseDisplayCornersResult {
    const insets = useSafeAreaInsets();
    const portraitTopInsetRef = React.useRef(0);
    const loggedSignatureRef = React.useRef<string | null>(null);
    const warnedSignatureRef = React.useRef<string | null>(null);
    const [androidCorners, setAndroidCorners] = React.useState<UseDisplayCornersResult>({
        corners: zeroCorners,
        source: 'safearea_fallback',
    });
    const screen = Dimensions.get('screen');
    const signature = getScreenSignature(screen);
    const hardcodedEntry = getIOSCornerEntry(signature);

    if (screen.height >= screen.width && insets.top > 0 && portraitTopInsetRef.current === 0) {
        portraitTopInsetRef.current = insets.top;
    }

    React.useEffect(() => {
        if (Platform.OS !== 'android') {
            return;
        }

        let cancelled = false;
        let retryTimer: ReturnType<typeof setTimeout> | null = null;

        const loadCorners = async (attempt: number) => {
            try {
                if (!displayCornersModule) {
                    return;
                }

                const corners = await displayCornersModule.getCorners();

                if (!cancelled) {
                    setAndroidCorners({
                        corners,
                        source: hasAnyCornerRadius(corners) ? 'native' : 'safearea_fallback',
                    });
                }
            } catch {
                if (!cancelled && attempt < ANDROID_CORNER_MAX_ATTEMPTS) {
                    retryTimer = setTimeout(() => {
                        void loadCorners(attempt + 1);
                    }, ANDROID_CORNER_RETRY_DELAY_MS);
                    return;
                }

                if (!cancelled) {
                    setAndroidCorners({corners: zeroCorners, source: 'safearea_fallback'});
                }
            }
        };

        void loadCorners(1);

        return () => {
            cancelled = true;
            if (retryTimer) {
                clearTimeout(retryTimer);
            }
        };
    }, []);

    React.useEffect(() => {
        if (!__DEV__ || Platform.OS !== 'ios' || hardcodedEntry) {
            return;
        }

        if (warnedSignatureRef.current === signature) {
            return;
        }

        warnedSignatureRef.current = signature;
        console.warn(`[display-corners] Unmapped iOS signature: ${signature}`);
    }, [hardcodedEntry, signature]);

    React.useEffect(() => {
        if (!__DEV__ || Platform.OS !== 'ios') {
            return;
        }

        if (loggedSignatureRef.current === signature) {
            return;
        }

        loggedSignatureRef.current = signature;
        console.log('[display-corners]', {
            signature,
            hardcodedEntry,
            deviceId: DeviceInfo.getDeviceId(),
            model: DeviceInfo.getModel(),
        });
    }, [hardcodedEntry, signature]);

    if (Platform.OS === 'android') {
        return androidCorners;
    }

    if (Platform.OS === 'ios') {
        if (hardcodedEntry) {
            return {
                corners: createUniformCorners(hardcodedEntry.radius),
                source: 'hardcoded',
            };
        }

        const cachedTopInset = portraitTopInsetRef.current || insets.top;

        return {
            corners: createUniformCorners(inferCornerRadiusFromSafeArea(cachedTopInset)),
            source: 'safearea_fallback',
        };
    }

    return {
        corners: zeroCorners,
        source: 'safearea_fallback',
    };
}

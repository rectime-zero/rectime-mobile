import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {Code, CodeScanner} from 'react-native-vision-camera';
import {getOptionalVisionCameraRuntime} from '../../../infrastructure/native/optionalVisionCamera';

type CameraPermissionStatus = 'denied' | 'granted' | 'not-determined' | 'restricted';

type ScanCameraProps = {
    disabled: boolean;
    onScan: (qrValue: string) => void;
};

export function ScanCamera({disabled, onScan}: ScanCameraProps) {
    const lastScannedValueRef = React.useRef<string | null>(null);
    const visionCameraRuntime = React.useMemo(() => getOptionalVisionCameraRuntime(), []);
    const [permissionStatus, setPermissionStatus] = React.useState<CameraPermissionStatus>('not-determined');
    const CameraComponent = visionCameraRuntime.isAvailable ? visionCameraRuntime.CameraComponent : null;
    const backDevice = React.useMemo(() => {
        if (!visionCameraRuntime.isAvailable) {
            return null;
        }

        return visionCameraRuntime.getAvailableCameraDevices().find(device => device.position === 'back') ?? null;
    }, [visionCameraRuntime]);

    React.useEffect(() => {
        if (!visionCameraRuntime.isAvailable) {
            return;
        }

        setPermissionStatus(visionCameraRuntime.getCameraPermissionStatus());
    }, [visionCameraRuntime]);

    const requestPermission = React.useCallback(async () => {
        if (!visionCameraRuntime.isAvailable) {
            return;
        }

        const nextStatus = await visionCameraRuntime.requestCameraPermission();
        setPermissionStatus(nextStatus);
    }, [visionCameraRuntime]);

    const onCodeScanned = React.useCallback((codes: Code[]) => {
        if (disabled || codes.length === 0) {
            return;
        }

        const qrValue = codes[0]?.value ?? '';

        if (!qrValue || lastScannedValueRef.current === qrValue) {
            return;
        }

        lastScannedValueRef.current = qrValue;
        onScan(qrValue);
    }, [disabled, onScan]);

    React.useEffect(() => {
        if (!disabled) {
            lastScannedValueRef.current = null;
        }
    }, [disabled]);

    const codeScanner = React.useMemo<CodeScanner | undefined>(() => {
        if (!visionCameraRuntime.isAvailable) {
            return undefined;
        }

        return {
            codeTypes: ['qr'],
            onCodeScanned,
        };
    }, [onCodeScanned, visionCameraRuntime]);

    if (!visionCameraRuntime.isAvailable) {
        return (
            <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>カメラ機能を利用できません</Text>
                <Text style={styles.stateBody}>
                    VisionCamera のネイティブモジュールが見つかりません。iOS の場合は `pod install` 後に再ビルドしてください。
                </Text>
            </View>
        );
    }

    if (permissionStatus !== 'granted') {
        return (
            <View style={styles.stateContainer}>
                <Text style={styles.stateTitle}>カメラの権限が必要です</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>権限を許可する</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.cameraContainer}>
            {backDevice && CameraComponent ? (
                <CameraComponent
                    style={styles.camera}
                    device={backDevice}
                    isActive={!disabled}
                    codeScanner={codeScanner}
                />
            ) : (
                <View style={styles.stateContainer}>
                    <Text style={styles.stateTitle}>カメラデバイスが見つかりません</Text>
                </View>
            )}

            <View pointerEvents="none" style={styles.overlay}>
                <View style={[styles.scanFrame, disabled ? styles.scanFrameDisabled : null]} />
                <Text style={styles.overlayText}>QRコードを枠内に合わせてください</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanFrame: {
        width: 256,
        height: 256,
        borderWidth: 4,
        borderColor: '#fbbf24',
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.22)',
    },
    scanFrameDisabled: {
        borderColor: '#9ca3af',
    },
    overlayText: {
        marginTop: 16,
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    stateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: 'black',
    },
    stateTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    stateBody: {
        marginTop: 10,
        color: '#d1d5db',
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
    },
    permissionButton: {
        marginTop: 16,
        borderRadius: 8,
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
});

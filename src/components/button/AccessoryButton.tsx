import React, {ReactNode} from 'react';
import {
    LayoutChangeEvent,
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    type GestureResponderEvent,
    View,
    ViewStyle,
} from 'react-native';
import {
    createAnimatedComponent,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import AppIcon from '../icon/AppIcon';
import {type AppIconName} from '../icon/iconNames';
import NativeLiquidGlassView, {isNativeLiquidGlassAvailable} from '../surface/NativeLiquidGlassView';
import {useTheme} from '../../theme';

type AccessoryButtonSize = 'small' | 'medium' | 'large';
type AccessoryButtonTone = 'default' | 'accent';
type AccessoryButtonShape = 'circle' | 'pill';

type AccessoryButtonProps = {
    accessibilityLabel: string;
    onPress: () => void;
    icon?: AppIconName;
    children?: ReactNode;
    size?: AccessoryButtonSize;
    tone?: AccessoryButtonTone;
    shape?: AccessoryButtonShape;
    color?: string;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
};

const AnimatedPressable = createAnimatedComponent(Pressable);

function AccessoryButton({
    accessibilityLabel,
    onPress,
    icon,
    children,
    size = 'medium',
    tone = 'default',
    shape = 'circle',
    color,
    style,
    contentStyle,
}: AccessoryButtonProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const isIos = Platform.OS === 'ios';
    const supportsNativeLiquidGlass = isNativeLiquidGlassAvailable();
    const chrome = isIos ? 'glass' : 'solid';

    const [isHeld, setIsHeld] = React.useState(false);
    const [, setIsTouchInside] = React.useState(true);
    const [isHovered, setIsHovered] = React.useState(false);
    const layoutRef = React.useRef({width: 0, height: 0});
    const holdProgress = useSharedValue(0);
    const insideProgress = useSharedValue(1);
    const hoverProgress = useSharedValue(0);

    const sizeStyles =
        shape === 'pill'
            ? {
                small: styles.smallPillButton,
                medium: styles.mediumPillButton,
                large: styles.largePillButton,
            }
            : {
                small: styles.smallCircleButton,
                medium: styles.mediumCircleButton,
                large: styles.largeCircleButton,
            };

    const baseToneStyles = isIos
        ? {
            default: styles.iosDefaultButton,
            accent: styles.iosAccentButton,
        }
        : {
            default: styles.androidDefaultButton,
            accent: styles.androidAccentButton,
        };

    const iconSizes = {
        small: 14,
        medium: 16,
        large: 18,
    };

    const handleTouchStart = React.useCallback(() => {
        setIsHeld(true);
        setIsTouchInside(true);
        holdProgress.value = withTiming(1, {duration: 160});
        insideProgress.value = withTiming(1, {duration: 120});
    }, [holdProgress, insideProgress]);

    const handleTouchEnd = React.useCallback(() => {
        setIsHeld(false);
        setIsTouchInside(true);
        holdProgress.value = withTiming(0, {duration: 220});
        insideProgress.value = withTiming(1, {duration: 180});
    }, [holdProgress, insideProgress]);

    const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
        layoutRef.current = event.nativeEvent.layout;
    }, []);

    const handleTouchMove = React.useCallback((event: GestureResponderEvent) => {
        const {locationX, locationY} = event.nativeEvent;
        const {width, height} = layoutRef.current;
        const isInside = locationX >= 0 && locationY >= 0 && locationX <= width && locationY <= height;

        setIsTouchInside(previous => {
            if (previous === isInside) {
                return previous;
            }

            insideProgress.value = withTiming(isInside ? 1 : 0.45, {duration: isInside ? 120 : 160});
            return isInside;
        });
    }, [insideProgress]);

    const handleHoverIn = React.useCallback(() => {
        if (Platform.OS !== 'android') {
            return;
        }

        setIsHovered(true);
        hoverProgress.value = withTiming(1, {duration: 180});
    }, [hoverProgress]);

    const handleHoverOut = React.useCallback(() => {
        if (Platform.OS !== 'android') {
            return;
        }

        setIsHovered(false);
        hoverProgress.value = withTiming(0, {duration: 220});
    }, [hoverProgress]);

    const animatedStyle = useAnimatedStyle(() => {
        if (isIos) {
            return {
                transform: [{scale: 1 + holdProgress.value * (0.016 + insideProgress.value * 0.2)}],
            };
        }

        const hoverScale = hoverProgress.value * 0.03;
        const holdScale = holdProgress.value * (0.02 + insideProgress.value * 0.04);
        const baseBackground =
            tone === 'accent' ? theme.colors.surfaceAccent : theme.colors.headerActionBackground;
        const hoverBackground =
            tone === 'accent' ? theme.colors.surfaceAccentStrong : theme.colors.surfaceMuted;
        const pressedBackground =
            tone === 'accent' ? theme.colors.buttonPrimary : theme.colors.surfaceAccent;
        const outsideHeldBackground =
            tone === 'accent' ? theme.colors.surfaceAccentStrong : theme.colors.surfaceMuted;
        const baseBorder =
            tone === 'accent' ? theme.colors.borderStrong : theme.colors.borderSubtle;
        const hoverBorder =
            tone === 'accent' ? theme.colors.buttonPrimary : theme.colors.borderStrong;
        const outsideHeldBorder =
            tone === 'accent' ? theme.colors.buttonPrimary : theme.colors.borderStrong;

        return {
            transform: [{scale: 1 + hoverScale + holdScale}],
            backgroundColor: interpolateColor(
                hoverProgress.value,
                [0, 1],
                [
                    baseBackground,
                    hoverBackground,
                ],
            ),
            borderColor: interpolateColor(
                hoverProgress.value,
                [0, 1],
                [
                    baseBorder,
                    hoverBorder,
                ],
            ),
            shadowOpacity: interpolateColor(
                holdProgress.value,
                [0, 1],
                [
                    0,
                    0.18,
                ],
            ),
            ...(holdProgress.value > 0
                ? {
                    backgroundColor: interpolateColor(
                        holdProgress.value,
                        [0, 1],
                        [
                            interpolateColor(insideProgress.value, [0, 1], [outsideHeldBackground, hoverBackground]),
                            interpolateColor(insideProgress.value, [0, 1], [outsideHeldBackground, pressedBackground]),
                        ],
                    ),
                    borderColor: interpolateColor(
                        holdProgress.value,
                        [0, 1],
                        [
                            interpolateColor(insideProgress.value, [0, 1], [outsideHeldBorder, hoverBorder]),
                            interpolateColor(insideProgress.value, [0, 1], [outsideHeldBorder, hoverBorder]),
                        ],
                    ),
                }
                : null),
        };
    }, [holdProgress, hoverProgress, insideProgress, isIos, theme, tone]);

    const radiusStyle = StyleSheet.flatten([sizeStyles[size], baseToneStyles[tone], style]) as ViewStyle | undefined;
    const glassFillStyle = [
        styles.glassFill,
        radiusStyle?.borderRadius != null ? {borderRadius: radiusStyle.borderRadius} : null,
        radiusStyle?.borderTopLeftRadius != null ? {borderTopLeftRadius: radiusStyle.borderTopLeftRadius} : null,
        radiusStyle?.borderTopRightRadius != null ? {borderTopRightRadius: radiusStyle.borderTopRightRadius} : null,
        radiusStyle?.borderBottomLeftRadius != null ? {borderBottomLeftRadius: radiusStyle.borderBottomLeftRadius} : null,
        radiusStyle?.borderBottomRightRadius != null ? {borderBottomRightRadius: radiusStyle.borderBottomRightRadius} : null,
    ];
    const showsGlassFallback = chrome === 'glass' && !supportsNativeLiquidGlass;

    const resolvedIconColor = color ?? resolveAccessoryIconColor({
        isIos,
        isHeld,
        isHovered,
        theme,
        tone,
    });

    const content =
        children ?? (icon ? <AppIcon color={resolvedIconColor} icon={{kind: 'font-awesome', name: icon}} size={iconSizes[size]} /> : null);

    return (
        <AnimatedPressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            onLayout={handleLayout}
            onHoverIn={handleHoverIn}
            onHoverOut={handleHoverOut}
            onPress={onPress}
            onTouchCancel={handleTouchEnd}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            style={[styles.base, styles.clippedBase, sizeStyles[size], baseToneStyles[tone], style, animatedStyle]}>
            {chrome === 'glass' && supportsNativeLiquidGlass ? (
                <NativeLiquidGlassView effectStyle="regular" interactive style={glassFillStyle} />
            ) : null}
            {showsGlassFallback ? (
                <>
                    <View pointerEvents="none" style={[glassFillStyle, styles.glassFallbackFill]} />
                    <View pointerEvents="none" style={[glassFillStyle, styles.glassFallbackHighlight]} />
                    <View pointerEvents="none" style={[glassFillStyle, styles.glassFallbackEdge]} />
                </>
            ) : null}
            {isIos ? <View pointerEvents="none" style={[glassFillStyle, styles.iosGlassOverlay, isHeld ? styles.iosPressedOverlay : null]} /> : null}
            <View style={[styles.content, contentStyle]}>{content}</View>
        </AnimatedPressable>
    );
}

function resolveAccessoryIconColor({
    isIos,
    isHeld,
    isHovered,
    theme,
    tone,
}: {
    isIos: boolean;
    isHeld: boolean;
    isHovered: boolean;
    theme: ReturnType<typeof useTheme>['theme'];
    tone: AccessoryButtonTone;
}) {
    if (tone === 'accent') {
        if (!isIos && isHeld) {
            return theme.colors.textOnAccent;
        }

        return theme.colors.navigationActive;
    }

    if (!isIos && (isHeld || isHovered)) {
        return theme.colors.textPrimary;
    }

    return theme.colors.headerActionForeground;
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        base: {
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
        },
        clippedBase: {
            overflow: 'hidden',
        },
        content: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        glassFill: {
            ...StyleSheet.absoluteFillObject,
        },
        smallCircleButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
        },
        mediumCircleButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
        },
        largeCircleButton: {
            width: 52,
            height: 52,
            borderRadius: 26,
        },
        smallPillButton: {
            minHeight: 40,
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 4,
        },
        mediumPillButton: {
            minHeight: 44,
            borderRadius: 22,
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        largePillButton: {
            minHeight: 52,
            borderRadius: 26,
            paddingHorizontal: 12,
            paddingVertical: 6,
        },
        iosDefaultButton: {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            shadowColor: '#08111F',
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.12,
            shadowRadius: 18,
        },
        iosAccentButton: {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            shadowColor: '#08111F',
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.16,
            shadowRadius: 20,
        },
        androidDefaultButton: {
            backgroundColor: theme.colors.headerActionBackground,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.borderSubtle,
        },
        androidAccentButton: {
            backgroundColor: theme.colors.surfaceAccent,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.borderStrong,
        },
        glassFallbackFill: {
            backgroundColor: 'rgba(196, 220, 255, 0.14)',
        },
        glassFallbackHighlight: {
            top: 1,
            left: 1,
            right: 1,
            bottom: '48%',
            backgroundColor: 'rgba(255,255,255,0.18)',
        },
        glassFallbackEdge: {
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.22)',
        },
        iosGlassOverlay: {
            backgroundColor: 'rgba(255,255,255,0.06)',
            opacity: 0,
        },
        iosPressedOverlay: {
            opacity: 1,
        },
    });
}

export default AccessoryButton;

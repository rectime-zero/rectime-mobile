import React, {ReactNode} from 'react';
import {
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import {
    createAnimatedComponent,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {useTheme} from '../theme';
import NativeLiquidGlassView, {supportsNativeLiquidGlassView} from './NativeLiquidGlassView';

type SurfaceButtonChrome = 'glass' | 'solid' | 'none';
type SurfaceButtonSize = 'header' | 'regular' | 'compact' | 'none';

type SurfaceButtonProps = {
    accessibilityLabel: string;
    children: ReactNode;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    chrome?: SurfaceButtonChrome;
    size?: SurfaceButtonSize;
};

const AnimatedPressable = createAnimatedComponent(Pressable);

function SurfaceButton({
    accessibilityLabel,
    children,
    onPress,
    style,
    contentStyle,
    chrome = 'solid',
    size = 'none',
}: SurfaceButtonProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    const isIos = Platform.OS === 'ios';
    const supportsNativeLiquidGlass = supportsNativeLiquidGlassView;
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const pressedOpacity = supportsNativeLiquidGlass ? 1 : isIos ? 0.84 : 0.94;
    const pressedScale = isIos ? 0.98 : 1.15;

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{scale: scale.value}],
    }));

    const handlePressIn = React.useCallback(() => {
        scale.value = withTiming(pressedScale, {duration: 140});
        opacity.value = withTiming(pressedOpacity, {duration: 140});
    }, [opacity, pressedOpacity, pressedScale, scale]);

    const handlePressOut = React.useCallback(() => {
        scale.value = withTiming(1, {duration: 180});
        opacity.value = withTiming(1, {duration: 180});
    }, [opacity, scale]);

    const sizeStyle =
        size === 'header'
            ? styles.headerSize
            : size === 'regular'
              ? styles.regularSize
              : size === 'compact'
                ? styles.compactSize
                : null;

    const chromeStyle =
        chrome === 'glass'
            ? supportsNativeLiquidGlass
              ? styles.nativeGlassBase
              : styles.glassFallbackSolidBase
            : chrome === 'solid'
              ? styles.solidBase
              : null;
    const radiusStyle = StyleSheet.flatten([sizeStyle, style]) as ViewStyle | undefined;
    const glassFillStyle = [
        styles.glassFill,
        radiusStyle?.borderRadius != null ? {borderRadius: radiusStyle.borderRadius} : null,
        radiusStyle?.borderTopLeftRadius != null ? {borderTopLeftRadius: radiusStyle.borderTopLeftRadius} : null,
        radiusStyle?.borderTopRightRadius != null ? {borderTopRightRadius: radiusStyle.borderTopRightRadius} : null,
        radiusStyle?.borderBottomLeftRadius != null ? {borderBottomLeftRadius: radiusStyle.borderBottomLeftRadius} : null,
        radiusStyle?.borderBottomRightRadius != null ? {borderBottomRightRadius: radiusStyle.borderBottomRightRadius} : null,
    ];
    const shouldClipContents = chrome !== 'glass' || !supportsNativeLiquidGlass;

    return (
        <AnimatedPressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.base, shouldClipContents ? styles.clippedBase : null, sizeStyle, chromeStyle, style, animatedStyle]}>
            {chrome === 'glass' && supportsNativeLiquidGlass ? (
                <NativeLiquidGlassView effectStyle="regular" interactive style={glassFillStyle} />
            ) : null}
            <View style={[styles.content, contentStyle]}>{children}</View>
        </AnimatedPressable>
    );
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
        headerSize: {
            width: 44,
            height: 44,
            borderRadius: 50,
        },
        regularSize: {
            minHeight: 48,
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        compactSize: {
            minHeight: 40,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
        solidBase: {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(255,255,255,0.12)',
        },
        nativeGlassBase: {
            backgroundColor: 'transparent',
            shadowColor: '#08111F',
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.12,
            shadowRadius: 18,
        },
        glassFallbackSolidBase: {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(255,255,255,0.12)',
            shadowColor: '#08111F',
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.12,
            shadowRadius: 18,
            backgroundColor: theme.colors.headerActionBackground,
        },
        glassFill: {
            ...StyleSheet.absoluteFillObject,
        },
        content: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
}

export default SurfaceButton;

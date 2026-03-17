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
import NativeLiquidGlassView, {isNativeLiquidGlassAvailable} from './NativeLiquidGlassView';

type PressSurfaceChrome = 'glass' | 'solid' | 'none';
type PressSurfaceSize = 'header' | 'regular' | 'compact' | 'none';

type PressSurfaceProps = {
    accessibilityLabel: string;
    children: ReactNode;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    chrome?: PressSurfaceChrome;
    size?: PressSurfaceSize;
};

const AnimatedPressable = createAnimatedComponent(Pressable);

function PressSurface({
    accessibilityLabel,
    children,
    onPress,
    style,
    contentStyle,
    chrome = 'solid',
    size = 'none',
}: PressSurfaceProps) {
    const isIos = Platform.OS === 'ios';
    const supportsNativeLiquidGlass = isNativeLiquidGlassAvailable();
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
    const showsGlassFallback = chrome === 'glass' && !supportsNativeLiquidGlass;

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
            {showsGlassFallback ? (
                <>
                    <View pointerEvents="none" style={[glassFillStyle, styles.glassFallbackFill]} />
                    <View pointerEvents="none" style={[glassFillStyle, styles.glassFallbackHighlight]} />
                    <View pointerEvents="none" style={[glassFillStyle, styles.glassFallbackEdge]} />
                </>
            ) : null}
            <View style={[styles.content, contentStyle]}>{children}</View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
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
        borderColor: 'rgba(255,255,255,0.18)',
        shadowColor: '#08111F',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.18,
        shadowRadius: 20,
        backgroundColor: 'rgba(222, 236, 255, 0.12)',
    },
    glassFill: {
        ...StyleSheet.absoluteFillObject,
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
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PressSurface;

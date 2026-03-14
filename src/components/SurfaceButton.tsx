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
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const pressedOpacity = isIos ? 0.84 : 0.94;
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
            ? styles.glassBase
            : chrome === 'solid'
              ? styles.solidBase
              : null;

    return (
        <AnimatedPressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.base, sizeStyle, chromeStyle, style, animatedStyle]}>
            {chrome === 'glass' && isIos ? (
                <>
                    <View pointerEvents="none" style={styles.iosGlassHighlight} />
                    <View pointerEvents="none" style={styles.iosGlassShade} />
                </>
            ) : null}
            <View style={[styles.content, contentStyle]}>{children}</View>
        </AnimatedPressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        base: {
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
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
        glassBase: {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: isIosBorderColor(isIosPlatform()),
            shadowColor: '#08111F',
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.12,
            shadowRadius: 18,
            backgroundColor: theme.colors.headerActionBackground,
        },
        iosGlassHighlight: {
            position: 'absolute',
            top: 0,
            left: 1,
            right: 1,
            height: '58%',
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.14)',
        },
        iosGlassShade: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: '62%',
            backgroundColor: 'rgba(255,255,255,0.04)',
        },
        content: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
}

function isIosPlatform() {
    return Platform.OS === 'ios';
}

function isIosBorderColor(isIos: boolean) {
    return isIos ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.12)';
}

export default SurfaceButton;

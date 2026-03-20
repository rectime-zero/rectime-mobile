import React, {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {Extrapolation, interpolate, useAnimatedStyle, type SharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../theme';
import {screenLayout, size} from '../../tokens/layout';
import NativeLiquidGlassView, {isNativeLiquidGlassAvailable} from '../surface/NativeLiquidGlassView';

const HEADER_SCROLL_RANGE = 80;
const HEADER_BELOW_HEIGHT = 56;

type ScreenHeaderProps = {
    title: string;
    leading?: ReactNode;
    trailing?: ReactNode;
    below?: ReactNode;
    scrollY: SharedValue<number>;
    titleVisible?: boolean;
};

function ScreenHeader({
    title,
    leading,
    trailing,
    below,
    scrollY,
    titleVisible = true,
}: ScreenHeaderProps) {
    const {theme} = useTheme();
    const insets = useSafeAreaInsets();
    const useLiquidGlass = isNativeLiquidGlassAvailable();
    const styles = React.useMemo(() => createStyles(theme, insets.top, Boolean(below)), [below, insets.top, theme]);

    React.useEffect(() => {
        console.log('[ScreenHeader] LiquidGlass available:', useLiquidGlass);
    }, [useLiquidGlass]);

    const gradientStyle = useAnimatedStyle(() => ({
        opacity: interpolate(scrollY.value, [0, HEADER_SCROLL_RANGE], [0, 0.9], Extrapolation.CLAMP),
    }));

    const backgroundColor = theme.colors.navigationSurface;
    // const gradientColors = [backgroundColor, backgroundColor, `${backgroundColor}00`];
    // const gradientLocations = [0, 0.8, 1];
    // easeIn カーブ風（濃い→薄いが自然に見える）
    const gradientColors = [
        backgroundColor,
        backgroundColor,
        `${backgroundColor}E6`, // ~90%
        `${backgroundColor}B3`, // ~70%
        `${backgroundColor}66`, // ~40%
        `${backgroundColor}1A`, // ~10%
        `${backgroundColor}00`,
    ];
    const gradientLocations = [0, 0.5, 0.65, 0.78, 0.88, 0.96, 1.0];

    return (
        <View style={styles.container}>
            <Animated.View pointerEvents="none" style={[styles.gradientLayer, gradientStyle]}>
                {useLiquidGlass ? (
                    <>
                        <NativeLiquidGlassView effectStyle="regular" interactive={false}
                                               style={styles.liquidGlassBackground}/>
                        <LinearGradient
                            colors={gradientColors}
                            locations={gradientLocations}
                            style={styles.gradientOverlay}
                        />
                    </>
                ) : (
                    <LinearGradient
                        colors={gradientColors}
                        locations={gradientLocations}
                        style={styles.gradient}
                    />
                )}
            </Animated.View>

            <View style={styles.header}>
                <View style={styles.leading}>{leading}</View>
                {titleVisible ? (
                    <Text numberOfLines={1} style={styles.title}>
                        {title}
                    </Text>
                ) : (
                    <View style={styles.titleSpacer} />
                )}
                <View style={styles.trailing}>{trailing}</View>
            </View>

            {below ? <View style={styles.below}>{below}</View> : null}
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], topInset: number, hasBelow: boolean) {
    const extraHeight = hasBelow ? HEADER_BELOW_HEIGHT : 0;
    const headerHeight =
        topInset + size.headerAction + screenLayout.headerPaddingTop + screenLayout.headerPaddingBottom + extraHeight;
    const gradientHeight = headerHeight;

    return StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
        },
        gradientLayer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: gradientHeight,
        },
        liquidGlassBackground: {
            ...StyleSheet.absoluteFillObject,
            height: headerHeight,
            borderRadius: 0,
        },
        gradientOverlay: {
            ...StyleSheet.absoluteFillObject,
        },
        gradient: {
            height: gradientHeight,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: screenLayout.headerGap,
            paddingHorizontal: screenLayout.horizontalPadding,
            paddingTop: topInset + screenLayout.headerPaddingTop,
            paddingBottom: screenLayout.headerPaddingBottom,
        },
        leading: {
            width: size.headerAction,
            alignItems: 'flex-start',
        },
        trailing: {
            width: size.headerAction,
            alignItems: 'flex-end',
        },
        title: {
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        titleSpacer: {
            flex: 1,
        },
        below: {
            minHeight: HEADER_BELOW_HEIGHT,
            paddingHorizontal: screenLayout.horizontalPadding,
            paddingBottom: screenLayout.headerPaddingBottom,
            justifyContent: 'center',
        },
    });
}

export default ScreenHeader;

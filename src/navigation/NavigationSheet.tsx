import React, {useEffect, useRef} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getTopCornerRadius, useDisplayCorners} from '../hooks/useDisplayCorners';
import {getSheetScreenOptions, renderSheetScreen} from './renderRoute';
import {type AppRoute, type SheetScreenName} from './types';
import {useNavigation} from './useNavigation';
import {useTheme} from '../theme';
import {sheetLayout, size} from '../tokens/layout';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const SPRING_CONFIG = {
    damping: 24,
    stiffness: 220,
    mass: 0.95,
} as const;

type NavigationSheetProps = {
    route: AppRoute<SheetScreenName>;
};

function NavigationSheet({route}: NavigationSheetProps) {
    const {theme} = useTheme();
    const {corners} = useDisplayCorners();
    const insets = useSafeAreaInsets();
    const sheetOptions = React.useMemo(() => getSheetScreenOptions(route), [route]);
    const sheetCornerRadius = getTopCornerRadius(corners);
    const topInset = insets.top + sheetLayout.topInsetOffset;
    const maxSheetHeight = SCREEN_HEIGHT - topInset;
    const bottomInset = Math.max(insets.bottom, sheetLayout.minBottomInset);
    const {activeGestureValue, clearSheet, setActiveGesture, sheetDismissRequest} = useNavigation();
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const backdropOpacity = useSharedValue(0);
    const dragStart = useSharedValue(0);
    const handledDismissRequestRef = useRef(sheetDismissRequest);

    useEffect(() => {
        translateY.value = withSpring(0, SPRING_CONFIG);
        backdropOpacity.value = withTiming(1, {duration: 180});
    }, [backdropOpacity, translateY]);

    const animateDismissSheet = React.useCallback(() => {
        setActiveGesture('none');
        backdropOpacity.value = withTiming(0, {duration: 140});
        translateY.value = withTiming(SCREEN_HEIGHT, {duration: 180}, finished => {
            if (finished) {
                runOnJS(clearSheet)(route.key);
            }
        });
    }, [backdropOpacity, clearSheet, route.key, setActiveGesture, translateY]);

    useEffect(() => {
        if (sheetDismissRequest === 0 || sheetDismissRequest === handledDismissRequestRef.current) {
            return;
        }

        handledDismissRequestRef.current = sheetDismissRequest;
        animateDismissSheet();
    }, [animateDismissSheet, sheetDismissRequest]);

    const sheetGesture = React.useMemo(
        () =>
            Gesture.Pan()
                .activeOffsetY([10, 10])
                .failOffsetX([-12, 12])
                .onStart(() => {
                    if (activeGestureValue.value !== 'none') {
                        return;
                    }

                    dragStart.value = translateY.value;
                    activeGestureValue.value = 'sheet';
                    runOnJS(setActiveGesture)('sheet');
                })
                .onUpdate(event => {
                    if (activeGestureValue.value !== 'sheet') {
                        return;
                    }

                    const nextY = Math.max(0, dragStart.value + event.translationY);
                    translateY.value = nextY;
                    backdropOpacity.value = Math.max(0.2, 1 - nextY / SCREEN_HEIGHT);
                })
                .onEnd(event => {
                    if (activeGestureValue.value !== 'sheet') {
                        return;
                    }

                    const shouldDismiss = translateY.value > SCREEN_HEIGHT * 0.18 || event.velocityY > 1000;
                    activeGestureValue.value = 'none';
                    runOnJS(setActiveGesture)('none');

                    if (shouldDismiss) {
                        backdropOpacity.value = withTiming(0, {duration: 140});
                        translateY.value = withTiming(SCREEN_HEIGHT, {duration: 180}, finished => {
                            if (finished) {
                                runOnJS(clearSheet)(route.key);
                            }
                        });
                        return;
                    }

                    translateY.value = withSpring(0, SPRING_CONFIG);
                    backdropOpacity.value = withTiming(1, {duration: 180});
                })
                .onFinalize(() => {
                    if (activeGestureValue.value !== 'sheet') {
                        return;
                    }

                    activeGestureValue.value = 'none';
                    runOnJS(setActiveGesture)('none');
                }),
        [activeGestureValue, backdropOpacity, clearSheet, dragStart, route.key, setActiveGesture, translateY],
    );

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{translateY: translateY.value}],
    }));
    const styles = React.useMemo(() => createStyles(theme, sheetCornerRadius), [sheetCornerRadius, theme]);

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={animateDismissSheet} />
            </Animated.View>

            <GestureDetector gesture={sheetGesture}>
                <Animated.View
                    style={[
                        styles.sheet,
                        {paddingBottom: bottomInset, maxHeight: maxSheetHeight},
                        sheetOptions.layoutMode === 'full' ? {height: maxSheetHeight} : null,
                        sheetStyle,
                    ]}>
                    {sheetOptions.showHandle === false ? null : <View style={styles.handle} />}
                    {renderSheetScreen(route)}
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], sheetCornerRadius: number) {
    return StyleSheet.create({
        backdrop: {
            backgroundColor: theme.colors.overlayBackdrop,
        },
        sheet: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderTopLeftRadius: sheetCornerRadius,
            borderTopRightRadius: sheetCornerRadius,
            backgroundColor: theme.colors.sheetBackground,
            paddingHorizontal: sheetLayout.horizontalPadding,
            paddingTop: sheetLayout.paddingTop,
            shadowColor: theme.colors.navigationShadow,
            shadowOffset: {width: 0, height: -10},
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 18,
        },
        handle: {
            alignSelf: 'center',
            marginBottom: sheetLayout.handleMarginBottom,
            width: size.sheetHandleWidth,
            height: size.sheetHandleHeight,
            borderRadius: 999,
            backgroundColor: theme.colors.sheetHandle,
        },
    });
}

export default NavigationSheet;

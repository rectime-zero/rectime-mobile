import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getLeftCornerRadius, useDisplayCorners} from '../hooks/useDisplayCorners';
import {renderPushScreen} from './renderRoute';
import {getMenuRevealWidth} from './menuLayout';
import {type AppRoute, type PushScreenName} from './types';
import {useNavigation} from './useNavigation';
import {useTheme} from '../theme';

const SPRING_CONFIG = {
    damping: 24,
    stiffness: 220,
    mass: 0.95,
} as const;

type NavigationCardProps = {
    route: AppRoute<PushScreenName>;
    isTopCard: boolean;
};

function NavigationCard({route, isTopCard}: NavigationCardProps) {
    const {theme} = useTheme();
    const {corners} = useDisplayCorners();
    const {width: screenWidth} = useWindowDimensions();
    const menuRevealWidth = getMenuRevealWidth(screenWidth);
    const sideMenuCornerRadius = getLeftCornerRadius(corners);
    const {activeGestureValue, completePop, pushDismissRequest, setActiveGesture, sheetRoute} = useNavigation();
    const initialTranslateX = route.transitionSource === 'side-menu' ? menuRevealWidth : screenWidth;
    const translateX = useSharedValue(initialTranslateX);
    const dragStart = useSharedValue(initialTranslateX);
    const handledDismissRequestRef = useRef(pushDismissRequest);

    useEffect(() => {
        translateX.value = withSpring(0, SPRING_CONFIG);
    }, [translateX]);

    useEffect(() => {
        if (!isTopCard || pushDismissRequest === 0 || pushDismissRequest === handledDismissRequestRef.current) {
            return;
        }

        handledDismissRequestRef.current = pushDismissRequest;
        setActiveGesture('none');
        translateX.value = withTiming(screenWidth, {duration: 180}, finished => {
            if (finished) {
                runOnJS(completePop)(route.key);
            }
        });
    }, [completePop, isTopCard, pushDismissRequest, route.key, screenWidth, setActiveGesture, translateX]);

    const backGesture = React.useMemo(
        () =>
            Gesture.Pan()
                .enabled(isTopCard && !sheetRoute)
                .activeOffsetX([-10, 10])
                .failOffsetY([-12, 12])
                .onStart(() => {
                    if (!isTopCard || activeGestureValue.value !== 'none') {
                        return;
                    }

                    dragStart.value = translateX.value;
                    activeGestureValue.value = 'back';
                    runOnJS(setActiveGesture)('back');
                })
                .onUpdate(event => {
                    if (!isTopCard || activeGestureValue.value !== 'back') {
                        return;
                    }

                    translateX.value = Math.max(0, dragStart.value + event.translationX);
                })
                .onEnd(event => {
                    if (!isTopCard || activeGestureValue.value !== 'back') {
                        return;
                    }

                    const gestureProgress = translateX.value / screenWidth;
                    const shouldPop =
                        event.velocityX > 700 || (event.velocityX > -700 && gestureProgress > 0.45);
                    activeGestureValue.value = 'none';
                    runOnJS(setActiveGesture)('none');

                    if (shouldPop) {
                        translateX.value = withTiming(screenWidth, {duration: 180}, finished => {
                            if (finished) {
                                runOnJS(completePop)(route.key);
                            }
                        });
                        return;
                    }

                    translateX.value = withSpring(0, SPRING_CONFIG);
                })
                .onFinalize(() => {
                    if (activeGestureValue.value !== 'back') {
                        return;
                    }

                    activeGestureValue.value = 'none';
                    runOnJS(setActiveGesture)('none');
                }),
        [activeGestureValue, completePop, dragStart, isTopCard, route.key, screenWidth, setActiveGesture, sheetRoute, translateX],
    );

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}],
    }));
    const styles = React.useMemo(
        () => createStyles(theme, route.transitionSource === 'side-menu' ? sideMenuCornerRadius : 0),
        [route.transitionSource, sideMenuCornerRadius, theme],
    );

    return (
        <GestureDetector gesture={backGesture}>
            <Animated.View style={[styles.cardLayer, cardStyle]}>
                <View style={styles.cardShadow} />
                <SafeAreaView edges={['top', 'left', 'right']} style={styles.cardSurface}>
                    {renderPushScreen(route)}
                </SafeAreaView>
            </Animated.View>
        </GestureDetector>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], sideMenuCornerRadius: number) {
    return StyleSheet.create({
        cardLayer: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.navigationSurface,
            borderTopLeftRadius: sideMenuCornerRadius,
            borderBottomLeftRadius: sideMenuCornerRadius,
            overflow: 'hidden',
        },
        cardSurface: {
            flex: 1,
            backgroundColor: theme.colors.navigationSurface,
            borderTopLeftRadius: sideMenuCornerRadius,
            borderBottomLeftRadius: sideMenuCornerRadius,
        },
        cardShadow: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'transparent',
        },
    });
}

export default NavigationCard;

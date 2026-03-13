import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../theme';
import SideMenu from '../components/layout/SideMenu';
import NavigationCard from './NavigationCard';
import NavigationSheet from './NavigationSheet';
import {getMenuRevealWidth} from './menuLayout';
import {renderRootScreen} from './renderRoute';
import {useNavigation} from './useNavigation';

const EDGE_WIDTH = 28;
const SPRING_CONFIG = {
    damping: 24,
    stiffness: 220,
    mass: 0.95,
} as const;

function NavigationRenderer() {
    const {theme} = useTheme();
    const {width: screenWidth} = useWindowDimensions();
    const menuRevealWidth = getMenuRevealWidth(screenWidth);
    const {
        rootRoute,
        pushStack,
        sheetRoute,
        menuProgress,
        activeGestureValue,
        setActiveGesture,
    } = useNavigation();

    const rootCardPanStart = useSharedValue(0);
    const canUseMenuGesture = pushStack.length === 0 && !sheetRoute;

    const menuGesture = React.useMemo(
        () =>
            Gesture.Pan()
                .enabled(canUseMenuGesture)
                .activeOffsetX([-10, 10])
                .failOffsetY([-12, 12])
                .onStart(event => {
                    if (activeGestureValue.value !== 'none') {
                        return;
                    }

                    const canOpenMenu = menuProgress.value <= 0.01 && event.absoluteX <= EDGE_WIDTH;
                    const canCloseMenu = menuProgress.value > 0.01;

                    if (!canOpenMenu && !canCloseMenu) {
                        return;
                    }

                    rootCardPanStart.value = menuProgress.value;
                    activeGestureValue.value = 'menu';
                    runOnJS(setActiveGesture)('menu');
                })
                .onUpdate(event => {
                    if (activeGestureValue.value !== 'menu') {
                        return;
                    }

                    const nextProgress = Math.min(
                        1,
                        Math.max(0, rootCardPanStart.value + event.translationX / menuRevealWidth),
                    );
                    menuProgress.value = nextProgress;
                })
                .onEnd(event => {
                    if (activeGestureValue.value !== 'menu') {
                        return;
                    }

                    const shouldOpen = menuProgress.value > 0.45 || event.velocityX > 700;
                    menuProgress.value = withSpring(shouldOpen ? 1 : 0, SPRING_CONFIG);
                    activeGestureValue.value = 'none';
                    runOnJS(setActiveGesture)('none');
                })
                .onFinalize(() => {
                    if (activeGestureValue.value !== 'menu') {
                        return;
                    }

                    activeGestureValue.value = 'none';
                    runOnJS(setActiveGesture)('none');
                }),
        [activeGestureValue, canUseMenuGesture, menuProgress, menuRevealWidth, rootCardPanStart, setActiveGesture],
    );

    const rootCardStyle = useAnimatedStyle(() => ({
        borderRadius: interpolate(menuProgress.value, [0, 1], [0, 32]),
        shadowOpacity: interpolate(menuProgress.value, [0, 1], [0, 0.18]),
        transform: [{translateX: interpolate(menuProgress.value, [0, 1], [0, menuRevealWidth])}],
    }));

    const scrimStyle = useAnimatedStyle(() => ({
        opacity: interpolate(menuProgress.value, [0, 1], [0, 0.18]),
    }));

    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <SideMenu />

            <GestureDetector gesture={menuGesture}>
                <Animated.View style={[styles.rootCardLayer, rootCardStyle]}>
                    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
                        {renderRootScreen(rootRoute)}
                    </SafeAreaView>

                    <Animated.View
                        pointerEvents="none"
                        style={[StyleSheet.absoluteFillObject, styles.rootScrim, scrimStyle]}
                    />
                </Animated.View>
            </GestureDetector>

            {pushStack.map((route, index) => (
                <NavigationCard
                    key={route.key}
                    route={route}
                    isTopCard={index === pushStack.length - 1}
                />
            ))}

            {sheetRoute ? <NavigationSheet route={sheetRoute} /> : null}
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.navigationBackdrop,
        },
        rootCardLayer: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.navigationSurface,
            overflow: 'hidden',
            shadowColor: theme.colors.navigationShadow,
            shadowOffset: {width: 0, height: 12},
            shadowRadius: 36,
            elevation: 20,
        },
        rootScrim: {
            backgroundColor: theme.colors.navigationScrim,
        },
        safeArea: {
            flex: 1,
        },
    });
}

export default NavigationRenderer;

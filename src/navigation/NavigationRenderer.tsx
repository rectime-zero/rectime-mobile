import React, {useEffect} from 'react';
import {Pressable, StyleSheet, View, useWindowDimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomNavigation from '../components/layout/navigation/BottomNavigation';
import SideMenu from '../components/layout/navigation/SideMenu';
import {getLeftCornerRadius, useDisplayCorners} from '../hooks/useDisplayCorners';
import {useTheme} from '../theme';
import NavigationCard from './NavigationCard';
import NavigationSheet from './NavigationSheet';
import {getMenuRevealWidth} from './menuLayout';
import {renderRootScreen} from './renderRoute';
import {useNavigation} from './useNavigation';

const SPRING_CONFIG = {
    damping: 24,
    stiffness: 220,
    mass: 0.95,
} as const;
const PUSH_ENTER_TRANSITION_MS = 240;
function NavigationRenderer() {
    const {theme} = useTheme();
    const {corners} = useDisplayCorners();
    const {width: screenWidth} = useWindowDimensions();
    const menuRevealWidth = getMenuRevealWidth(screenWidth);
    const shellCornerRadius = getLeftCornerRadius(corners);
    const {
        rootRoute,
        pushStack,
        sheetRoute,
        menuProgress,
        pushTransitionProgress,
        pushTransitionSourceProgress,
        pushTransitionMode,
        pushTransitionRouteKey,
        activeGestureValue,
        closeMenu,
        finishPushEnter,
        setActiveGesture,
    } = useNavigation();
    const topPushRoute = pushStack[pushStack.length - 1] ?? null;

    const rootCardPanStart = useSharedValue(0);
    const [isMenuInteractive, setIsMenuInteractive] = React.useState(false);
    const canOpenMenuGesture = pushStack.length === 0 && !sheetRoute;
    const canUseMenuGesture = canOpenMenuGesture || isMenuInteractive;

    useAnimatedReaction(
        () => menuProgress.value > 0.02,
        nextIsInteractive => {
            runOnJS(setIsMenuInteractive)(nextIsInteractive);
        },
        [menuProgress],
    );

    const handleCloseMenu = React.useCallback(() => {
        if (!isMenuInteractive || sheetRoute) {
            return;
        }

        setActiveGesture('none');
        closeMenu();
    }, [closeMenu, isMenuInteractive, setActiveGesture, sheetRoute]);

    const menuGesture = React.useMemo(
        () =>
            Gesture.Pan()
                .enabled(canUseMenuGesture)
                .activeOffsetX([-10, 10])
                .failOffsetY([-12, 12])
                .onStart(() => {
                    if (activeGestureValue.value !== 'none') {
                        return;
                    }

                    const canCloseMenu = menuProgress.value > 0.01 && !sheetRoute;
                    const canOpenMenu = menuProgress.value <= 0.01 && canOpenMenuGesture;

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

                    const shouldOpen =
                        event.velocityX > 700 || (event.velocityX > -700 && menuProgress.value > 0.45);
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
        [
            activeGestureValue,
            canOpenMenuGesture,
            canUseMenuGesture,
            menuProgress,
            menuRevealWidth,
            rootCardPanStart,
            setActiveGesture,
            sheetRoute,
        ],
    );

    useEffect(() => {
        if (
            !topPushRoute
            || topPushRoute.transitionSource !== 'side-menu'
            || pushTransitionMode !== 'enter'
            || pushTransitionRouteKey !== topPushRoute.key
        ) {
            return;
        }

        pushTransitionProgress.value = 0;
        pushTransitionProgress.value = withTiming(1, {duration: PUSH_ENTER_TRANSITION_MS}, finished => {
            if (finished) {
                runOnJS(finishPushEnter)(topPushRoute.key);
            }
        });
    }, [finishPushEnter, pushTransitionMode, pushTransitionProgress, pushTransitionRouteKey, topPushRoute]);

    const rootShellStyle = useAnimatedStyle(() => {
        let baseProgress = menuProgress.value;

        if (
            topPushRoute
            && topPushRoute.transitionSource === 'side-menu'
            && pushTransitionMode === 'enter'
            && pushTransitionRouteKey === topPushRoute.key
        ) {
            baseProgress = interpolate(pushTransitionProgress.value, [0, 1], [pushTransitionSourceProgress.value, 0]);
        }

        return {
            borderTopLeftRadius: shellCornerRadius,
            borderBottomLeftRadius: shellCornerRadius,
            shadowOpacity: interpolate(baseProgress, [0, 1], [0, 0.18]),
            transform: [{translateX: interpolate(baseProgress, [0, 1], [0, menuRevealWidth])}],
        };
    }, [corners, menuRevealWidth, menuProgress, pushTransitionMode, pushTransitionProgress, pushTransitionRouteKey, pushTransitionSourceProgress, shellCornerRadius, topPushRoute]);

    const scrimStyle = useAnimatedStyle(() => {
        let baseProgress = menuProgress.value;

        if (
            topPushRoute
            && topPushRoute.transitionSource === 'side-menu'
            && pushTransitionMode === 'enter'
            && pushTransitionRouteKey === topPushRoute.key
        ) {
            baseProgress = interpolate(pushTransitionProgress.value, [0, 1], [pushTransitionSourceProgress.value, 0]);
        }

        return {
            opacity: interpolate(baseProgress, [0, 1], [0, 0.18]),
        };
    });

    const bottomNavigationLayerStyle = useAnimatedStyle(() => {
        let baseProgress = menuProgress.value;

        if (
            topPushRoute
            && topPushRoute.transitionSource === 'side-menu'
            && pushTransitionMode === 'enter'
            && pushTransitionRouteKey === topPushRoute.key
        ) {
            baseProgress = interpolate(pushTransitionProgress.value, [0, 1], [pushTransitionSourceProgress.value, 0]);
        }

        return {
            transform: [{translateX: interpolate(baseProgress, [0, 1], [0, menuRevealWidth])}],
        };
    }, [menuRevealWidth, menuProgress, pushTransitionMode, pushTransitionProgress, pushTransitionRouteKey, pushTransitionSourceProgress, shellCornerRadius, topPushRoute]);

    const bottomNavigationClipStyle = useAnimatedStyle(() => {
        return {
            borderBottomLeftRadius: shellCornerRadius,
        };
    }, [shellCornerRadius]);

    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <GestureDetector gesture={menuGesture}>
                <View style={StyleSheet.absoluteFill}>
                    <SideMenu />

                    <Animated.View style={[styles.rootShellLayer, rootShellStyle]}>
                        <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
                            {renderRootScreen(rootRoute)}
                        </SafeAreaView>

                        <View
                            pointerEvents={isMenuInteractive ? 'auto' : 'none'}
                            style={StyleSheet.absoluteFillObject}>
                            <Pressable onPress={handleCloseMenu} style={StyleSheet.absoluteFill}>
                                <Animated.View style={[StyleSheet.absoluteFillObject, styles.rootScrim, scrimStyle]} />
                            </Pressable>
                        </View>
                    </Animated.View>
                </View>
            </GestureDetector>

            {pushStack.map((route, index) => (
                <NavigationCard
                    key={route.key}
                    route={route}
                    isTopCard={index === pushStack.length - 1}
                />
            ))}

            <Animated.View pointerEvents="box-none" style={[styles.navigationLayer, bottomNavigationLayerStyle]}>
                <Animated.View pointerEvents="box-none" style={[styles.navigationClip, bottomNavigationClipStyle]}>
                    <BottomNavigation />
                </Animated.View>
            </Animated.View>

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
        rootShellLayer: {
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
        navigationLayer: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 100,
            elevation: 100,
        },
        navigationClip: {
            ...StyleSheet.absoluteFillObject,
            overflow: 'hidden',
        },
    });
}

export default NavigationRenderer;

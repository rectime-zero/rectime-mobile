import React, {useEffect} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomNavigation from '../components/layout/BottomNavigation';
import SideMenu from '../components/layout/SideMenu';
import {useTheme} from '../theme';
import NavigationCard from './NavigationCard';
import NavigationSheet from './NavigationSheet';
import {getMenuRevealWidth} from './menuLayout';
import {renderPushScreen, renderRootScreen} from './renderRoute';
import {useNavigation} from './useNavigation';

const EDGE_WIDTH = 28;
const SPRING_CONFIG = {
    damping: 24,
    stiffness: 220,
    mass: 0.95,
} as const;
const MENU_PAGE_TRANSITION_MS = 240;

function NavigationRenderer() {
    const {theme} = useTheme();
    const {width: screenWidth} = useWindowDimensions();
    const menuRevealWidth = getMenuRevealWidth(screenWidth);
    const {
        rootRoute,
        menuPageRoute,
        menuPageTransitionMode,
        menuPageSource,
        pushStack,
        sheetRoute,
        menuProgress,
        menuPageTransitionProgress,
        menuPageSourceProgress,
        activeGestureValue,
        clearMenuPage,
        finishMenuPageEnter,
        setActiveGesture,
    } = useNavigation();

    const rootCardPanStart = useSharedValue(0);
    const canUseMenuGesture =
        pushStack.length === 0 && !menuPageRoute && menuPageTransitionMode === 'idle' && !sheetRoute;

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

    useEffect(() => {
        if (!menuPageRoute || menuPageTransitionMode !== 'enter') {
            return;
        }

        menuPageTransitionProgress.value = 0;
        menuPageTransitionProgress.value = withTiming(1, {duration: MENU_PAGE_TRANSITION_MS}, finished => {
            if (finished) {
                runOnJS(finishMenuPageEnter)();
            }
        });
    }, [finishMenuPageEnter, menuPageRoute, menuPageTransitionMode, menuPageTransitionProgress]);

    useEffect(() => {
        if (!menuPageRoute || menuPageTransitionMode !== 'exit') {
            return;
        }

        setActiveGesture('none');
        menuPageTransitionProgress.value = withTiming(0, {duration: MENU_PAGE_TRANSITION_MS}, finished => {
            if (finished) {
                runOnJS(clearMenuPage)(menuPageRoute.key);
            }
        });
    }, [clearMenuPage, menuPageRoute, menuPageTransitionMode, menuPageTransitionProgress, setActiveGesture]);

    const rootShellStyle = useAnimatedStyle(() => {
        let baseProgress = menuProgress.value;

        if (menuPageSource === 'side-menu' && menuPageRoute && menuPageTransitionMode === 'enter') {
            baseProgress = interpolate(menuPageTransitionProgress.value, [0, 1], [menuPageSourceProgress.value, 0]);
        }

        return {
            borderRadius: interpolate(baseProgress, [0, 1], [0, 32]),
            shadowOpacity: interpolate(baseProgress, [0, 1], [0, 0.18]),
            transform: [{translateX: interpolate(baseProgress, [0, 1], [0, menuRevealWidth])}],
        };
    });

    const scrimStyle = useAnimatedStyle(() => {
        let baseProgress = menuProgress.value;

        if (menuPageSource === 'side-menu' && menuPageRoute && menuPageTransitionMode === 'enter') {
            baseProgress = interpolate(menuPageTransitionProgress.value, [0, 1], [menuPageSourceProgress.value, 0]);
        }

        return {
            opacity: interpolate(baseProgress, [0, 1], [0, 0.18]),
        };
    });

    const menuPageStyle = useAnimatedStyle(() => {
        const enterStartX = menuPageSource === 'side-menu' ? menuRevealWidth : screenWidth;
        const exitEndX = screenWidth;

        if (menuPageTransitionMode === 'exit') {
            return {
                transform: [
                    {
                        translateX: interpolate(menuPageTransitionProgress.value, [0, 1], [exitEndX, 0]),
                    },
                ],
            };
        }

        return {
            transform: [
                {
                    translateX: interpolate(menuPageTransitionProgress.value, [0, 1], [enterStartX, 0]),
                },
            ],
        };
    });

    const bottomNavigationLayerStyle = useAnimatedStyle(() => {
        let baseProgress = menuProgress.value;

        if (menuPageSource === 'side-menu' && menuPageRoute && menuPageTransitionMode === 'enter') {
            baseProgress = interpolate(menuPageTransitionProgress.value, [0, 1], [menuPageSourceProgress.value, 0]);
        }

        return {
            borderRadius: interpolate(baseProgress, [0, 1], [0, 32]),
            transform: [{translateX: interpolate(baseProgress, [0, 1], [0, menuRevealWidth])}],
        };
    });

    const bottomNavigationClipStyle = useAnimatedStyle(() => {
        let baseProgress = menuProgress.value;

        if (menuPageSource === 'side-menu' && menuPageRoute && menuPageTransitionMode === 'enter') {
            baseProgress = interpolate(menuPageTransitionProgress.value, [0, 1], [menuPageSourceProgress.value, 0]);
        }

        const radius = interpolate(baseProgress, [0, 1], [0, 32]);

        return {
            borderBottomLeftRadius: radius,
            borderBottomRightRadius: radius,
        };
    });

    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <SideMenu />

            <GestureDetector gesture={menuGesture}>
                <Animated.View style={[styles.rootShellLayer, rootShellStyle]}>
                    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
                        {renderRootScreen(rootRoute)}
                    </SafeAreaView>

                    <Animated.View
                        pointerEvents="none"
                        style={[StyleSheet.absoluteFillObject, styles.rootScrim, scrimStyle]}
                    />
                </Animated.View>
            </GestureDetector>

            {menuPageRoute ? (
                <Animated.View style={[styles.menuPageLayer, menuPageStyle]}>
                    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
                        {renderPushScreen(menuPageRoute)}
                    </SafeAreaView>
                </Animated.View>
            ) : null}

            <Animated.View pointerEvents="box-none" style={[styles.navigationLayer, bottomNavigationLayerStyle]}>
                <Animated.View pointerEvents="box-none" style={[styles.navigationClip, bottomNavigationClipStyle]}>
                    <BottomNavigation />
                </Animated.View>
            </Animated.View>

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
        menuPageLayer: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.navigationSurface,
        },
        navigationLayer: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 20,
        },
        navigationClip: {
            ...StyleSheet.absoluteFillObject,
            overflow: 'hidden',
        },
    });
}

export default NavigationRenderer;

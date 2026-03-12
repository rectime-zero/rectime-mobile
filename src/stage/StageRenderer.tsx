import React from 'react';
import {Animated, PanResponder, SafeAreaView, StyleSheet, View} from 'react-native';
import SideMenu from './SideMenu';
import StagePushCard from './StagePushCard';
import StageSheet from './StageSheet';
import {renderRootScreen} from './renderStageRoute';
import {useStage} from './useStage';

const EDGE_WIDTH = 28;
const MENU_REVEAL_WIDTH = 280;

function StageRenderer() {
    const {
        rootRoute,
        pushStack,
        sheetRoute,
        menuProgress,
        menuProgressValueRef,
        activeGestureRef,
        setActiveGesture,
    } = useStage();

    const rootCardPanStart = React.useRef(0);

    const rootPanResponder = React.useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) => {
                    if (activeGestureRef.current !== 'none' || pushStack.length > 0 || !!sheetRoute) {
                        return false;
                    }

                    const isHorizontalSwipe =
                        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
                        Math.abs(gestureState.dx) > 4;

                    if (!isHorizontalSwipe) {
                        return false;
                    }

                    const canOpenMenu =
                        menuProgressValueRef.current === 0 && gestureState.x0 <= EDGE_WIDTH;
                    const canCloseMenu = menuProgressValueRef.current > 0.01;

                    if (!canOpenMenu && !canCloseMenu) {
                        return false;
                    }

                    rootCardPanStart.current = menuProgressValueRef.current;
                    setActiveGesture('menu');
                    return true;
                },
                onPanResponderMove: (_, gestureState) => {
                    if (activeGestureRef.current !== 'menu') {
                        return;
                    }

                    const nextProgress = Math.min(
                        1,
                        Math.max(0, rootCardPanStart.current + gestureState.dx / MENU_REVEAL_WIDTH),
                    );
                    menuProgress.setValue(nextProgress);
                },
                onPanResponderRelease: (_, gestureState) => {
                    if (activeGestureRef.current !== 'menu') {
                        return;
                    }

                    const shouldOpen =
                        menuProgressValueRef.current > 0.45 || gestureState.vx > 0.7;

                    Animated.spring(menuProgress, {
                        toValue: shouldOpen ? 1 : 0,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 18,
                    }).start(() => setActiveGesture('none'));
                },
                onPanResponderTerminate: () => {
                    if (activeGestureRef.current !== 'menu') {
                        return;
                    }

                    Animated.spring(menuProgress, {
                        toValue: menuProgressValueRef.current > 0.45 ? 1 : 0,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 18,
                    }).start(() => setActiveGesture('none'));
                },
            }),
        [activeGestureRef, menuProgress, menuProgressValueRef, pushStack.length, setActiveGesture, sheetRoute],
    );

    const translateX = menuProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, MENU_REVEAL_WIDTH],
    });
    const scale = menuProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.92],
    });
    const borderRadius = menuProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 32],
    });
    const scrimOpacity = menuProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.18],
    });
    const shadowOpacity = menuProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.18],
    });

    return (
        <View style={styles.container}>
            <SideMenu />

            <Animated.View
                {...rootPanResponder.panHandlers}
                style={[
                    styles.rootCardLayer,
                    {
                        borderRadius,
                        shadowOpacity,
                        transform: [{translateX}, {scale}],
                    },
                ]}>
                <SafeAreaView style={styles.safeArea}>{renderRootScreen(rootRoute)}</SafeAreaView>

                <Animated.View
                    pointerEvents="none"
                    style={[StyleSheet.absoluteFillObject, styles.rootScrim, {opacity: scrimOpacity}]}
                />
            </Animated.View>

            {pushStack.map((route, index) => (
                <StagePushCard
                    key={route.key}
                    route={route}
                    isTopCard={index === pushStack.length - 1}
                />
            ))}

            {sheetRoute ? <StageSheet route={sheetRoute} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    rootCardLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#E7ECF7',
        overflow: 'hidden',
        shadowColor: '#020617',
        shadowOffset: {width: 0, height: 12},
        shadowRadius: 36,
        elevation: 20,
    },
    rootScrim: {
        backgroundColor: '#020617',
    },
    safeArea: {
        flex: 1,
    },
});

export default StageRenderer;

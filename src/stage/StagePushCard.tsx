import React, {useEffect} from 'react';
import {Animated, Dimensions, PanResponder, SafeAreaView, StyleSheet, View} from 'react-native';
import {renderPushScreen} from './renderStageRoute';
import {type PushScreenName, type StageRoute} from './types';
import {useStage} from './useStage';

const EDGE_WIDTH = 28;
const {width: SCREEN_WIDTH} = Dimensions.get('window');

type StagePushCardProps = {
    route: StageRoute<PushScreenName>;
    isTopCard: boolean;
};

function StagePushCard({route, isTopCard}: StagePushCardProps) {
    const {activeGestureRef, completePop, setActiveGesture, sheetRoute} = useStage();
    const translateX = React.useRef(new Animated.Value(SCREEN_WIDTH)).current;
    const translateXValueRef = React.useRef(SCREEN_WIDTH);
    const dragStart = React.useRef(0);

    useEffect(() => {
        const listenerId = translateX.addListener(({value}) => {
            translateXValueRef.current = value;
        });

        Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
            speed: 18,
        }).start();

        return () => {
            translateX.removeListener(listenerId);
        };
    }, [translateX]);

    const panResponder = React.useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) => {
                    if (!isTopCard || !!sheetRoute || activeGestureRef.current !== 'none') {
                        return false;
                    }

                    const isHorizontalSwipe =
                        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
                        Math.abs(gestureState.dx) > 4;

                    if (!isHorizontalSwipe || gestureState.x0 > EDGE_WIDTH) {
                        return false;
                    }

                    dragStart.current = translateXValueRef.current;
                    setActiveGesture('back');
                    return true;
                },
                onPanResponderMove: (_, gestureState) => {
                    if (!isTopCard || activeGestureRef.current !== 'back') {
                        return;
                    }

                    translateX.setValue(Math.max(0, dragStart.current + gestureState.dx));
                },
                onPanResponderRelease: (_, gestureState) => {
                    if (!isTopCard || activeGestureRef.current !== 'back') {
                        return;
                    }

                    const shouldPop =
                        translateXValueRef.current > SCREEN_WIDTH * 0.35 || gestureState.vx > 0.9;

                    if (shouldPop) {
                        Animated.timing(translateX, {
                            toValue: SCREEN_WIDTH,
                            duration: 180,
                            useNativeDriver: true,
                        }).start(() => {
                            setActiveGesture('none');
                            completePop(route.key);
                        });
                        return;
                    }

                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 20,
                    }).start(() => setActiveGesture('none'));
                },
                onPanResponderTerminate: () => {
                    if (!isTopCard || activeGestureRef.current !== 'back') {
                        return;
                    }

                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 20,
                    }).start(() => setActiveGesture('none'));
                },
            }),
        [activeGestureRef, completePop, isTopCard, route.key, setActiveGesture, sheetRoute, translateX],
    );

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[styles.cardLayer, {transform: [{translateX}]}]}>
            <View style={styles.cardShadow} />
            <SafeAreaView style={styles.cardSurface}>{renderPushScreen(route)}</SafeAreaView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardLayer: {
        ...StyleSheet.absoluteFillObject,
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 8,
    },
    cardSurface: {
        flex: 1,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: '#E7ECF7',
    },
    cardShadow: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 30,
        backgroundColor: 'rgba(15, 23, 42, 0.08)',
    },
});

export default StagePushCard;

import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {renderPushScreen} from '../navigation/renderRoute';
import {type PushScreenName, type StageRoute} from '../navigation/types';
import {useStage} from './useStage';
import {useTheme} from '../theme';

const EDGE_WIDTH = 28;
const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SPRING_CONFIG = {
    damping: 24,
    stiffness: 220,
    mass: 0.95,
} as const;

type StagePushCardProps = {
    route: StageRoute<PushScreenName>;
    isTopCard: boolean;
};

function StagePushCard({route, isTopCard}: StagePushCardProps) {
    const {theme} = useTheme();
    const {activeGestureValue, completePop, setActiveGesture, sheetRoute} = useStage();
    const translateX = useSharedValue(SCREEN_WIDTH);
    const dragStart = useSharedValue(SCREEN_WIDTH);

    useEffect(() => {
        translateX.value = withSpring(0, SPRING_CONFIG);
    }, [translateX]);

    const backGesture = React.useMemo(
        () =>
            Gesture.Pan()
                .enabled(isTopCard && !sheetRoute)
                .activeOffsetX([-10, 10])
                .failOffsetY([-12, 12])
                .onStart(event => {
                    if (!isTopCard || activeGestureValue.value !== 'none' || event.absoluteX > EDGE_WIDTH) {
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

                    const shouldPop = translateX.value > SCREEN_WIDTH * 0.35 || event.velocityX > 900;
                    activeGestureValue.value = 'none';
                    runOnJS(setActiveGesture)('none');

                    if (shouldPop) {
                        translateX.value = withTiming(SCREEN_WIDTH, {duration: 180}, finished => {
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
        [activeGestureValue, completePop, dragStart, isTopCard, route.key, setActiveGesture, sheetRoute, translateX],
    );

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{translateX: translateX.value}],
    }));
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <GestureDetector gesture={backGesture}>
            <Animated.View style={[styles.cardLayer, cardStyle]}>
                <View style={styles.cardShadow} />
                <SafeAreaView style={styles.cardSurface}>{renderPushScreen(route)}</SafeAreaView>
            </Animated.View>
        </GestureDetector>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
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
            backgroundColor: theme.colors.stageSurface,
        },
        cardShadow: {
            ...StyleSheet.absoluteFillObject,
            borderRadius: 30,
            backgroundColor: theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(15, 23, 42, 0.08)',
        },
    });
}

export default StagePushCard;

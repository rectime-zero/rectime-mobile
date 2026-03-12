import React, {useEffect} from 'react';
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
import {renderSheetScreen} from './renderStageRoute';
import {type SheetScreenName, type StageRoute} from './types';
import {useStage} from './useStage';
import {useTheme} from '../theme';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const SPRING_CONFIG = {
    damping: 24,
    stiffness: 220,
    mass: 0.95,
} as const;

type StageSheetProps = {
    route: StageRoute<SheetScreenName>;
};

function StageSheet({route}: StageSheetProps) {
    const {theme} = useTheme();
    const insets = useSafeAreaInsets();
    const bottomInset = Math.max(insets.bottom, 18);
    const {activeGestureValue, clearSheet, setActiveGesture} = useStage();
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const backdropOpacity = useSharedValue(0);
    const dragStart = useSharedValue(0);

    useEffect(() => {
        translateY.value = withSpring(0, SPRING_CONFIG);
        backdropOpacity.value = withTiming(1, {duration: 180});
    }, [backdropOpacity, translateY]);

    const dismissSheet = React.useCallback(() => {
        setActiveGesture('none');
        backdropOpacity.value = withTiming(0, {duration: 140});
        translateY.value = withTiming(SCREEN_HEIGHT, {duration: 180}, finished => {
            if (finished) {
                runOnJS(clearSheet)(route.key);
            }
        });
    }, [backdropOpacity, clearSheet, route.key, setActiveGesture, translateY]);

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
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={dismissSheet} />
            </Animated.View>

            <GestureDetector gesture={sheetGesture}>
                <Animated.View style={[styles.sheet, {paddingBottom: bottomInset}, sheetStyle]}>
                    <View style={styles.handle} />
                    {renderSheetScreen(route)}
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        backdrop: {
            backgroundColor: theme.colors.overlayBackdrop,
        },
        sheet: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            backgroundColor: theme.colors.sheetBackground,
            paddingHorizontal: 20,
            paddingTop: 12,
            shadowColor: theme.colors.stageShadow,
            shadowOffset: {width: 0, height: -10},
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 18,
        },
        handle: {
            alignSelf: 'center',
            marginBottom: 16,
            width: 56,
            height: 8,
            borderRadius: 999,
            backgroundColor: theme.colors.sheetHandle,
        },
    });
}

export default StageSheet;

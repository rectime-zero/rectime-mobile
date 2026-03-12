import React, {useEffect} from 'react';
import {Animated, Dimensions, PanResponder, Platform, Pressable, StyleSheet, View} from 'react-native';
import {renderSheetScreen} from './renderStageRoute';
import {type SheetScreenName, type StageRoute} from './types';
import {useStage} from './useStage';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type StageSheetProps = {
    route: StageRoute<SheetScreenName>;
};

function StageSheet({route}: StageSheetProps) {
    const bottomInset = Platform.OS === 'ios' ? 34 : 18;
    const {activeGestureRef, clearSheet, setActiveGesture} = useStage();
    const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = React.useRef(new Animated.Value(0)).current;
    const translateYValueRef = React.useRef(SCREEN_HEIGHT);
    const dragStart = React.useRef(0);

    useEffect(() => {
        const listenerId = translateY.addListener(({value}) => {
            translateYValueRef.current = value;
        });

        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
            speed: 18,
        }).start();
        Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
        }).start();

        return () => {
            translateY.removeListener(listenerId);
        };
    }, [backdropOpacity, translateY]);

    const dismissSheet = () => {
        Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 140,
            useNativeDriver: true,
        }).start();
        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 180,
            useNativeDriver: true,
        }).start(({finished}) => {
            if (finished) {
                setActiveGesture('none');
                clearSheet(route.key);
            }
        });
    };

    const panResponder = React.useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) => {
                    if (activeGestureRef.current !== 'none') {
                        return false;
                    }

                    const isVerticalSwipe =
                        Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
                        Math.abs(gestureState.dy) > 4;

                    if (!isVerticalSwipe) {
                        return false;
                    }

                    dragStart.current = translateYValueRef.current;
                    setActiveGesture('sheet');
                    return true;
                },
                onPanResponderMove: (_, gestureState) => {
                    if (activeGestureRef.current !== 'sheet') {
                        return;
                    }

                    const nextY = Math.max(0, dragStart.current + gestureState.dy);
                    translateY.setValue(nextY);
                    backdropOpacity.setValue(Math.max(0.2, 1 - nextY / SCREEN_HEIGHT));
                },
                onPanResponderRelease: (_, gestureState) => {
                    if (activeGestureRef.current !== 'sheet') {
                        return;
                    }

                    const shouldDismiss =
                        translateYValueRef.current > SCREEN_HEIGHT * 0.18 || gestureState.vy > 1;

                    if (shouldDismiss) {
                        dismissSheet();
                        return;
                    }

                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 18,
                    }).start(() => setActiveGesture('none'));
                    Animated.timing(backdropOpacity, {
                        toValue: 1,
                        duration: 180,
                        useNativeDriver: true,
                    }).start();
                },
                onPanResponderTerminate: () => {
                    if (activeGestureRef.current !== 'sheet') {
                        return;
                    }

                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 18,
                    }).start(() => setActiveGesture('none'));
                    Animated.timing(backdropOpacity, {
                        toValue: 1,
                        duration: 180,
                        useNativeDriver: true,
                    }).start();
                },
            }),
        [activeGestureRef, backdropOpacity, clearSheet, route.key, setActiveGesture, translateY],
    );

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, {opacity: backdropOpacity}]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={dismissSheet} />
            </Animated.View>

            <Animated.View
                {...panResponder.panHandlers}
                style={[styles.sheet, {paddingBottom: bottomInset, transform: [{translateY}]}]}>
                <View style={styles.handle} />
                {renderSheetScreen(route)}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(15, 23, 42, 0.36)',
    },
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 12,
        shadowColor: '#020617',
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
        backgroundColor: '#CBD5E1',
    },
});

export default StageSheet;

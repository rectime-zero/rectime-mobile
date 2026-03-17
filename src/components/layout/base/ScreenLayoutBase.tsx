import React, {ReactNode} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../theme';
import {screenLayout, size} from '../../../tokens/layout';
import ScreenHeader from '../../header/ScreenHeader';

export type ScreenLayoutProps = {
    title: string;
    headerLeading?: ReactNode;
    headerTrailing?: ReactNode;
    children: ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
};

function ScreenLayoutBase({
    title,
    headerLeading,
    headerTrailing,
    children,
    contentContainerStyle,
}: ScreenLayoutProps) {
    const {theme} = useTheme();
    const insets = useSafeAreaInsets();
    const scrollY = useSharedValue(0);
    const styles = React.useMemo(() => createStyles(theme, insets.top), [theme, insets.top]);
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                contentContainerStyle={[styles.content, contentContainerStyle]}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}>
                {children}
            </Animated.ScrollView>

            <ScreenHeader leading={headerLeading} scrollY={scrollY} title={title} trailing={headerTrailing} />
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], topInset: number) {
    const headerHeight = topInset + size.headerAction + screenLayout.headerPaddingTop + screenLayout.headerPaddingBottom;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.navigationSurface,
        },
        content: {
            paddingTop: headerHeight,
            paddingHorizontal: screenLayout.horizontalPadding,
            paddingBottom: screenLayout.contentPaddingBottom,
            gap: screenLayout.contentGap,
        },
    });
}

export default ScreenLayoutBase;

import React, {ReactNode} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../theme';
import {screenLayout, size} from '../../../tokens/layout';
import ScreenHeader from '../../header/ScreenHeader';

type ScreenLayoutHeaderMode = 'inset' | 'overlay';
type ScreenLayoutScrollMode = 'scroll' | 'fixed';

type ScreenLayoutContentInsets = {
    horizontal?: boolean;
    bottom?: boolean;
    gap?: boolean;
};

export type ScreenLayoutProps = {
    title: string;
    headerLeading?: ReactNode;
    headerTrailing?: ReactNode;
    children: ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
    headerMode?: ScreenLayoutHeaderMode;
    scrollMode?: ScreenLayoutScrollMode;
    contentInsets?: ScreenLayoutContentInsets;
};

function ScreenLayoutBase({
    title,
    headerLeading,
    headerTrailing,
    children,
    contentContainerStyle,
    headerMode = 'inset',
    scrollMode = 'scroll',
    contentInsets,
}: ScreenLayoutProps) {
    const {theme} = useTheme();
    const insets = useSafeAreaInsets();
    const scrollY = useSharedValue(0);
    const styles = React.useMemo(
        () => createStyles(theme, insets.top, headerMode, contentInsets),
        [theme, insets.top, headerMode, contentInsets],
    );
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <View style={styles.container}>
            {scrollMode === 'scroll' ? (
                <Animated.ScrollView
                    contentContainerStyle={[styles.content, contentContainerStyle]}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}>
                    {children}
                </Animated.ScrollView>
            ) : (
                <View style={[styles.fixedContent, styles.content, contentContainerStyle]}>{children}</View>
            )}

            <ScreenHeader leading={headerLeading} scrollY={scrollY} title={title} trailing={headerTrailing} />
        </View>
    );
}

function createStyles(
    theme: ReturnType<typeof useTheme>['theme'],
    topInset: number,
    headerMode: ScreenLayoutHeaderMode,
    contentInsets?: ScreenLayoutContentInsets,
) {
    const headerHeight = topInset + size.headerAction + screenLayout.headerPaddingTop + screenLayout.headerPaddingBottom;
    const includeHorizontalPadding = contentInsets?.horizontal ?? true;
    const includeBottomPadding = contentInsets?.bottom ?? true;
    const includeGap = contentInsets?.gap ?? true;

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.navigationSurface,
        },
        content: {
            paddingTop: headerMode === 'overlay' ? 0 : headerHeight,
            paddingHorizontal: includeHorizontalPadding ? screenLayout.horizontalPadding : 0,
            paddingBottom: includeBottomPadding ? screenLayout.contentPaddingBottom : 0,
            gap: includeGap ? screenLayout.contentGap : 0,
        },
        fixedContent: {
            flex: 1,
        },
    });
}

export default ScreenLayoutBase;

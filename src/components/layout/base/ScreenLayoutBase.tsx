import React, {ReactNode} from 'react';
import {ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {useTheme} from '../../../theme';
import {screenLayout, size} from '../../../tokens/layout';

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
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.leading}>{headerLeading}</View>
                <Text numberOfLines={1} style={styles.title}>
                    {title}
                </Text>
                <View style={styles.trailing}>{headerTrailing}</View>
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, contentContainerStyle]}
                showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: screenLayout.headerGap,
            paddingHorizontal: screenLayout.horizontalPadding,
            paddingTop: screenLayout.headerPaddingTop,
            paddingBottom: screenLayout.headerPaddingBottom,
        },
        leading: {
            width: size.headerAction,
            alignItems: 'flex-start',
        },
        trailing: {
            width: size.headerAction,
            alignItems: 'flex-end',
        },
        title: {
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        content: {
            paddingHorizontal: screenLayout.horizontalPadding,
            paddingBottom: screenLayout.contentPaddingBottom,
            gap: screenLayout.contentGap,
        },
    });
}

export default ScreenLayoutBase;

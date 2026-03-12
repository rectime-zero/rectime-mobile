import React, {ReactNode} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import BottomNavigation from './BottomNavigation';
import {useTheme} from '../theme';

type PageLayoutProps = {
    title: string;
    headerLeading?: ReactNode;
    headerTrailing?: ReactNode;
    showBottomNavigation?: boolean;
    children: ReactNode;
};

function PageLayout({
    title,
    headerLeading,
    headerTrailing,
    showBottomNavigation = true,
    children,
}: PageLayoutProps) {
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
                contentContainerStyle={[
                    styles.content,
                    showBottomNavigation ? styles.contentWithBottomNavigation : null,
                ]}
                showsVerticalScrollIndicator={false}>
                {children}
            </ScrollView>

            {showBottomNavigation ? <BottomNavigation /> : null}
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
            gap: 12,
            paddingHorizontal: 18,
            paddingTop: 16,
            paddingBottom: 12,
        },
        leading: {
            width: 44,
            alignItems: 'flex-start',
        },
        trailing: {
            width: 44,
            alignItems: 'flex-end',
        },
        title: {
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        content: {
            paddingHorizontal: 18,
            paddingBottom: 28,
            gap: 14,
        },
        contentWithBottomNavigation: {
            paddingBottom: 112,
        },
    });
}

export default PageLayout;

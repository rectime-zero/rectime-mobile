import React, {ReactNode} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../theme';

type PageLayoutProps = {
    eyebrow: string;
    title: string;
    description: string;
    headerSlot?: ReactNode;
    children: ReactNode;
};

function PageLayout({eyebrow, title, description, headerSlot, children}: PageLayoutProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>{headerSlot}</View>
            <View className="gap-2 rounded-[28px] px-5 py-6" style={styles.hero}>
                <Text style={styles.eyebrow}>{eyebrow}</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            <View style={styles.section}>{children}</View>
        </ScrollView>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        content: {
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 32,
            gap: 20,
        },
        header: {
            minHeight: 24,
        },
        hero: {
            backgroundColor: theme.colors.surfaceInverse,
        },
        eyebrow: {
            color: theme.colors.textBrand,
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 1.1,
            textTransform: 'uppercase',
        },
        title: {
            color: theme.colors.textInverse,
            fontSize: 30,
            fontWeight: '800',
        },
        description: {
            color: theme.mode === 'dark' ? theme.colors.textSecondary : '#CBD5E1',
            fontSize: 14,
            lineHeight: 21,
        },
        section: {
            gap: 14,
        },
    });
}

export default PageLayout;

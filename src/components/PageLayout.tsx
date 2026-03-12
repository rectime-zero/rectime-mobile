import React, {ReactNode} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

type PageLayoutProps = {
    eyebrow: string;
    title: string;
    description: string;
    headerSlot?: ReactNode;
    children: ReactNode;
};

function PageLayout({eyebrow, title, description, headerSlot, children}: PageLayoutProps) {
    return (
        <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>{headerSlot}</View>
            <View className="gap-2 rounded-[28px] bg-slate-950 px-5 py-6">
                <Text className="text-xs font-bold uppercase tracking-[1.1px] text-blue-300">
                    {eyebrow}
                </Text>
                <Text className="text-3xl font-extrabold text-slate-50">{title}</Text>
                <Text className="text-sm leading-[21px] text-slate-300">{description}</Text>
            </View>
            <View style={styles.section}>{children}</View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 32,
        gap: 20,
    },
    header: {
        minHeight: 24,
    },
    section: {
        gap: 14,
    },
});

export default PageLayout;

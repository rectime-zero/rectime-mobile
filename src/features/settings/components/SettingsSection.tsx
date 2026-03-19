import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type SettingsSectionProps = {
    title: string;
    children: React.ReactNode;
};

function SettingsSection({title, children}: SettingsSectionProps) {
    const styles = React.useMemo(() => createStyles(), []);

    return (
        <View style={styles.section}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.card}>{children}</View>
        </View>
    );
}

function createStyles() {
    return StyleSheet.create({
        section: {
            gap: 10,
            marginBottom: 16,
        },
        title: {
            color: 'rgba(255, 255, 255, 0.35)',
            fontSize: 12,
            fontWeight: '700',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
        },
        card: {
            borderRadius: 6,
            backgroundColor: '#1C1C1C',
            overflow: 'hidden',
        },
    });
}

export default SettingsSection;

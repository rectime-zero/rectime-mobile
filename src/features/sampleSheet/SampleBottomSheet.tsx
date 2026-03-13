import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ActionButton from '../../components/ActionButton';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';

function SampleBottomSheet() {
    const {theme} = useTheme();
    const {dismissSheet} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>Bottom Sheet</Text>
            <Text style={styles.title}>下から現れるカード型 UI</Text>
            <Text style={styles.body}>
                drag dismiss に対応したサンプルです。タップだけでなく gesture を含む挙動確認を navigation
                層で一元管理できます。
            </Text>

            <View style={styles.panel}>
                <Text style={styles.panelTitle}>使いどころ</Text>
                <Text style={styles.body}>
                    popup menu、確認 UI、フィルター、追加フォームなどを navigation presentation で扱えます。
                </Text>
            </View>

            <ActionButton label="閉じる" onPress={dismissSheet} />
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            gap: 16,
        },
        eyebrow: {
            color: theme.colors.textMuted,
            fontSize: 12,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 1.1,
        },
        title: {
            color: theme.colors.textPrimary,
            fontSize: 24,
            fontWeight: '800',
        },
        body: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 24,
        },
        panel: {
            gap: 12,
            borderRadius: 24,
            padding: 16,
            backgroundColor: theme.colors.surfaceMuted,
        },
        panelTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '700',
        },
    });
}

export default SampleBottomSheet;

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import PageLayout from '../components/PageLayout';
import {useStage} from '../stage/useStage';
import {useTheme} from '../theme';

const rules = [
    '試合開始5分前までに指定エリアへ集合してください。',
    '会場内の撮影は可能ですが、フラッシュの使用は禁止です。',
    'ランキング対象試合は運営スタッフの確認後に記録が反映されます。',
    '混雑時は一部エリアで入場規制がかかる場合があります。',
];

function RulesScreen() {
    const {theme} = useTheme();
    const {openMenu} = useStage();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            eyebrow="Guidelines"
            title="ルール"
            description="参加者向けの基本ルールと当日の注意事項をまとめたページです。"
            headerSlot={
                <ActionButton
                    label="メニュー"
                    onPress={openMenu}
                    tone="secondary"
                    size="compact"
                />
            }>
            {rules.map(rule => (
                <View key={rule} style={styles.ruleRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.ruleText}>{rule}</Text>
                </View>
            ))}
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
    ruleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: theme.colors.surfacePrimary,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        padding: 16,
    },
    bullet: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 6,
        backgroundColor: theme.colors.bullet,
    },
    ruleText: {
        flex: 1,
        color: theme.colors.textSecondary,
        fontSize: 14,
        lineHeight: 22,
    },
    });
}

export default RulesScreen;

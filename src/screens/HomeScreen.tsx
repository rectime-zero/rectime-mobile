import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import PageLayout from '../components/PageLayout';
import {useStage} from '../stage/useStage';
import {availableThemes, useTheme, type ThemeMode} from '../theme';

const modes: Array<{key: ThemeMode; label: string}> = [
    {key: 'system', label: 'System'},
    {key: 'light', label: 'Light'},
    {key: 'dark', label: 'Dark'},
];

function HomeScreen() {
    const {theme, selectedMode, resolvedMode, selectedThemeId, setSelectedMode, setSelectedThemeId} = useTheme();
    const {openMenu, presentSheet, push} = useStage();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            eyebrow="Rectime Zero"
            title="ホーム"
            description="今日の進行、注目の試合、会場全体の空気感をひと目でつかめる入口です。"
            headerSlot={
                <View className="flex-row items-center justify-between gap-3">
                    <ActionButton
                        label="メニュー"
                        onPress={openMenu}
                        tone="secondary"
                        size="compact"
                    />
                    <Text className="text-xs font-bold uppercase tracking-[1.1px] text-slate-500">
                        Root Card
                    </Text>
                </View>
            }>
            <View className="flex-row gap-3">
                <View className="flex-1">
                    <ActionButton
                        label="詳細ページを開く"
                        onPress={() =>
                            push('detail', {
                                title: 'Aブロック 第2試合',
                                summary:
                                    '現在ページはそのまま残し、次ページだけが右から重なる構造です。',
                            })
                        }
                    />
                </View>
                <View className="flex-1">
                    <ActionButton
                        label="シートを出す"
                        onPress={() => presentSheet('sample-sheet', undefined)}
                        tone="secondary"
                    />
                </View>
            </View>

            <View style={styles.panel}>
                <Text style={styles.panelTitle}>Theme Sandbox</Text>
                <Text style={styles.panelBody}>
                    現在は `{selectedMode}` 指定で、実際の表示は `{resolvedMode}`。テーマは `{selectedThemeId}` です。
                </Text>
                <View className="flex-row flex-wrap gap-3">
                    {modes.map(mode => (
                        <View key={mode.key} className="min-w-[92px] flex-1">
                            <ActionButton
                                label={mode.label}
                                onPress={() => setSelectedMode(mode.key)}
                                tone={selectedMode === mode.key ? 'primary' : 'secondary'}
                                size="compact"
                            />
                        </View>
                    ))}
                </View>
                <View className="flex-row flex-wrap gap-3">
                    {availableThemes.map(item => (
                        <View key={item.id} className="min-w-[120px] flex-1">
                            <ActionButton
                                label={item.label}
                                onPress={() => setSelectedThemeId(item.id)}
                                tone={selectedThemeId === item.id ? 'primary' : 'ghost'}
                                size="compact"
                            />
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.grid}>
                <View style={[styles.card, styles.primaryCard]}>
                    <Text style={styles.cardLabel}>次の試合</Text>
                    <Text style={styles.primaryTitle}>Aブロック 第2試合</Text>
                    <Text style={styles.primaryMeta}>10:30 / センターコート</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>来場者</Text>
                    <Text style={styles.metric}>1,280</Text>
                    <Text style={styles.cardMeta}>会場内チェックイン</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>進行状況</Text>
                    <Text style={styles.metric}>68%</Text>
                    <Text style={styles.cardMeta}>本日のプログラム消化率</Text>
                </View>
            </View>

            <View style={styles.panel}>
                <Text style={styles.panelTitle}>今日のハイライト</Text>
                <Text style={styles.panelBody}>
                    午後はランキング上位同士の直接対決が続きます。マップから休憩エリアを確認して、
                    混雑前に移動しておくのがおすすめです。
                </Text>
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        grid: {
            gap: 14,
        },
        card: {
            backgroundColor: theme.colors.surfacePrimary,
            borderRadius: 24,
            padding: 18,
            gap: 6,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        primaryCard: {
            backgroundColor: theme.colors.surfaceAccent,
            borderColor: theme.colors.borderStrong,
        },
        cardLabel: {
            color: theme.colors.textSecondary,
            fontSize: 12,
            fontWeight: '700',
        },
        primaryTitle: {
            color: theme.colors.textPrimary,
            fontSize: 22,
            fontWeight: '800',
        },
        primaryMeta: {
            color: theme.colors.textBrand,
            fontSize: 14,
            fontWeight: '600',
        },
        metric: {
            color: theme.colors.textPrimary,
            fontSize: 28,
            fontWeight: '800',
        },
        cardMeta: {
            color: theme.colors.textMuted,
            fontSize: 13,
        },
        panel: {
            backgroundColor: theme.colors.surfaceMuted,
            borderRadius: 24,
            padding: 18,
            gap: 8,
        },
        panelTitle: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '700',
        },
        panelBody: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
        },
    });
}

export default HomeScreen;

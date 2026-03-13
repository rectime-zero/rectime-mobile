import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import HeaderIconButton from '../../components/HeaderIconButton';
import MenuAvatarButton from '../../components/MenuAvatarButton';
import PageLayout from '../../components/PageLayout';
import {type AppIconName} from '../../components/iconNames';
import {pushRoutes, sheetRoutes} from '../../config/navigationRoutes';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';

const actions = [
    {label: '次の試合', icon: 'play-circle' as AppIconName, tone: 'primary' as const},
    {label: '通知を確認', icon: 'bell' as AppIconName, tone: 'secondary' as const},
    {label: '会場メモ', icon: 'sticky-note' as AppIconName, tone: 'secondary' as const},
];

const highlights = [
    {label: '来場者', value: '1,280'},
    {label: '進行率', value: '68%'},
    {label: 'コート数', value: '12'},
];

function HomeScreen() {
    const {theme} = useTheme();
    const {openMenu, presentSheetRoute, pushRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<MenuAvatarButton onPress={openMenu} />}
            headerTrailing={<HeaderIconButton icon="bell" label="通知" onPress={() => presentSheetRoute(sheetRoutes.notifications)} />}
            title="ホーム">
            <View style={styles.heroCard}>
                <Text style={styles.heroEyebrow}>本日のメインイベント</Text>
                <Text style={styles.heroTitle}>100m走 決勝</Text>
                <Text style={styles.heroBody}>3年生ブロックが開始直前です。センターコート周辺はまもなく混雑します。</Text>
                <Pressable
                    onPress={() => pushRoute(pushRoutes.matchHistory('IA31', '直近5試合の結果と総合得点を確認できます。'))}
                    style={styles.heroAction}>
                    <Text style={styles.heroActionText}>詳細を見る</Text>
                    <FontAwesome5
                        color={theme.colors.textOnAccent}
                        iconStyle="solid"
                        name="chevron-right"
                        size={13}
                    />
                </Pressable>
            </View>

            <View style={styles.actionRow}>
                {actions.map(action => (
                    <Pressable
                        key={action.label}
                        onPress={() => {
                            if (action.label === '次の試合') {
                                pushRoute(pushRoutes.detail('Aブロック 第2試合', '右から重なるカードとして試合詳細を確認できます。'));
                                return;
                            }

                            presentSheetRoute(sheetRoutes.notifications);
                        }}
                        style={[
                            styles.actionCard,
                            action.tone === 'primary' ? styles.primaryActionCard : null,
                        ]}>
                        <FontAwesome5
                            color={action.tone === 'primary' ? theme.colors.textOnAccent : theme.colors.navigationActive}
                            iconStyle="solid"
                            name={action.icon}
                            size={16}
                        />
                        <Text
                            style={[
                                styles.actionLabel,
                                action.tone === 'primary' ? styles.primaryActionLabel : null,
                            ]}>
                            {action.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.metricsGrid}>
                {highlights.map(item => (
                    <View key={item.label} style={styles.metricCard}>
                        <Text style={styles.metricLabel}>{item.label}</Text>
                        <Text style={styles.metricValue}>{item.value}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.panel}>
                <Text style={styles.sectionTitle}>本日の動き</Text>
                <View style={styles.timelineRow}>
                    <View style={styles.timelineMarker} />
                    <View style={styles.timelineCard}>
                        <Text style={styles.timelineTitle}>09:30 開会式</Text>
                        <Text style={styles.timelineMeta}>アリーナ中央 / 司会進行あり</Text>
                    </View>
                </View>
                <View style={styles.timelineRow}>
                    <View style={[styles.timelineMarker, styles.timelineMarkerMuted]} />
                    <View style={styles.timelineCard}>
                        <Text style={styles.timelineTitle}>10:30 予選第2組</Text>
                        <Text style={styles.timelineMeta}>センターコート / 進行中</Text>
                    </View>
                </View>
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        heroCard: {
            borderRadius: 28,
            padding: 22,
            gap: 10,
            backgroundColor: theme.colors.surfaceAccentStrong,
        },
        heroEyebrow: {
            color: theme.colors.textBrand,
            fontSize: 12,
            fontWeight: '700',
        },
        heroTitle: {
            color: theme.colors.textOnAccent,
            fontSize: 30,
            fontWeight: '800',
        },
        heroBody: {
            color: theme.colors.textOnAccent,
            fontSize: 14,
            lineHeight: 22,
            opacity: 0.92,
        },
        heroAction: {
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            paddingHorizontal: 14,
            paddingVertical: 12,
        },
        heroActionText: {
            color: theme.colors.textOnAccent,
            fontSize: 14,
            fontWeight: '700',
        },
        actionRow: {
            flexDirection: 'row',
            gap: 12,
        },
        actionCard: {
            flex: 1,
            minHeight: 88,
            borderRadius: 22,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            paddingHorizontal: 14,
            paddingVertical: 16,
            justifyContent: 'space-between',
        },
        primaryActionCard: {
            backgroundColor: theme.colors.navigationBackground,
            borderColor: theme.colors.navigationBackground,
        },
        actionLabel: {
            color: theme.colors.textPrimary,
            fontSize: 14,
            fontWeight: '700',
        },
        primaryActionLabel: {
            color: theme.colors.textOnAccent,
        },
        metricsGrid: {
            flexDirection: 'row',
            gap: 12,
        },
        metricCard: {
            flex: 1,
            borderRadius: 22,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            padding: 16,
            gap: 8,
        },
        metricLabel: {
            color: theme.colors.textMuted,
            fontSize: 13,
            fontWeight: '600',
        },
        metricValue: {
            color: theme.colors.textPrimary,
            fontSize: 28,
            fontWeight: '800',
        },
        panel: {
            borderRadius: 26,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            padding: 18,
            gap: 14,
        },
        sectionTitle: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        timelineRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        timelineMarker: {
            width: 10,
            height: 52,
            borderRadius: 5,
            backgroundColor: theme.colors.navigationActive,
        },
        timelineMarkerMuted: {
            backgroundColor: theme.colors.textMuted,
        },
        timelineCard: {
            flex: 1,
            borderRadius: 18,
            backgroundColor: theme.colors.surfaceMuted,
            paddingHorizontal: 14,
            paddingVertical: 14,
            gap: 4,
        },
        timelineTitle: {
            color: theme.colors.textPrimary,
            fontSize: 15,
            fontWeight: '700',
        },
        timelineMeta: {
            color: theme.colors.textSecondary,
            fontSize: 13,
        },
    });
}

export default HomeScreen;

import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import RootScreenLayout from '../../components/layout/screen/RootScreenLayout';
import {pushRoutes} from '../../config/navigationRoutes';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';
import {homeActions, homeHighlights} from './data';

function HomeScreen() {
    const {theme} = useTheme();
    const {pushRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <RootScreenLayout>
            <View style={styles.heroCard}>
                <Text style={styles.heroEyebrow}>本日のメインイベント</Text>
                <Text style={styles.heroTitle}>100m走 決勝</Text>
                <Text style={styles.heroBody}>
                    3年生ブロックが開始直前です。センターコート周辺はまもなく混雑します。
                </Text>
                <Pressable
                    onPress={() => pushRoute(pushRoutes.matchInfo('IA31', '予選から決勝までの勝ち上がりを確認できます。'))}
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
                {homeActions.map(action => (
                    <Pressable
                        key={action.label}
                        onPress={() => {
                            if (action.label === '次の試合') {
                                pushRoute(
                                    pushRoutes.detail(
                                        'Aブロック 第2試合',
                                        '勝敗と得点推移をまとめたカードとして試合詳細を確認できます。',
                                    ),
                                );
                                return;
                            }

                            pushRoute(pushRoutes.notifications());
                        }}
                        style={action.tone === 'primary' ? styles.primaryActionCard : styles.actionCard}>
                        <FontAwesome5
                            color={action.tone === 'primary' ? theme.colors.textOnAccent : theme.colors.navigationActive}
                            iconStyle="solid"
                            name={action.icon}
                            size={16}
                        />
                        <Text style={action.tone === 'primary' ? styles.primaryActionLabel : styles.actionLabel}>
                            {action.label}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.metricsGrid}>
                {homeHighlights.map(item => (
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
                    <View style={styles.timelineMarkerMuted} />
                    <View style={styles.timelineCard}>
                        <Text style={styles.timelineTitle}>10:30 予選第2組</Text>
                        <Text style={styles.timelineMeta}>センターコート / 進行中</Text>
                    </View>
                </View>
            </View>
        </RootScreenLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        heroCard: {
            borderRadius: 28,
            padding: 22,
            backgroundColor: theme.colors.surfaceAccentStrong,
        },
        heroEyebrow: {
            color: theme.colors.textBrand,
            fontSize: 12,
            fontWeight: '700',
        },
        heroTitle: {
            marginTop: 8,
            color: theme.colors.textOnAccent,
            fontSize: 30,
            fontWeight: '800',
        },
        heroBody: {
            marginTop: 8,
            color: theme.colors.textOnAccent,
            fontSize: 14,
            lineHeight: 22,
            opacity: 0.92,
        },
        heroAction: {
            marginTop: 16,
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
        },
        heroActionText: {
            color: theme.colors.textOnAccent,
            fontSize: 14,
            fontWeight: '700',
        },
        actionRow: {
            marginTop: 12,
            flexDirection: 'row',
            gap: 12,
        },
        actionCard: {
            flex: 1,
            minHeight: 88,
            justifyContent: 'space-between',
            borderRadius: 22,
            paddingHorizontal: 14,
            paddingVertical: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        primaryActionCard: {
            flex: 1,
            minHeight: 88,
            justifyContent: 'space-between',
            borderRadius: 22,
            paddingHorizontal: 14,
            paddingVertical: 16,
            backgroundColor: theme.colors.navigationBackground,
            borderWidth: 1,
            borderColor: theme.colors.navigationBackground,
        },
        actionLabel: {
            color: theme.colors.textPrimary,
            fontSize: 14,
            fontWeight: '700',
        },
        primaryActionLabel: {
            color: theme.colors.textOnAccent,
            fontSize: 14,
            fontWeight: '700',
        },
        metricsGrid: {
            marginTop: 12,
            flexDirection: 'row',
            gap: 12,
        },
        metricCard: {
            flex: 1,
            borderRadius: 22,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        metricLabel: {
            color: theme.colors.textMuted,
            fontSize: 13,
            fontWeight: '600',
        },
        metricValue: {
            marginTop: 8,
            color: theme.colors.textPrimary,
            fontSize: 28,
            fontWeight: '800',
        },
        panel: {
            marginTop: 12,
            gap: 14,
            borderRadius: 26,
            padding: 18,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
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
            width: 10,
            height: 52,
            borderRadius: 5,
            backgroundColor: theme.colors.textMuted,
        },
        timelineCard: {
            flex: 1,
            borderRadius: 18,
            paddingHorizontal: 14,
            paddingVertical: 14,
            backgroundColor: theme.colors.surfaceMuted,
        },
        timelineTitle: {
            color: theme.colors.textPrimary,
            fontSize: 15,
            fontWeight: '700',
        },
        timelineMeta: {
            marginTop: 4,
            color: theme.colors.textSecondary,
            fontSize: 13,
        },
    });
}

export default HomeScreen;

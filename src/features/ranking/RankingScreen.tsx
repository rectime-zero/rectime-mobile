import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import AccessoryButton from '../../components/button/AccessoryButton';
import PageLayout from '../../components/layout/PageLayout';
import OpenMenuButton from '../../navigation/components/OpenMenuButton';
import {pushRoutes, sheetRoutes} from '../../config/navigationRoutes';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';
import {rankingEntries} from './data';

function RankingScreen() {
    const {theme} = useTheme();
    const {presentSheetRoute, pushRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<OpenMenuButton />}
            headerTrailing={
                <AccessoryButton
                    accessibilityLabel="通知"
                    icon="bell"
                    onPress={() => presentSheetRoute(sheetRoutes.notifications)}
                />
            }
            title="ランキング">
            <Text style={styles.sectionLabel}>総合順位</Text>

            <View style={styles.topGrid}>
                <Pressable
                    onPress={() => pushRoute(pushRoutes.matchInfo('IA31', '最新の試合結果と順位推移を確認できます。'))}
                    style={styles.firstCard}>
                    <View style={styles.topBadge}>
                        <Text style={styles.topBadgeText}>{rankingEntries[0].medal}</Text>
                    </View>
                    <Text style={styles.topName}>{rankingEntries[0].name}</Text>
                    <Text style={styles.topPoint}>{rankingEntries[0].point} pts</Text>
                    <FontAwesome5
                        color="rgba(255,255,255,0.18)"
                        iconStyle="solid"
                        name="trophy"
                        size={72}
                        style={styles.topIcon}
                    />
                </Pressable>

                <Pressable
                    onPress={() => pushRoute(pushRoutes.matchInfo('IH22', '上位チームの試合サマリーを確認できます。'))}
                    style={styles.secondCard}>
                    <View style={styles.topBadge}>
                        <Text style={styles.topBadgeText}>{rankingEntries[1].medal}</Text>
                    </View>
                    <Text style={styles.topName}>{rankingEntries[1].name}</Text>
                    <Text style={styles.topPoint}>{rankingEntries[1].point} pts</Text>
                </Pressable>
            </View>

            <Pressable
                onPress={() => pushRoute(pushRoutes.matchInfo('IS41', '決勝までの試合内容を一覧で確認できます。'))}
                style={styles.thirdRow}>
                <View style={styles.thirdRank}>
                    <Text style={styles.thirdRankText}>3</Text>
                </View>
                <Text style={styles.thirdName}>{rankingEntries[2].name}</Text>
                <Text style={styles.thirdPoint}>{rankingEntries[2].point} pts</Text>
            </Pressable>

            <View style={styles.listCard}>
                {rankingEntries.slice(3).map((item, index) => (
                    <Pressable
                        key={item.name}
                        onPress={() => pushRoute(pushRoutes.matchInfo(item.name, 'チーム別の試合結果と得点履歴を確認できます。'))}
                        style={[styles.listRow, index < rankingEntries.slice(3).length - 1 ? styles.listRowBorder : null]}>
                        <Text style={styles.listRank}>{index + 4}</Text>
                        <Text style={styles.listName}>{item.name}</Text>
                        <Text style={styles.listPoint}>{item.point} pts</Text>
                    </Pressable>
                ))}
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        sectionLabel: {
            color: theme.colors.textSecondary,
            fontSize: 16,
            fontWeight: '700',
        },
        topGrid: {
            marginTop: 12,
            flexDirection: 'row',
            gap: 12,
        },
        firstCard: {
            flex: 1,
            minHeight: 176,
            overflow: 'hidden',
            borderRadius: 24,
            padding: 18,
            backgroundColor: '#EAB308',
        },
        secondCard: {
            flex: 1,
            minHeight: 176,
            overflow: 'hidden',
            borderRadius: 24,
            padding: 18,
            backgroundColor: '#BFC6D2',
        },
        topBadge: {
            alignSelf: 'flex-start',
            borderRadius: 12,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: 'rgba(255,255,255,0.22)',
        },
        topBadgeText: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '800',
        },
        topName: {
            marginTop: 14,
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: '900',
        },
        topPoint: {
            marginTop: 'auto',
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '700',
        },
        topIcon: {
            position: 'absolute',
            right: 12,
            bottom: 10,
        },
        thirdRow: {
            marginTop: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            borderRadius: 22,
            paddingHorizontal: 16,
            paddingVertical: 18,
            backgroundColor: '#FB923C',
        },
        thirdRank: {
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.22)',
        },
        thirdRankText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '800',
        },
        thirdName: {
            flex: 1,
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '800',
        },
        thirdPoint: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '700',
        },
        listCard: {
            marginTop: 12,
            overflow: 'hidden',
            borderRadius: 24,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        listRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingHorizontal: 16,
            paddingVertical: 18,
        },
        listRowBorder: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderSubtle,
        },
        listRank: {
            width: 24,
            color: theme.colors.textMuted,
            fontSize: 18,
            fontWeight: '800',
        },
        listName: {
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        listPoint: {
            color: theme.colors.textSecondary,
            fontSize: 18,
            fontWeight: '700',
        },
    });
}

export default RankingScreen;

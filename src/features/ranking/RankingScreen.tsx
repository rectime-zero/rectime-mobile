import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import HeaderIconButton from '../../components/HeaderIconButton';
import MenuAvatarButton from '../../components/MenuAvatarButton';
import PageLayout from '../../components/PageLayout';
import {pushRoutes, sheetRoutes} from '../../config/stageRoutes';
import {useStage} from '../../presentation/useStage';
import {useTheme} from '../../theme';

const ranking = [
    {name: 'IA31', point: 450, medal: '1位', tone: 'gold' as const},
    {name: 'IH22', point: 420, medal: '2位', tone: 'silver' as const},
    {name: 'IS41', point: 390, medal: '3位', tone: 'bronze' as const},
    {name: 'IW11', point: 350},
    {name: 'IA21', point: 340},
    {name: 'IH12', point: 310},
];

function RankingScreen() {
    const {theme} = useTheme();
    const {openMenu, presentSheetRoute, pushRoute} = useStage();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<MenuAvatarButton onPress={openMenu} />}
            headerTrailing={<HeaderIconButton icon="bell" label="通知" onPress={() => presentSheetRoute(sheetRoutes.notifications)} />}
            title="ランキング">
            <Text style={styles.sectionLabel}>総合順位</Text>

            <View style={styles.topGrid}>
                <Pressable
                    onPress={() => pushRoute(pushRoutes.matchHistory('IA31', '最新の勝敗と得点推移を確認できます。'))}
                    style={[styles.topCard, styles.firstCard]}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{ranking[0].medal}</Text>
                    </View>
                    <Text style={styles.topName}>{ranking[0].name}</Text>
                    <Text style={styles.topPoint}>{ranking[0].point} pts</Text>
                    <FontAwesome5
                        color="rgba(255,255,255,0.18)"
                        iconStyle="solid"
                        name="trophy"
                        size={72}
                        style={styles.topIcon}
                    />
                </Pressable>

                <Pressable
                    onPress={() => pushRoute(pushRoutes.matchHistory('IH22', '上位チームの勝敗サマリーです。'))}
                    style={[styles.topCard, styles.secondCard]}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{ranking[1].medal}</Text>
                    </View>
                    <Text style={styles.topName}>{ranking[1].name}</Text>
                    <Text style={styles.topPoint}>{ranking[1].point} pts</Text>
                </Pressable>
            </View>

            <Pressable
                onPress={() => pushRoute(pushRoutes.matchHistory('IS41', '直近5試合の結果を一覧で確認できます。'))}
                style={styles.thirdRow}>
                <View style={styles.thirdRank}>
                    <Text style={styles.thirdRankText}>3</Text>
                </View>
                <Text style={styles.thirdName}>{ranking[2].name}</Text>
                <Text style={styles.thirdPoint}>{ranking[2].point} pts</Text>
            </Pressable>

            <View style={styles.listCard}>
                {ranking.slice(3).map((item, index) => (
                    <Pressable
                        key={item.name}
                        onPress={() => pushRoute(pushRoutes.matchHistory(item.name, '順位テーブルから選んだチームの履歴です。'))}
                        style={[
                            styles.listRow,
                            index < ranking.slice(3).length - 1 ? styles.listRowBorder : null,
                        ]}>
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
            flexDirection: 'row',
            gap: 12,
        },
        topCard: {
            flex: 1,
            minHeight: 176,
            borderRadius: 24,
            padding: 18,
            overflow: 'hidden',
        },
        firstCard: {
            backgroundColor: '#EAB308',
        },
        secondCard: {
            backgroundColor: '#BFC6D2',
        },
        badge: {
            alignSelf: 'flex-start',
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.22)',
            paddingHorizontal: 10,
            paddingVertical: 6,
        },
        badgeText: {
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
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 22,
            backgroundColor: '#FB923C',
            paddingHorizontal: 16,
            paddingVertical: 18,
            gap: 14,
        },
        thirdRank: {
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.25)',
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
            borderRadius: 24,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            overflow: 'hidden',
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

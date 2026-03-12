import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import PageLayout from '../components/PageLayout';
import {useStage} from '../stage/useStage';
import {useTheme} from '../theme';

const ranking = [
    {name: 'Team Horizon', point: 96, trend: '+4'},
    {name: 'Blue Orbit', point: 91, trend: '+1'},
    {name: 'North Axis', point: 88, trend: '-2'},
    {name: 'Core Pulse', point: 84, trend: '+3'},
];

function RankingScreen() {
    const {theme} = useTheme();
    const {openMenu} = useStage();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            eyebrow="Standings"
            title="ランキング"
            description="上位チームの並びとポイント差を一覧で見られます。順位変動もすぐ追えます。"
            headerSlot={
                <ActionButton
                    label="メニュー"
                    onPress={openMenu}
                    tone="secondary"
                    size="compact"
                />
            }>
            {ranking.map((item, index) => (
                <View key={item.name} style={styles.card}>
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>{index + 1}</Text>
                    </View>
                    <View style={styles.main}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.meta}>前日比 {item.trend}</Text>
                    </View>
                    <Text style={styles.point}>{item.point}</Text>
                </View>
            ))}
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surfacePrimary,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    rankBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.rankBadge,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        color: theme.colors.rankBadgeText,
        fontSize: 18,
        fontWeight: '800',
    },
    main: {
        flex: 1,
        gap: 4,
    },
    name: {
        color: theme.colors.textPrimary,
        fontSize: 17,
        fontWeight: '700',
    },
    meta: {
        color: theme.colors.textMuted,
        fontSize: 13,
    },
    point: {
        color: theme.colors.textPrimary,
        fontSize: 24,
        fontWeight: '800',
    },
    });
}

export default RankingScreen;

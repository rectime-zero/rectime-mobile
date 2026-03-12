import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import PageLayout from '../components/PageLayout';
import {useStage} from '../stage/useStage';
import {useTheme} from '../theme';

const items = [
    {time: '09:30', title: '受付開始', place: 'エントランス'},
    {time: '10:30', title: 'Aブロック 第2試合', place: 'センターコート'},
    {time: '12:00', title: 'ランチブレイク', place: 'フードエリア'},
    {time: '14:10', title: 'ランキング上位戦', place: 'サブコートA'},
    {time: '17:00', title: 'ルール説明会', place: 'イベントステージ'},
];

function ScheduleScreen() {
    const {theme} = useTheme();
    const {openMenu} = useStage();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            eyebrow="Timeline"
            title="スケジュール"
            description="1日の流れを時系列で追えるページです。開始時刻と場所を見ながら動線を決められます。"
            headerSlot={
                <ActionButton
                    label="メニュー"
                    onPress={openMenu}
                    tone="secondary"
                    size="compact"
                />
            }>
            {items.map(item => (
                <View key={item.time} style={styles.row}>
                    <View style={styles.timeBox}>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.place}>{item.place}</Text>
                    </View>
                </View>
            ))}
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 12,
    },
    timeBox: {
        width: 72,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.timelinePill,
        borderRadius: 18,
    },
    time: {
        color: theme.colors.timelinePillText,
        fontSize: 14,
        fontWeight: '800',
    },
    card: {
        flex: 1,
        backgroundColor: theme.colors.surfacePrimary,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        padding: 16,
        gap: 4,
    },
    title: {
        color: theme.colors.textPrimary,
        fontSize: 17,
        fontWeight: '700',
    },
    place: {
        color: theme.colors.textMuted,
        fontSize: 13,
    },
    });
}

export default ScheduleScreen;

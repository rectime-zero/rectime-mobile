import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import HeaderIconButton from '../components/HeaderIconButton';
import MenuAvatarButton from '../components/MenuAvatarButton';
import PageLayout from '../components/PageLayout';
import {sheetRoutes} from '../config/stageRoutes';
import {useStage} from '../stage/useStage';
import {useTheme} from '../theme';

const entries = [
    {time: '09:00', title: '開会式', range: '09:00 - 09:30', accent: 'blue' as const},
    {time: '09:45', title: '100m走 予選', range: '09:45 - 10:30', accent: 'blue' as const},
    {time: '11:00', title: '部活動対抗リレー', range: '11:00 - 11:30', accent: 'red' as const},
    {time: '13:00', title: '綱引き 予選', range: '13:00 - 13:40', accent: 'orange' as const},
];

function ScheduleScreen() {
    const {theme, selectedThemeId} = useTheme();
    const {openMenu, presentSheetRoute} = useStage();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<MenuAvatarButton onPress={openMenu} />}
            headerTrailing={<HeaderIconButton icon="bell" label="通知" onPress={() => presentSheetRoute(sheetRoutes.notifications)} />}
            title="タイムテーブル">
            <View style={styles.topRow}>
                <Text style={styles.date}>3月9日</Text>
                <View style={styles.switcher}>
                    <View style={styles.switcherActive}>
                        <FontAwesome5
                            color={theme.colors.navigationActive}
                            iconStyle="regular"
                            name="calendar-alt"
                            size={16}
                        />
                    </View>
                    <View style={styles.switcherInactive}>
                        <FontAwesome5 color={theme.colors.textMuted} iconStyle="regular" name="clock" size={16} />
                    </View>
                </View>
            </View>

            <View style={styles.timeline}>
                {entries.map(entry => (
                    <View key={entry.time} style={styles.entryRow}>
                        <Text style={styles.axisLabel}>{entry.time}</Text>
                        <View style={styles.axisTrack} />
                        <View
                            style={[
                                styles.entryCard,
                                entry.accent === 'blue' ? styles.entryCardBlue : null,
                                entry.accent === 'red' ? styles.entryCardRed : null,
                                entry.accent === 'orange' ? styles.entryCardOrange : null,
                            ]}>
                            <View
                                style={[
                                    styles.entryAccent,
                                    entry.accent === 'blue' ? styles.entryAccentBlue : null,
                                    entry.accent === 'red' ? styles.entryAccentRed : null,
                                    entry.accent === 'orange' ? styles.entryAccentOrange : null,
                                ]}
                            />
                            <View style={styles.entryContent}>
                                <Text style={styles.entryTitle}>{entry.title}</Text>
                                <Text style={styles.entryRange}>{entry.range}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.noteCard}>
                <Text style={styles.noteTitle}>表示テーマ</Text>
                <Text style={styles.noteBody}>現在の配色は {selectedThemeId} です。時間軸とカードはこのテーマに合わせて変化します。</Text>
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        date: {
            color: theme.colors.textPrimary,
            fontSize: 20,
            fontWeight: '800',
        },
        switcher: {
            flexDirection: 'row',
            borderRadius: 16,
            backgroundColor: theme.colors.surfaceMuted,
            padding: 6,
            gap: 6,
        },
        switcherActive: {
            width: 42,
            height: 36,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surfacePrimary,
        },
        switcherInactive: {
            width: 42,
            height: 36,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        timeline: {
            gap: 10,
        },
        entryRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        axisLabel: {
            width: 44,
            color: theme.colors.textMuted,
            fontSize: 13,
            fontWeight: '700',
        },
        axisTrack: {
            width: 1,
            alignSelf: 'stretch',
            backgroundColor: theme.colors.borderSubtle,
            marginVertical: 6,
        },
        entryCard: {
            flex: 1,
            flexDirection: 'row',
            overflow: 'hidden',
            borderRadius: 18,
            backgroundColor: theme.colors.surfaceMuted,
            minHeight: 74,
        },
        entryCardBlue: {
            backgroundColor: theme.colors.surfaceAccent,
        },
        entryCardRed: {
            backgroundColor: theme.colors.surfaceDanger,
        },
        entryCardOrange: {
            backgroundColor: theme.colors.surfaceWarning,
        },
        entryAccent: {
            width: 4,
        },
        entryAccentBlue: {
            backgroundColor: theme.colors.navigationActive,
        },
        entryAccentRed: {
            backgroundColor: theme.colors.textDanger,
        },
        entryAccentOrange: {
            backgroundColor: theme.colors.textWarning,
        },
        entryContent: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 14,
            paddingVertical: 12,
            gap: 4,
        },
        entryTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '800',
        },
        entryRange: {
            color: theme.colors.textSecondary,
            fontSize: 13,
            fontWeight: '600',
        },
        noteCard: {
            borderRadius: 22,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            padding: 16,
            gap: 8,
        },
        noteTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '700',
        },
        noteBody: {
            color: theme.colors.textSecondary,
            fontSize: 13,
            lineHeight: 20,
        },
    });
}

export default ScheduleScreen;

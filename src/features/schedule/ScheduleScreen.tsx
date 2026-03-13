import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {StyleSheet, Text, View} from 'react-native';
import HeaderIconButton from '../../components/HeaderIconButton';
import MenuAvatarButton from '../../components/MenuAvatarButton';
import PageLayout from '../../components/PageLayout';
import {sheetRoutes} from '../../config/navigationRoutes';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';
import {scheduleCopy, scheduleEntries} from './data';

function ScheduleScreen() {
    const {theme, selectedThemeId} = useTheme();
    const {openMenu, presentSheetRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<MenuAvatarButton onPress={openMenu} />}
            headerTrailing={
                <HeaderIconButton
                    icon="bell"
                    label="通知"
                    onPress={() => presentSheetRoute(sheetRoutes.notifications)}
                />
            }
            title="タイムテーブル">
            <View style={styles.topRow}>
                <Text style={styles.date}>{scheduleCopy.date}</Text>
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
                {scheduleEntries.map(entry => (
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
                <Text style={styles.noteTitle}>{scheduleCopy.noteTitle}</Text>
                <Text style={styles.noteBody}>
                    現在の配色は {selectedThemeId} です。時間軸とカードはこのテーマに合わせて変化します。
                </Text>
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
            gap: 6,
            borderRadius: 16,
            padding: 6,
            backgroundColor: theme.colors.surfaceMuted,
        },
        switcherActive: {
            width: 42,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            backgroundColor: theme.colors.surfacePrimary,
        },
        switcherInactive: {
            width: 42,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
        },
        timeline: {
            marginTop: 12,
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
            marginVertical: 6,
            backgroundColor: theme.colors.borderSubtle,
        },
        entryCard: {
            flex: 1,
            flexDirection: 'row',
            minHeight: 74,
            overflow: 'hidden',
            borderRadius: 18,
            backgroundColor: theme.colors.surfaceMuted,
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
            gap: 4,
            paddingHorizontal: 14,
            paddingVertical: 12,
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
            marginTop: 12,
            gap: 8,
            borderRadius: 22,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
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

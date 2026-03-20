import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RootScreenLayout from '../../components/layout/screen/RootScreenLayout';
import {pushRoutes} from '../../config/navigationRoutes';
import type {TimetableLayoutItem} from '../../domain/timetable';
import TimetableView from '../../features/timetable/components/TimetableView';
import {loadMockTimetableItems} from '../../infrastructure/timetable';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const;

function formatScheduleDate(date: Date) {
    return {
        monthDay: `${date.getMonth() + 1}月${date.getDate()}日`,
        weekday: `${WEEKDAY_LABELS[date.getDay()]}曜日`,
    };
}

function ScheduleScreen() {
    const {theme} = useTheme();
    const {pushRoute} = useNavigation();
    const timetableItems = React.useMemo(() => loadMockTimetableItems(), []);
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const {monthDay, weekday} = React.useMemo(() => formatScheduleDate(new Date()), []);

    const handleItemPress = React.useCallback(
        (item: TimetableLayoutItem) => {
            pushRoute(pushRoutes.detail(item.title, item.rangeLabel, item.eventId));
        },
        [pushRoute],
    );

    return (
        <RootScreenLayout
            headerBelow={
                <Text style={styles.headerText}>{monthDay}・{weekday}</Text>
            }>
            <TimetableView items={timetableItems} onItemPress={handleItemPress}/>
        </RootScreenLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        headerText: {
            color: theme.colors.textSecondary,
            fontSize: 20,
            fontWeight: '700',
            paddingLeft: '10'
        },
    });
}

export default ScheduleScreen;

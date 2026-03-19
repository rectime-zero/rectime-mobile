import React from 'react';
import RootScreenLayout from '../../components/layout/screen/RootScreenLayout';
import {pushRoutes} from '../../config/navigationRoutes';
import type {TimetableLayoutItem} from '../../domain/timetable';
import TimetableView from '../../features/timetable/components/TimetableView';
import {loadMockTimetableItems} from '../../infrastructure/timetable';
import {useNavigation} from '../../navigation/useNavigation';

function ScheduleScreen() {
    const {pushRoute} = useNavigation();
    const timetableItems = React.useMemo(() => loadMockTimetableItems(), []);

    const handleItemPress = React.useCallback(
        (item: TimetableLayoutItem) => {
            pushRoute(pushRoutes.detail(item.title, item.rangeLabel, item.eventId));
        },
        [pushRoute],
    );

    return (
        <RootScreenLayout>
            <TimetableView items={timetableItems} onItemPress={handleItemPress} />
        </RootScreenLayout>
    );
}

export default ScheduleScreen;

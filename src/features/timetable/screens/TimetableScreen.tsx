import React from 'react';
import RootScreenLayout from '../../../components/layout/screen/RootScreenLayout';
import {pushRoutes} from '../../../config/navigationRoutes';
import type {TimetableLayoutItem} from '../../../domain/timetable';
import {loadMockTimetableItems} from '../../../infrastructure/timetable';
import {useNavigation} from '../../../navigation/useNavigation';
import TimetableView from '../components/TimetableView';

function TimetableScreen() {
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

export default TimetableScreen;

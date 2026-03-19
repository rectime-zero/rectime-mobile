import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
    timetableHourSlots,
    timetableStartMinutes,
    TIMETABLE_INTERVAL_MINUTES,
    TIMETABLE_SLOT_HEIGHT,
} from '../../../domain/timetable/layout';
import {useTheme} from '../../../theme';

function TimetableGridLines() {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <>
            {timetableHourSlots.slice(0, -1).map(slot => (
                <View
                    key={slot.value}
                    style={[
                        styles.gridRow,
                        {
                            top: ((slot.value - timetableStartMinutes) / TIMETABLE_INTERVAL_MINUTES) * TIMETABLE_SLOT_HEIGHT,
                        },
                    ]}
                />
            ))}
        </>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        gridRow: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: theme.colors.timetableGridLine,
        },
    });
}

export default TimetableGridLines;

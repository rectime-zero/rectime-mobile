import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {DimensionValue} from 'react-native';
import {
    timetableHourSlots,
    timetableStartMinutes,
    TIMETABLE_INTERVAL_MINUTES,
    TIMETABLE_SLOT_HEIGHT,
} from '../../../domain/timetable/layout';
import {useTheme} from '../../../theme';

type TimetableTimeLabelsProps = {
    width?: DimensionValue;
};

function TimetableTimeLabels({width = '100%'}: TimetableTimeLabelsProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme, width), [theme, width]);

    return (
        <View style={styles.labelsColumn}>
            {timetableHourSlots.map(slot => {
                const top = ((slot.value - timetableStartMinutes) / TIMETABLE_INTERVAL_MINUTES) * TIMETABLE_SLOT_HEIGHT;

                return (
                    <Text key={slot.value} style={[styles.axisLabel, {top: top - 8}]}>
                        {slot.label}
                    </Text>
                );
            })}
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], width: DimensionValue) {
    return StyleSheet.create({
        labelsColumn: {
            width,
            position: 'relative',
            height: '100%',
        },
        axisLabel: {
            position: 'absolute',
            right: 10,
            color: theme.colors.timetableGridLine,
            fontSize: 11,
            fontWeight: '700',
        },
    });
}

export default TimetableTimeLabels;

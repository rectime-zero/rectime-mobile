import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import type {DimensionValue} from 'react-native';
import {useTheme} from '../../theme';
import {TIMETABLE_CONFIG} from './config';
import type {ScheduleLayoutEvent} from './types';

type OverflowEventIndicatorProps = {
    event: ScheduleLayoutEvent;
    hiddenCount: number;
    gridWidth: number;
    onPress?: (event: ScheduleLayoutEvent) => void;
};

function OverflowEventIndicator({event, hiddenCount, gridWidth, onPress}: OverflowEventIndicatorProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const resolvedWidth: DimensionValue =
        gridWidth > 0
            ? Math.max((gridWidth * event.widthPercent) / 100, TIMETABLE_CONFIG.MIN_EVENT_WIDTH_PX)
            : `${event.widthPercent}%`;
    const resolvedLeft: DimensionValue =
        gridWidth > 0 ? (gridWidth * event.leftPercent) / 100 : `${event.leftPercent}%`;

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress ? () => onPress(event) : undefined}
            style={[
                styles.container,
                {
                    top: event.top,
                    height: event.height,
                    left: resolvedLeft,
                    width: resolvedWidth,
                },
            ]}>
            <Text style={styles.label}>+{hiddenCount}</Text>
        </Pressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            backgroundColor: theme.colors.timetableCardBackground,
            opacity: 0.78,
            zIndex: 10,
        },
        label: {
            color: theme.colors.surfacePrimary,
            fontSize: 11,
            fontWeight: '800',
        },
    });
}

export default OverflowEventIndicator;

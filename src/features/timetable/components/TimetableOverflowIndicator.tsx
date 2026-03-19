import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import type {DimensionValue} from 'react-native';
import {type TimetableLayoutItem, TIMETABLE_CONFIG} from '../../../domain/timetable';
import {useTheme} from '../../../theme';

type TimetableOverflowIndicatorProps = {
    item: TimetableLayoutItem;
    hiddenCount: number;
    gridWidth: number;
    onPress?: (item: TimetableLayoutItem) => void;
};

function TimetableOverflowIndicator({item, hiddenCount, gridWidth, onPress}: TimetableOverflowIndicatorProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const resolvedWidth: DimensionValue =
        gridWidth > 0
            ? Math.max((gridWidth * item.widthPercent) / 100, TIMETABLE_CONFIG.MIN_EVENT_WIDTH_PX)
            : `${item.widthPercent}%`;
    const resolvedLeft: DimensionValue = gridWidth > 0 ? (gridWidth * item.leftPercent) / 100 : `${item.leftPercent}%`;

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress ? () => onPress(item) : undefined}
            style={[
                styles.container,
                {
                    top: item.top,
                    height: item.height,
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

export default TimetableOverflowIndicator;

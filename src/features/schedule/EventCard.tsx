import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {DimensionValue} from 'react-native';
import {useTheme} from '../../theme';
import {TIMETABLE_CONFIG} from './config';
import type {ScheduleLayoutEvent} from './types';

type EventCardProps = {
    event: ScheduleLayoutEvent;
    gridWidth: number;
    onPress?: (event: ScheduleLayoutEvent) => void;
};

function EventCard({event, gridWidth, onPress}: EventCardProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const isParticipant = event.accent === 'red';
    const isCompact = event.height < TIMETABLE_CONFIG.COMPACT_THRESHOLD_PX;
    const isVeryCompact = event.height < TIMETABLE_CONFIG.VERY_COMPACT_THRESHOLD_PX;
    const isNarrow = event.actualColumns >= 3;
    const isVeryNarrow = event.actualColumns >= 4;
    const isUltraNarrow = event.actualColumns >= 5;
    const backgroundColor = isParticipant ? theme.colors.timetableCardParticipant : theme.colors.timetableCardBackground;
    const textColor = isParticipant ? theme.colors.timetableCardTextDark : theme.colors.surfacePrimary;
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
                isCompact ? styles.containerCompact : null,
                isNarrow ? styles.containerNarrow : null,
                isVeryNarrow ? styles.containerVeryNarrow : null,
                {
                    top: event.top,
                    height: event.height,
                    left: resolvedLeft,
                    width: resolvedWidth,
                    backgroundColor,
                },
            ]}>
            <View style={[styles.accent, isParticipant ? styles.accentParticipant : styles.accentDefault]} />

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.title,
                            isVeryCompact || isVeryNarrow ? styles.titleVeryCompact : null,
                            !isVeryCompact && (isCompact || isNarrow) ? styles.titleCompact : null,
                            isUltraNarrow ? styles.titleUltraNarrow : null,
                            {color: textColor},
                        ]}>
                        {event.title}
                    </Text>

                    {isVeryCompact ? (
                        <Text numberOfLines={1} style={[styles.inlineRange, {color: textColor}]}>
                            {event.rangeLabel}
                        </Text>
                    ) : null}
                </View>

                {isVeryCompact ? null : (
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.range,
                            isNarrow ? styles.rangeCompact : null,
                            isVeryNarrow ? styles.rangeVeryCompact : null,
                            isUltraNarrow ? styles.rangeUltraCompact : null,
                            {color: textColor},
                        ]}>
                        {event.rangeLabel}
                    </Text>
                )}
            </View>
        </Pressable>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 8,
            shadowColor: '#000000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.16,
            shadowRadius: 2,
            elevation: 2,
            zIndex: 10,
        },
        containerCompact: {
            paddingVertical: 2,
        },
        containerNarrow: {
            paddingHorizontal: 6,
        },
        containerVeryNarrow: {
            paddingHorizontal: 4,
        },
        accent: {
            width: 4,
            height: '100%',
            borderRadius: 999,
            marginRight: 8,
        },
        accentDefault: {
            backgroundColor: theme.colors.timetableTimeLine,
        },
        accentParticipant: {
            backgroundColor: theme.colors.surfacePrimary,
        },
        content: {
            flex: 1,
            gap: 4,
            overflow: 'hidden',
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        title: {
            flexShrink: 1,
            fontWeight: '600',
        },
        titleCompact: {
            fontSize: 10,
            lineHeight: 12,
        },
        titleVeryCompact: {
            fontSize: 9,
            lineHeight: 10,
        },
        titleUltraNarrow: {
            fontSize: 8,
            lineHeight: 9,
        },
        range: {
            fontSize: 9,
            lineHeight: 10,
            fontWeight: '500',
            opacity: 0.8,
        },
        rangeCompact: {
            fontSize: 8,
            lineHeight: 9,
        },
        rangeVeryCompact: {
            fontSize: 7,
            lineHeight: 8,
        },
        rangeUltraCompact: {
            fontSize: 6,
            lineHeight: 7,
        },
        inlineRange: {
            flexShrink: 0,
            fontSize: 8,
            lineHeight: 10,
            fontWeight: '500',
            opacity: 0.7,
        },
    });
}

export default EventCard;

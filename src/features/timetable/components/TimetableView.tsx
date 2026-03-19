import React from 'react';
import {LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import {
    type TimetableItem,
    type TimetableLayoutItem,
    calculateTimetableLayout,
    TIMETABLE_CONFIG,
    timetableGridHeight,
    timetableHourSlots,
    timetableStartMinutes,
    TIMETABLE_INTERVAL_MINUTES,
    TIMETABLE_SLOT_HEIGHT,
} from '../../../domain/timetable';
import {useTheme} from '../../../theme';
import TimetableEventBlock from './TimetableEventBlock';
import TimetableOverflowIndicator from './TimetableOverflowIndicator';

const TIME_LABEL_WIDTH = 52;
const CURRENT_TIME_BADGE_WIDTH = 48;

type TimetableViewProps = {
    items: TimetableItem[];
    onItemPress?: (item: TimetableLayoutItem) => void;
};

function TimetableView({items, onItemPress}: TimetableViewProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const [now, setNow] = React.useState(() => new Date());
    const [gridWidth, setGridWidth] = React.useState(0);
    const layoutItems = React.useMemo(() => calculateTimetableLayout(items), [items]);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 60_000);

        return () => clearInterval(timer);
    }, []);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const isCurrentTimeVisible =
        currentMinutes >= timetableStartMinutes && currentMinutes <= TIMETABLE_CONFIG.DISPLAY_END_HOUR * 60;
    const currentTimeTop = isCurrentTimeVisible
        ? ((currentMinutes - timetableStartMinutes) / TIMETABLE_INTERVAL_MINUTES) * TIMETABLE_SLOT_HEIGHT
        : 0;
    const currentTimeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const handleGridLayout = React.useCallback((event: LayoutChangeEvent) => {
        setGridWidth(event.nativeEvent.layout.width);
    }, []);

    return (
        <View style={styles.timelineFrame}>
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

            <View onLayout={handleGridLayout} style={styles.gridColumn}>
                {timetableHourSlots.slice(0, -1).map(slot => (
                    <View
                        key={slot.value}
                        style={[
                            styles.gridRow,
                            {
                                top:
                                    ((slot.value - timetableStartMinutes) / TIMETABLE_INTERVAL_MINUTES) *
                                    TIMETABLE_SLOT_HEIGHT,
                            },
                            styles.gridRowHour,
                        ]}
                    />
                ))}

                {isCurrentTimeVisible && currentTimeTop > 0 ? <View style={[styles.pastOverlay, {height: currentTimeTop}]} /> : null}

                {isCurrentTimeVisible ? (
                    <View style={[styles.currentTimeLayer, {top: currentTimeTop}]}>
                        <View style={styles.currentTimeBadge}>
                            <Text style={styles.currentTimeLabel}>{currentTimeLabel}</Text>
                        </View>
                        <View style={styles.currentTimeLine} />
                    </View>
                ) : null}

                <View style={styles.eventsLayer}>
                    {layoutItems.map(item =>
                        item.positionIndex === TIMETABLE_CONFIG.MAX_VISIBLE_EVENTS - 1 &&
                        item.actualColumns > TIMETABLE_CONFIG.MAX_VISIBLE_EVENTS ? (
                            <TimetableOverflowIndicator
                                key={`${item.id}-more`}
                                gridWidth={gridWidth}
                                hiddenCount={item.actualColumns - TIMETABLE_CONFIG.MAX_VISIBLE_EVENTS}
                                item={item}
                                onPress={onItemPress}
                            />
                        ) : (
                            <TimetableEventBlock key={item.id} gridWidth={gridWidth} item={item} onPress={onItemPress} />
                        ),
                    )}
                </View>
            </View>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        timelineFrame: {
            flexDirection: 'row',
            minHeight: timetableGridHeight,
        },
        labelsColumn: {
            width: TIME_LABEL_WIDTH,
            position: 'relative',
        },
        axisLabel: {
            position: 'absolute',
            left: 0,
            color: theme.colors.timetableGridLine,
            fontSize: 11,
            fontWeight: '700',
        },
        gridColumn: {
            flex: 1,
            height: timetableGridHeight,
            position: 'relative',
        },
        gridRow: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: theme.colors.timetableGridLine,
        },
        gridRowHour: {
            backgroundColor: theme.colors.timetableGridLine,
        },
        currentTimeLayer: {
            position: 'absolute',
            left: -TIME_LABEL_WIDTH + 2,
            right: 0,
            zIndex: 40,
            flexDirection: 'row',
            alignItems: 'center',
        },
        currentTimeBadge: {
            width: CURRENT_TIME_BADGE_WIDTH,
            height: 22,
            borderRadius: 4,
            backgroundColor: theme.colors.timetableTimeLine,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 6,
        },
        currentTimeLabel: {
            color: theme.colors.surfacePrimary,
            fontSize: 10,
            fontWeight: '800',
        },
        currentTimeLine: {
            flex: 1,
            height: 3,
            backgroundColor: theme.colors.timetableTimeLine,
        },
        pastOverlay: {
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            backgroundColor: theme.colors.timetablePastOverlay,
            zIndex: 5,
        },
        eventsLayer: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    });
}

export default TimetableView;

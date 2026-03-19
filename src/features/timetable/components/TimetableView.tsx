import React from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {TIMETABLE_VIEW_CONFIG} from '../../../config/timetableConfig';
import {
    type TimetableItem,
    type TimetableLayoutItem,
    calculateTimetableLayout,
    TIMETABLE_CONFIG,
    timetableGridHeight,
    timetableStartMinutes,
    TIMETABLE_INTERVAL_MINUTES,
    TIMETABLE_SLOT_HEIGHT,
} from '../../../domain/timetable';
import {useTheme} from '../../../theme';
import TimetableCurrentTimeBadge from './TimetableCurrentTimeBadge';
import TimetableCurrentTimeLine from './TimetableCurrentTimeLine';
import TimetableEventBlock from './TimetableEventBlock';
import TimetableGridLines from './TimetableGridLines';
import TimetableOverflowIndicator from './TimetableOverflowIndicator';
import TimetablePastOverlay from './TimetablePastOverlay';
import TimetableTimeLabels from './TimetableTimeLabels';

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
            <View style={styles.timeColumn}>
                <TimetableTimeLabels />
                {isCurrentTimeVisible ? <TimetableCurrentTimeBadge label={currentTimeLabel} top={currentTimeTop} /> : null}
            </View>

            <View onLayout={handleGridLayout} style={styles.gridColumn}>
                <TimetableGridLines />

                {isCurrentTimeVisible && currentTimeTop > 0 ? <TimetablePastOverlay height={currentTimeTop} /> : null}

                {isCurrentTimeVisible ? <TimetableCurrentTimeLine top={currentTimeTop} /> : null}

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
        timeColumn: {
            width: TIMETABLE_VIEW_CONFIG.TIME_LABEL_WIDTH_PX,
            height: timetableGridHeight,
            position: 'relative',
        },
        gridColumn: {
            flex: 1,
            height: timetableGridHeight,
            position: 'relative',
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

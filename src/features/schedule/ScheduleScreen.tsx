import React from 'react';
import {LayoutChangeEvent, StyleSheet, Text, View} from 'react-native';
import AccessoryButton from '../../components/AccessoryButton';
import PageLayout from '../../components/layout/PageLayout';
import MenuAvatarButton from '../../components/MenuAvatarButton';
import {pushRoutes, sheetRoutes} from '../../config/navigationRoutes';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';
import {TIMETABLE_CONFIG} from './config';
import EventCard from './EventCard';
import OverflowEventIndicator from './OverflowEventIndicator';
import {
    scheduleGridHeight,
    scheduleHourSlots,
    scheduleLayoutEvents,
    scheduleStartMinutes,
    TIMETABLE_INTERVAL_MINUTES,
    TIMETABLE_SLOT_HEIGHT,
} from './timetable';

const TIME_LABEL_WIDTH = 52;
const CURRENT_TIME_BADGE_WIDTH = 48;

function ScheduleScreen() {
    const {theme} = useTheme();
    const {openMenu, presentSheetRoute, pushRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const [now, setNow] = React.useState(() => new Date());
    const [gridWidth, setGridWidth] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 60_000);

        return () => clearInterval(timer);
    }, []);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const isCurrentTimeVisible =
        currentMinutes >= scheduleStartMinutes && currentMinutes <= TIMETABLE_CONFIG.DISPLAY_END_HOUR * 60;
    const currentTimeTop = isCurrentTimeVisible
        ? ((currentMinutes - scheduleStartMinutes) / TIMETABLE_INTERVAL_MINUTES) * TIMETABLE_SLOT_HEIGHT
        : 0;
    const currentTimeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const handleGridLayout = React.useCallback((event: LayoutChangeEvent) => {
        setGridWidth(event.nativeEvent.layout.width);
    }, []);

    const handleEventPress = React.useCallback(
        (event: (typeof scheduleLayoutEvents)[number]) => {
            pushRoute(pushRoutes.detail(event.title, event.rangeLabel, event.eventId));
        },
        [pushRoute],
    );

    return (
        <PageLayout
            headerLeading={<MenuAvatarButton onPress={openMenu} />}
            headerTrailing={
                <AccessoryButton
                    accessibilityLabel="通知"
                    icon="bell"
                    onPress={() => presentSheetRoute(sheetRoutes.notifications)}
                />
            }
            title="タイムテーブル">
            <View style={styles.timelineFrame}>
                <View style={styles.labelsColumn}>
                    {scheduleHourSlots.map(slot => {
                        const top = ((slot.value - scheduleStartMinutes) / TIMETABLE_INTERVAL_MINUTES) * TIMETABLE_SLOT_HEIGHT;

                        return (
                            <Text key={slot.value} style={[styles.axisLabel, {top: top - 8}]}>
                                {slot.label}
                            </Text>
                        );
                    })}
                </View>

                <View onLayout={handleGridLayout} style={styles.gridColumn}>
                    {scheduleHourSlots.slice(0, -1).map(slot => (
                        <View
                            key={slot.value}
                            style={[
                                styles.gridRow,
                                {
                                    top:
                                        ((slot.value - scheduleStartMinutes) / TIMETABLE_INTERVAL_MINUTES) *
                                        TIMETABLE_SLOT_HEIGHT,
                                },
                                styles.gridRowHour,
                            ]}
                        />
                    ))}

                    {isCurrentTimeVisible && currentTimeTop > 0 ? (
                        <View style={[styles.pastOverlay, {height: currentTimeTop}]} />
                    ) : null}

                    {isCurrentTimeVisible ? (
                        <View style={[styles.currentTimeLayer, {top: currentTimeTop}]}>
                            <View style={styles.currentTimeBadge}>
                                <Text style={styles.currentTimeLabel}>{currentTimeLabel}</Text>
                            </View>
                            <View style={styles.currentTimeLine} />
                        </View>
                    ) : null}

                    <View style={styles.eventsLayer}>
                        {scheduleLayoutEvents.map(event => (
                            event.positionIndex === TIMETABLE_CONFIG.MAX_VISIBLE_EVENTS - 1 &&
                            event.actualColumns > TIMETABLE_CONFIG.MAX_VISIBLE_EVENTS ? (
                                <OverflowEventIndicator
                                    key={`${event.id}-more`}
                                    event={event}
                                    gridWidth={gridWidth}
                                    hiddenCount={event.actualColumns - TIMETABLE_CONFIG.MAX_VISIBLE_EVENTS}
                                    onPress={handleEventPress}
                                />
                            ) : (
                                <EventCard key={event.id} event={event} gridWidth={gridWidth} onPress={handleEventPress} />
                            )
                        ))}
                    </View>
                </View>
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        timelineFrame: {
            flexDirection: 'row',
            backgroundColor: theme.colors.surfacePrimary,
            minHeight: scheduleGridHeight,
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
            height: scheduleGridHeight,
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

export default ScheduleScreen;

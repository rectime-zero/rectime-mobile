import {TIMETABLE_CONFIG} from './config';
import {calculateEventLayout} from './eventLayoutCalculator';
import {seedEvents} from './seedEvents';
import {generateTimeSlots} from './timeSlotGenerator';
import {parseTimeToMinutes} from './timeUtils';

export const TIMETABLE_INTERVAL_MINUTES = 60 / TIMETABLE_CONFIG.SLOTS_PER_HOUR;
export const TIMETABLE_SLOT_HEIGHT = TIMETABLE_CONFIG.SLOT_HEIGHT_PX;

export const scheduleStartMinutes = TIMETABLE_CONFIG.START_HOUR * 60;
export const scheduleEndMinutes = TIMETABLE_CONFIG.DISPLAY_END_HOUR * 60;
export const scheduleGridHeight =
    ((scheduleEndMinutes - scheduleStartMinutes) / TIMETABLE_INTERVAL_MINUTES) * TIMETABLE_SLOT_HEIGHT;

export const scheduleGridSlots = generateTimeSlots(
    scheduleStartMinutes,
    scheduleEndMinutes,
    TIMETABLE_INTERVAL_MINUTES,
);

export const scheduleHourSlots = generateTimeSlots(
    scheduleStartMinutes,
    scheduleEndMinutes,
    60,
);

export const scheduleLayoutEvents = calculateEventLayout(
    seedEvents,
    scheduleStartMinutes,
    TIMETABLE_INTERVAL_MINUTES,
    TIMETABLE_SLOT_HEIGHT,
);

export const currentEventWindow = {
    firstStartMinutes: parseTimeToMinutes(seedEvents[0].f_time),
    lastEndMinutes:
        parseTimeToMinutes(seedEvents[seedEvents.length - 1].f_time) + seedEvents[seedEvents.length - 1].f_duration,
};

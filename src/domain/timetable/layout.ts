import type {TimetableItem, TimetableLayoutItem} from './models';
import {generateTimeSlots} from './time';

export const TIMETABLE_CONFIG = {
    START_HOUR: 9,
    STOP_HOUR: 18,
    DISPLAY_END_HOUR: 18.5,
    SLOTS_PER_HOUR: 6,
    SLOT_HEIGHT_PX: 16,
    MAX_VISIBLE_EVENTS: 6,
    MIN_EVENT_WIDTH_PX: 60,
    COMPACT_THRESHOLD_PX: 40,
    VERY_COMPACT_THRESHOLD_PX: 24,
} as const;

export const TIMETABLE_INTERVAL_MINUTES = 60 / TIMETABLE_CONFIG.SLOTS_PER_HOUR;
export const TIMETABLE_SLOT_HEIGHT = TIMETABLE_CONFIG.SLOT_HEIGHT_PX;
export const timetableStartMinutes = TIMETABLE_CONFIG.START_HOUR * 60;
export const timetableEndMinutes = TIMETABLE_CONFIG.DISPLAY_END_HOUR * 60;
export const timetableGridHeight =
    ((timetableEndMinutes - timetableStartMinutes) / TIMETABLE_INTERVAL_MINUTES) * TIMETABLE_SLOT_HEIGHT;

export const timetableHourSlots = generateTimeSlots(timetableStartMinutes, timetableEndMinutes, 60);

export function getOptimalWidthPercent(actualColumns: number) {
    if (actualColumns <= 1) {
        return 100;
    }

    const visibleColumns = Math.min(actualColumns, TIMETABLE_CONFIG.MAX_VISIBLE_EVENTS);
    return 100 / visibleColumns;
}

export function getOptimalLeftPercent(positionIndex: number, actualColumns: number) {
    const visibleColumns = Math.min(actualColumns, TIMETABLE_CONFIG.MAX_VISIBLE_EVENTS);

    if (positionIndex >= TIMETABLE_CONFIG.MAX_VISIBLE_EVENTS) {
        return 0;
    }

    return (positionIndex * 100) / visibleColumns;
}

export function calculateTimetableLayout(items: TimetableItem[]): TimetableLayoutItem[] {
    const sortedItems = [...items].sort((left, right) => left.startMinutes - right.startMinutes);
    const columns: Array<{endTime: number}> = [];
    const itemTimeRanges = new Map<string, {start: number; end: number}>();
    const positions = new Map<
        string,
        {
            top: number;
            height: number;
            column: number;
            totalColumns: number;
            actualColumns: number;
            positionIndex: number;
        }
    >();

    for (const item of sortedItems) {
        const eventStartUnits = Math.floor((item.startMinutes - timetableStartMinutes) / TIMETABLE_INTERVAL_MINUTES);
        const durationUnits = Math.ceil(Math.max(item.durationMinutes, TIMETABLE_INTERVAL_MINUTES) / TIMETABLE_INTERVAL_MINUTES);
        let columnIndex = columns.findIndex(column => column.endTime <= item.startMinutes);

        if (columnIndex === -1) {
            columnIndex = columns.length;
            columns.push({endTime: 0});
        }

        columns[columnIndex].endTime = item.endMinutes;
        itemTimeRanges.set(item.id, {start: item.startMinutes, end: item.endMinutes});
        positions.set(item.id, {
            top: eventStartUnits * TIMETABLE_SLOT_HEIGHT,
            height: durationUnits * TIMETABLE_SLOT_HEIGHT,
            column: columnIndex,
            totalColumns: 0,
            actualColumns: 1,
            positionIndex: 0,
        });
    }

    positions.forEach((position, itemId) => {
        const timeRange = itemTimeRanges.get(itemId);

        if (!timeRange) {
            return;
        }

        let maxSimultaneousColumns = 1;

        for (let minute = timeRange.start; minute < timeRange.end; minute += TIMETABLE_INTERVAL_MINUTES) {
            let simultaneousCount = 0;

            itemTimeRanges.forEach(otherRange => {
                if (otherRange.start <= minute && minute < otherRange.end) {
                    simultaneousCount += 1;
                }
            });

            maxSimultaneousColumns = Math.max(maxSimultaneousColumns, simultaneousCount);
        }

        position.actualColumns = maxSimultaneousColumns;
        position.totalColumns = columns.length;
        position.positionIndex = position.column;
    });

    return sortedItems.map(item => {
        const position = positions.get(item.id);

        if (!position) {
            throw new Error(`Missing timetable layout for item ${item.id}`);
        }

        return {
            ...item,
            top: position.top,
            height: Math.max(position.height, Math.ceil(TIMETABLE_SLOT_HEIGHT * 1.5)),
            column: position.column,
            totalColumns: position.totalColumns,
            actualColumns: position.actualColumns,
            positionIndex: position.positionIndex,
            leftPercent: getOptimalLeftPercent(position.positionIndex, position.actualColumns),
            widthPercent: getOptimalWidthPercent(position.actualColumns),
        };
    });
}

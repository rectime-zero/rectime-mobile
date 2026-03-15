import {TIMETABLE_CONFIG} from './config';

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

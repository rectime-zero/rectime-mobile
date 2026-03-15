import type {ScheduleTimeSlot} from './types';
import {formatMinutes} from './timeUtils';

export function generateTimeSlots(
    startMinutes: number,
    endMinutes: number,
    intervalMinutes: number,
): ScheduleTimeSlot[] {
    const total = Math.floor((endMinutes - startMinutes) / intervalMinutes);

    return Array.from({length: total + 1}, (_, index) => {
        const value = startMinutes + index * intervalMinutes;

        return {
            value,
            label: formatMinutes(value),
        };
    });
}

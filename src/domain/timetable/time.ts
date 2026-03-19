import type {TimetableTimeSlot} from './models';

export function parseTimeToMinutes(value: string) {
    const normalized = value.padStart(4, '0');
    const hours = Number.parseInt(normalized.slice(0, 2), 10);
    const minutes = Number.parseInt(normalized.slice(2, 4), 10);

    return hours * 60 + minutes;
}

export function formatMinutes(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export function generateTimeSlots(
    startMinutes: number,
    endMinutes: number,
    intervalMinutes: number,
): TimetableTimeSlot[] {
    const total = Math.floor((endMinutes - startMinutes) / intervalMinutes);

    return Array.from({length: total + 1}, (_, index) => {
        const value = startMinutes + index * intervalMinutes;

        return {
            value,
            label: formatMinutes(value),
        };
    });
}

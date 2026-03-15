export function parseTimeToMinutes(value: string) {
    const normalized = value.padStart(4, '0');
    const hours = Number.parseInt(normalized.slice(0, 2), 10);
    const minutes = Number.parseInt(normalized.slice(2, 4), 10);

    return hours * 60 + minutes;
}

export function formatMinutes(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

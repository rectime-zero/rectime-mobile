export type TimetableAccent = 'blue' | 'red' | 'orange';

export type TimetableItem = {
    id: string;
    eventId: number;
    title: string;
    startMinutes: number;
    endMinutes: number;
    rangeLabel: string;
    durationMinutes: number;
    accent: TimetableAccent;
    place: string | null;
    gatherTime: string | null;
    summary: string | null;
};

export type TimetableLayoutItem = TimetableItem & {
    top: number;
    height: number;
    column: number;
    totalColumns: number;
    actualColumns: number;
    positionIndex: number;
    leftPercent: number;
    widthPercent: number;
};

export type TimetableTimeSlot = {
    value: number;
    label: string;
};

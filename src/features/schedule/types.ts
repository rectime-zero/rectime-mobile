export type SeedEventCode = 'A' | 'C' | 'E' | string;

export type SeedEvent = {
    f_event_id: number;
    f_event_code: SeedEventCode;
    f_event_name: string;
    f_time: string;
    f_duration: number;
    f_place: string | null;
    f_gather_time: string | null;
    f_summary: string | null;
};

export type ScheduleAccent = 'blue' | 'red' | 'orange';

export type ScheduleTimeSlot = {
    value: number;
    label: string;
};

export type ScheduleLayoutEvent = {
    id: string;
    eventId: number;
    title: string;
    startLabel: string;
    endLabel: string;
    rangeLabel: string;
    durationMinutes: number;
    accent: ScheduleAccent;
    top: number;
    height: number;
    column: number;
    totalColumns: number;
    actualColumns: number;
    positionIndex: number;
    leftPercent: number;
    widthPercent: number;
    place: string | null;
    gatherTime: string | null;
    summary: string | null;
};

export type ScheduleSummary = {
    dateLabel: string;
    startLabel: string;
    endLabel: string;
    totalEvents: number;
};

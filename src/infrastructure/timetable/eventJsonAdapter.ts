import {type TimetableAccent, type TimetableItem, formatMinutes, parseTimeToMinutes} from '../../domain/timetable';

export type TimetableJsonEvent = {
    f_event_id: number;
    f_event_code: string;
    f_event_name: string;
    f_time: string;
    f_duration: number;
    f_place: string | null;
    f_gather_time: string | null;
    f_summary: string | null;
};

function resolveAccent(eventCode: string): TimetableAccent {
    if (eventCode === 'A') {
        return 'blue';
    }

    if (eventCode === 'C') {
        return 'red';
    }

    return 'orange';
}

export function mapJsonEventToTimetableItem(event: TimetableJsonEvent): TimetableItem {
    const startMinutes = parseTimeToMinutes(event.f_time);
    const endMinutes = startMinutes + event.f_duration;

    return {
        id: String(event.f_event_id),
        eventId: event.f_event_id,
        title: event.f_event_name,
        startMinutes,
        endMinutes,
        rangeLabel: `${formatMinutes(startMinutes)} - ${formatMinutes(endMinutes)}`,
        durationMinutes: event.f_duration,
        accent: resolveAccent(event.f_event_code),
        place: event.f_place,
        gatherTime: event.f_gather_time,
        summary: event.f_summary,
    };
}

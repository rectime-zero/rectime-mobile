import {getOptimalLeftPercent, getOptimalWidthPercent} from './eventPositioning';
import type {ScheduleAccent, ScheduleLayoutEvent, SeedEvent} from './types';
import {formatMinutes, parseTimeToMinutes} from './timeUtils';

function resolveAccent(eventCode: string): ScheduleAccent {
    if (eventCode === 'A') {
        return 'blue';
    }

    if (eventCode === 'C') {
        return 'red';
    }

    return 'orange';
}

type EventTimeRange = {
    start: number;
    end: number;
};

export function calculateEventLayout(
    events: SeedEvent[],
    startMinutes: number,
    intervalMinutes: number,
    slotHeight: number,
): ScheduleLayoutEvent[] {
    const sortedEvents = [...events].sort((left, right) => parseTimeToMinutes(left.f_time) - parseTimeToMinutes(right.f_time));
    const columns: Array<{endTime: number}> = [];
    const eventTimeRanges = new Map<number, EventTimeRange>();
    const positions = new Map<
        number,
        {
            top: number;
            height: number;
            column: number;
            totalColumns: number;
            actualColumns: number;
            positionIndex: number;
        }
    >();

    for (const event of sortedEvents) {
        const start = parseTimeToMinutes(event.f_time);
        const end = start + event.f_duration;
        const eventStartUnits = Math.floor((start - startMinutes) / intervalMinutes);
        const durationUnits = Math.ceil(Math.max(event.f_duration, intervalMinutes) / intervalMinutes);
        let columnIndex = columns.findIndex(column => column.endTime <= start);

        if (columnIndex === -1) {
            columnIndex = columns.length;
            columns.push({endTime: 0});
        }

        columns[columnIndex].endTime = end;
        eventTimeRanges.set(event.f_event_id, {start, end});
        positions.set(event.f_event_id, {
            top: eventStartUnits * slotHeight,
            height: durationUnits * slotHeight,
            column: columnIndex,
            totalColumns: 0,
            actualColumns: 1,
            positionIndex: 0,
        });
    }

    positions.forEach((position, eventId) => {
        const timeRange = eventTimeRanges.get(eventId);

        if (!timeRange) {
            return;
        }

        let maxSimultaneousColumns = 1;

        for (let minute = timeRange.start; minute < timeRange.end; minute += intervalMinutes) {
            let simultaneousCount = 0;

            eventTimeRanges.forEach(otherRange => {
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

    return sortedEvents.map(event => {
        const start = parseTimeToMinutes(event.f_time);
        const end = start + event.f_duration;
        const position = positions.get(event.f_event_id);

        if (!position) {
            throw new Error(`Missing timetable layout for event ${event.f_event_id}`);
        }

        const height = Math.max(position.height, Math.ceil(slotHeight * 1.5));

        return {
            id: String(event.f_event_id),
            eventId: event.f_event_id,
            title: event.f_event_name,
            startLabel: formatMinutes(start),
            endLabel: formatMinutes(end),
            rangeLabel: `${formatMinutes(start)} - ${formatMinutes(end)}`,
            durationMinutes: event.f_duration,
            accent: resolveAccent(event.f_event_code),
            top: position.top,
            height,
            column: position.column,
            totalColumns: position.totalColumns,
            actualColumns: position.actualColumns,
            positionIndex: position.positionIndex,
            leftPercent: getOptimalLeftPercent(position.positionIndex, position.actualColumns),
            widthPercent: getOptimalWidthPercent(position.actualColumns),
            place: event.f_place,
            gatherTime: event.f_gather_time,
            summary: event.f_summary,
        };
    });
}

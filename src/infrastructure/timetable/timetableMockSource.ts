import {type TimetableItem} from '../../domain/timetable';
import {mapJsonEventToTimetableItem, type TimetableJsonEvent} from './eventJsonAdapter';

const mockResponse = require('../../../mock/events_response.json') as {events: TimetableJsonEvent[]};

export function loadMockTimetableItems(): TimetableItem[] {
    return [...mockResponse.events]
        .map(mapJsonEventToTimetableItem)
        .sort((left, right) => left.startMinutes - right.startMinutes);
}

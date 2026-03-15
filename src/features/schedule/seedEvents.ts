import type {SeedEvent} from './types';
import {parseTimeToMinutes} from './timeUtils';

const seedResponse = require('../../../ai/002_seed_events_response.json') as {events: SeedEvent[]};

export const seedEvents: SeedEvent[] = [...seedResponse.events].sort((left, right) => {
    return parseTimeToMinutes(left.f_time) - parseTimeToMinutes(right.f_time);
});

import { Event } from '../event';

export type EventType = Exclude<Event, 'none'>['type'];

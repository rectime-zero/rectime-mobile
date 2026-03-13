import {type ScheduleCopy, type ScheduleEntry} from './types';

export const scheduleCopy: ScheduleCopy = {
    date: '3月9日',
    noteTitle: '表示テーマ',
};

export const scheduleEntries: ScheduleEntry[] = [
    {time: '09:00', title: '開会式', range: '09:00 - 09:30', accent: 'blue'},
    {time: '09:45', title: '100m走 予選', range: '09:45 - 10:30', accent: 'blue'},
    {time: '11:00', title: '部活動対抗リレー', range: '11:00 - 11:30', accent: 'red'},
    {time: '13:00', title: '綱引き 予選', range: '13:00 - 13:40', accent: 'orange'},
];

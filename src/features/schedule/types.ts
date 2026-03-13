export type ScheduleAccent = 'blue' | 'red' | 'orange';

export type ScheduleEntry = {
    time: string;
    title: string;
    range: string;
    accent: ScheduleAccent;
};

export type ScheduleCopy = {
    date: string;
    noteTitle: string;
};

export type RecentMatchTone = 'success' | 'danger';

export type RecentMatch = {
    title: string;
    rival: string;
    delta: string;
    result: string;
    tone: RecentMatchTone;
};

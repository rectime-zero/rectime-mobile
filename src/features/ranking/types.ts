export type RankingTone = 'gold' | 'silver' | 'bronze';

export type RankingEntry = {
    name: string;
    point: number;
    medal?: string;
    tone?: RankingTone;
};

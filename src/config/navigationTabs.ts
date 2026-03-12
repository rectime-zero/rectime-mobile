export type TabKey = 'home' | 'schedule' | 'ranking' | 'map' | 'rules';

export type TabItem = {
    key: TabKey;
    label: string;
};

export const navigationTabs: TabItem[] = [
    {key: 'home', label: 'ホーム'},
    {key: 'schedule', label: 'スケジュール'},
    {key: 'ranking', label: 'ランキング'},
    {key: 'map', label: 'マップ'},
    {key: 'rules', label: 'ルール'},
];

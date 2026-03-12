import {type AppIconName} from '../components/iconNames';

export type TabKey = 'home' | 'schedule' | 'ranking' | 'map' | 'rules';

export type TabItem = {
    key: TabKey;
    label: string;
    icon: AppIconName;
};

export const navigationTabs: TabItem[] = [
    {key: 'home', label: 'ホーム', icon: 'home'},
    {key: 'schedule', label: '日程', icon: 'calendar-alt'},
    {key: 'ranking', label: '順位', icon: 'trophy'},
    {key: 'map', label: 'マップ', icon: 'map-marked-alt'},
    {key: 'rules', label: 'ルール', icon: 'book-open'},
];

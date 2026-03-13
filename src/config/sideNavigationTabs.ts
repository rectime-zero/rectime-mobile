import {type AppIconName} from '../components/iconNames';

export type TabKey = 'home' | 'schedule' | 'ranking' | 'map' | 'rules';

export type TabItem = {
    key: TabKey;
    label: string;
    icon: AppIconName;
};

export const sideNavigationTabs: TabItem[] = [
    {key: 'home', label: '対戦情報', icon: 'home'},
    {key: 'schedule', label: '設定', icon: 'cog'},
];

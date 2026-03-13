import {type AppIconName} from '../components/iconNames';
import {rootRoutes} from './stageRoutes';

export type TabItem = {
    route: (typeof rootRoutes)[keyof typeof rootRoutes];
    label: string;
    icon: AppIconName;
};

export const sideNavigationTabs: TabItem[] = [
    {route: rootRoutes.home, label: '対戦情報', icon: 'home'},
    {route: rootRoutes.schedule, label: '設定', icon: 'cog'},
];

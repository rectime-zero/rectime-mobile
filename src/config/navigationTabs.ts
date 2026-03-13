import {type AppIconName} from '../components/iconNames';
import {rootRoutes} from './stageRoutes';

export type TabItem = {
    route: (typeof rootRoutes)[keyof typeof rootRoutes];
    label: string;
    icon: AppIconName;
};

export const navigationTabs: TabItem[] = [
    {route: rootRoutes.home, label: 'ホーム', icon: 'home'},
    {route: rootRoutes.schedule, label: '日程', icon: 'calendar-alt'},
    {route: rootRoutes.ranking, label: '順位', icon: 'trophy'},
    {route: rootRoutes.map, label: 'マップ', icon: 'map-marked-alt'},
    {route: rootRoutes.rules, label: 'ルール', icon: 'book-open'},
];

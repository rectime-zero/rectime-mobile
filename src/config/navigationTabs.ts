import {type AppIconKey} from '../components/AppIcon';
import {rootRoutes} from './navigationRoutes';

export type TabItem = {
    route: (typeof rootRoutes)[keyof typeof rootRoutes];
    label: string;
    icon: AppIconKey;
};

export const navigationTabs: TabItem[] = [
    {route: rootRoutes.home, label: 'ホーム', icon: 'home'},
    {route: rootRoutes.schedule, label: '日程', icon: 'schedule'},
    {route: rootRoutes.ranking, label: '順位', icon: 'ranking'},
    {route: rootRoutes.map, label: 'マップ', icon: 'map'},
    {route: rootRoutes.rules, label: 'ルール', icon: 'rules'},
];

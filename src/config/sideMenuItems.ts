import {type AppIconName} from '../components/iconNames';
import {pushRoutes, rootRoutes} from './navigationRoutes';

type RootMenuItem = {
    kind: 'root';
    route: (typeof rootRoutes)[keyof typeof rootRoutes];
    label: string;
    icon: AppIconName;
};

type PushMenuItem = {
    kind: 'push';
    route: ReturnType<(typeof pushRoutes)[keyof typeof pushRoutes]>;
    label: string;
    icon: AppIconName;
};

export type SideMenuItem = RootMenuItem | PushMenuItem;

export const sideMenuItems: SideMenuItem[] = [
    {
        kind: 'push',
        route: pushRoutes.matchHistory('IA31', '最新の対戦結果やスコア推移を確認できます。'),
        label: '対戦情報',
        icon: 'clipboard-check',
    },
    {kind: 'push', route: pushRoutes.colorMode(), label: '設定', icon: 'cog'},
];

import {type AppIconName} from '../components/iconNames';
import {pushRoutes} from './navigationRoutes';

type MenuPageItem = {
    kind: 'menu-page';
    route: ReturnType<(typeof pushRoutes)[keyof typeof pushRoutes]>;
    label: string;
    icon: AppIconName;
};

export type SideMenuItem = MenuPageItem;

export const sideMenuItems: SideMenuItem[] = [
    {
        kind: 'menu-page',
        route: pushRoutes.matchInfo('IA31', '最新の対戦結果やスコア推移を確認できます。'),
        label: '対戦情報',
        icon: 'clipboard-check',
    },
    {
        kind: 'menu-page',
        route: pushRoutes.settings(),
        label: '設定',
        icon: 'cog',
    },
];

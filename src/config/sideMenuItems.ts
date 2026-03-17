import {type AppIconKey} from '../components/icon/AppIcon';
import {menuPageRoutes} from './navigationRoutes';

type MenuPageItem = {
    kind: 'menu-page';
    route: ReturnType<(typeof menuPageRoutes)[keyof typeof menuPageRoutes]>;
    label: string;
    icon: AppIconKey;
};

export type SideMenuItem = MenuPageItem;

export const sideMenuItems: SideMenuItem[] = [
    {
        kind: 'menu-page',
        route: menuPageRoutes.matchInfo('IA31', '最新の対戦結果やスコア推移を確認できます。'),
        label: '対戦情報',
        icon: 'match-info',
    },
    {
        kind: 'menu-page',
        route: menuPageRoutes.settings(),
        label: '設定',
        icon: 'settings',
    },
    {
        kind: 'menu-page',
        route: menuPageRoutes.development(),
        label: '開発メニュー',
        icon: 'development',
    },
];

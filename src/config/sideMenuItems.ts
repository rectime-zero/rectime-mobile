import {type AppIconKey} from '../components/icon/AppIcon';
import {sideMenuRoutes} from './navigationRoutes';
import {type SideMenuPushRouteTarget} from '../navigation/types';

export type SideMenuItem = {
    route: SideMenuPushRouteTarget;
    label: string;
    icon: AppIconKey;
};

export const sideMenuItems: SideMenuItem[] = [
    {
        route: sideMenuRoutes.operatorMenu(),
        label: '運営メニュー',
        icon: 'operator-menu',
    },
    {
        route: sideMenuRoutes.matchInfo('IA31', '最新の対戦結果やスコア推移を確認できます。'),
        label: '対戦情報',
        icon: 'match-info',
    },
    {
        route: sideMenuRoutes.settings(),
        label: '設定',
        icon: 'settings',
    },
    {
        route: sideMenuRoutes.helpCenter(),
        label: 'ヘルプセンター',
        icon: 'help-center',
    },
    {
        route: sideMenuRoutes.dev(),
        label: '開発メニュー',
        icon: 'dev',
    },
];

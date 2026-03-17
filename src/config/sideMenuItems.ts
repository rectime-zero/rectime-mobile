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
        route: sideMenuRoutes.development(),
        label: '開発メニュー',
        icon: 'development',
    },
    {
        route: sideMenuRoutes.helpCenter(),
        label: 'ヘルプセンター',
        icon: 'help-center',
    },
];

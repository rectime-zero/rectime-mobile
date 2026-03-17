import {
    type AppRoute,
    type PushRouteTarget,
    type PushScreenName,
    type RootRouteTarget,
    type SheetRouteTarget,
    type SideMenuPushRouteTarget,
} from '../navigation/types';

export const rootRoutes = {
    home: {name: 'home'},
    schedule: {name: 'schedule'},
    ranking: {name: 'ranking'},
    map: {name: 'map'},
    rules: {name: 'rules'},
} as const satisfies Record<string, RootRouteTarget>;

const rootRouteTitles = {
    home: 'ホーム',
    schedule: 'タイムテーブル',
    ranking: 'ランキング',
    map: 'マップ',
    rules: 'ルール',
} as const;

export function getRootRouteTitle(name: keyof typeof rootRouteTitles) {
    return rootRouteTitles[name];
}

const pushRouteTitles = {
    settings: '設定',
    'match-info': '対戦情報',
    development: '開発メニュー',
    notifications: '通知',
    'help-center': 'ヘルプセンター',
} as const;

export function getPushRouteTitle(route: AppRoute<PushScreenName>) {
    if (route.name === 'detail') {
        return (route as AppRoute<'detail'>).params.title;
    }

    return pushRouteTitles[route.name as keyof typeof pushRouteTitles];
}

export const sheetRoutes = {
    themePicker: {name: 'theme-sheet', params: undefined},
} as const satisfies Record<string, SheetRouteTarget>;

export const pushRoutes = {
    detail: (title: string, summary: string, eventId?: number): PushRouteTarget<'detail'> => ({
        name: 'detail',
        params: {title, summary, eventId},
    }),
    notifications: (): PushRouteTarget<'notifications'> => ({
        name: 'notifications',
        params: undefined,
    }),
    matchInfo: (teamName: string, summary: string): PushRouteTarget<'match-info'> => ({
        name: 'match-info',
        params: {
            teamName,
            summary,
        },
    }),
} as const;

export const sideMenuRoutes = {
    settings: (): SideMenuPushRouteTarget<'settings'> => ({
        name: 'settings',
        params: undefined,
    }),
    development: (): SideMenuPushRouteTarget<'development'> => ({
        name: 'development',
        params: undefined,
    }),
    helpCenter: (): SideMenuPushRouteTarget<'help-center'> => ({
        name: 'help-center',
        params: undefined,
    }),
    matchInfo: (teamName: string, summary: string): SideMenuPushRouteTarget<'match-info'> => ({
        name: 'match-info',
        params: {
            teamName,
            summary,
        },
    }),
} as const;

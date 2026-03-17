import {
    type PushRouteTarget,
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

export const sheetRoutes = {
    notifications: {name: 'sample-sheet', params: undefined},
    themePicker: {name: 'theme-sheet', params: undefined},
} as const satisfies Record<string, SheetRouteTarget>;

export const pushRoutes = {
    detail: (title: string, summary: string, eventId?: number): PushRouteTarget<'detail'> => ({
        name: 'detail',
        params: {title, summary, eventId},
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
    matchInfo: (teamName: string, summary: string): SideMenuPushRouteTarget<'match-info'> => ({
        name: 'match-info',
        params: {
            teamName,
            summary,
        },
    }),
} as const;

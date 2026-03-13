import {
    type PushRouteTarget,
    type RootRouteTarget,
    type SheetRouteTarget,
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
    detail: (title: string, summary: string): PushRouteTarget<'detail'> => ({
        name: 'detail',
        params: {title, summary},
    }),
    colorMode: (): PushRouteTarget<'detail'> => ({
        name: 'detail',
        params: {
            title: 'カラーモード',
            summary: 'ライト、ダーク、端末設定に関する表示設定ページです。',
        },
    }),
    matchHistory: (teamName: string, summary: string): PushRouteTarget<'detail'> => ({
        name: 'detail',
        params: {
            title: `${teamName} の対戦履歴`,
            summary,
        },
    }),
} as const;

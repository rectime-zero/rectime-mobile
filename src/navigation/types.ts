export type PresentationMode = 'root' | 'push' | 'bottom-sheet' | 'modal';
export type SheetLayoutMode = 'fit' | 'full';
export type PushTransitionSource = 'default' | 'side-menu';
export type PushTransitionMode = 'idle' | 'enter';

export type RootScreenName = 'home' | 'schedule' | 'ranking' | 'map' | 'rules';
export type PushScreenName = 'detail' | 'settings' | 'match-info' | 'notifications' | 'help-center' | 'dev';
export type SideMenuPushScreenName = Exclude<PushScreenName, 'detail'>;
export type SheetScreenName = 'sample-sheet' | 'theme-sheet';
export type AppScreenName = RootScreenName | PushScreenName | SheetScreenName;

export type ActiveGesture = 'none' | 'menu' | 'back' | 'sheet';

export type RouteParamsMap = {
    home: undefined;
    schedule: undefined;
    ranking: undefined;
    map: undefined;
    rules: undefined;
    detail: {
        title: string;
        summary: string;
        eventId?: number;
    };
    settings: undefined;
    'match-info': {
        teamName: string;
        summary: string;
    };
    notifications: undefined;
    'help-center': undefined;
    dev: undefined;
    'sample-sheet': undefined;
    'theme-sheet': undefined;
};

type RouteName = keyof RouteParamsMap;

export type AppRoute<TName extends RouteName = RouteName> = {
    key: string;
    name: TName;
    presentation: PresentationMode;
    params: RouteParamsMap[TName];
    transitionSource: PushTransitionSource;
};

export type SheetScreenOptions = {
    layoutMode?: SheetLayoutMode;
    showHandle?: boolean;
};

export type RootRouteTarget<TName extends RootScreenName = RootScreenName> = {
    name: TName;
};

export type PushRouteTarget<TName extends PushScreenName = PushScreenName> = {
    name: TName;
    params: RouteParamsMap[TName];
};

export type SideMenuPushRouteTarget<TName extends SideMenuPushScreenName = SideMenuPushScreenName> = {
    name: TName;
    params: RouteParamsMap[TName];
};

export type SheetRouteTarget<TName extends SheetScreenName = SheetScreenName> = {
    name: TName;
    params: RouteParamsMap[TName];
};

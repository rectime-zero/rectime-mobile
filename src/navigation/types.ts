export type PresentationMode = 'root' | 'push' | 'bottom-sheet' | 'modal';

export type RootScreenName = 'home' | 'schedule' | 'ranking' | 'map' | 'rules';
export type PushScreenName = 'detail';
export type SheetScreenName = 'sample-sheet';
export type StageScreenName = RootScreenName | PushScreenName | SheetScreenName;

export type ActiveGesture = 'none' | 'menu' | 'back' | 'sheet';

export type StageRouteParamsMap = {
    home: undefined;
    schedule: undefined;
    ranking: undefined;
    map: undefined;
    rules: undefined;
    detail: {
        title: string;
        summary: string;
    };
    'sample-sheet': undefined;
};

type RouteName = keyof StageRouteParamsMap;

export type StageRoute<TName extends RouteName = RouteName> = {
    key: string;
    name: TName;
    presentation: PresentationMode;
    params: StageRouteParamsMap[TName];
};

export type RootRouteTarget<TName extends RootScreenName = RootScreenName> = {
    name: TName;
};

export type PushRouteTarget<TName extends PushScreenName = PushScreenName> = {
    name: TName;
    params: StageRouteParamsMap[TName];
};

export type SheetRouteTarget<TName extends SheetScreenName = SheetScreenName> = {
    name: TName;
    params: StageRouteParamsMap[TName];
};

export type StageState = {
    routeStack: StageRoute[];
    overlays: StageRoute[];
    menuProgress: number;
    activeGesture: ActiveGesture;
};

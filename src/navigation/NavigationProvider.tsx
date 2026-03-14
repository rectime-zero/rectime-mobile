import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {useSharedValue, withSpring, type SharedValue} from 'react-native-reanimated';
import {
    type ActiveGesture,
    type AppRoute,
    type AppScreenName,
    type MenuPageSource,
    type MenuPageTransitionMode,
    type NavigationState,
    type PresentationMode,
    type PushRouteTarget,
    type PushScreenName,
    type RouteParamsMap,
    type RootRouteTarget,
    type RootScreenName,
    type SheetRouteTarget,
    type SheetScreenName,
} from './types';

type NavigationContextValue = {
    rootRoute: AppRoute<RootScreenName>;
    menuPageRoute: AppRoute<PushScreenName> | null;
    menuPageTransitionMode: MenuPageTransitionMode;
    menuPageSource: MenuPageSource | null;
    pushStack: AppRoute<PushScreenName>[];
    sheetRoute: AppRoute<SheetScreenName> | null;
    menuProgress: SharedValue<number>;
    menuPageTransitionProgress: SharedValue<number>;
    menuPageSourceProgress: SharedValue<number>;
    activeGestureValue: SharedValue<ActiveGesture>;
    navigationState: NavigationState;
    openMenu: () => void;
    closeMenu: () => void;
    setRootScreen: (screen: RootScreenName) => void;
    setRootRoute: (route: RootRouteTarget) => void;
    push: <TName extends PushScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
    ) => void;
    pushRoute: <TName extends PushScreenName>(route: PushRouteTarget<TName>) => void;
    openMenuPage: <TName extends PushScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
        source?: MenuPageSource,
    ) => void;
    openMenuPageRoute: <TName extends PushScreenName>(
        route: PushRouteTarget<TName>,
        source?: MenuPageSource,
    ) => void;
    closeMenuPage: () => void;
    finishMenuPageEnter: () => void;
    pop: () => void;
    completePop: (key: string) => void;
    presentSheet: <TName extends SheetScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
    ) => void;
    presentSheetRoute: <TName extends SheetScreenName>(route: SheetRouteTarget<TName>) => void;
    dismissSheet: () => void;
    clearSheet: (key: string) => void;
    clearMenuPage: (key: string) => void;
    sheetDismissRequest: number;
    setActiveGesture: (gesture: ActiveGesture) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

const SPRING_CONFIG = {
    damping: 24,
    stiffness: 220,
    mass: 0.95,
} as const;

function createRoute<TName extends AppScreenName>(
    name: TName,
    presentation: PresentationMode,
    params: RouteParamsMap[TName],
): AppRoute<TName> {
    return {
        key: `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        presentation,
        params,
    };
}

type NavigationProviderProps = {
    children: React.ReactNode;
};

function NavigationProvider({children}: NavigationProviderProps) {
    const [rootScreen, setRootScreenState] = useState<RootScreenName>('home');
    const [menuPageRoute, setMenuPageRoute] = useState<AppRoute<PushScreenName> | null>(null);
    const [menuPageTransitionMode, setMenuPageTransitionMode] = useState<MenuPageTransitionMode>('idle');
    const [menuPageSource, setMenuPageSource] = useState<MenuPageSource | null>(null);
    const [pushStack, setPushStack] = useState<AppRoute<PushScreenName>[]>([]);
    const [sheetRoute, setSheetRoute] = useState<AppRoute<SheetScreenName> | null>(null);
    const [sheetDismissRequest, setSheetDismissRequest] = useState(0);
    const [activeGesture, setActiveGestureState] = useState<ActiveGesture>('none');

    const menuProgress = useSharedValue(0);
    const menuPageTransitionProgress = useSharedValue(0);
    const menuPageSourceProgress = useSharedValue(0);
    const activeGestureValue = useSharedValue<ActiveGesture>('none');

    const rootRoute = useMemo(() => createRoute(rootScreen, 'root', undefined), [rootScreen]);

    const setActiveGesture = useCallback((gesture: ActiveGesture) => {
        setActiveGestureState(gesture);
        activeGestureValue.value = gesture;
    }, [activeGestureValue]);

    const animateMenu = useCallback((toValue: number) => {
        menuProgress.value = withSpring(toValue, SPRING_CONFIG);
    }, [menuProgress]);

    const closeMenu = useCallback(() => {
        animateMenu(0);
    }, [animateMenu]);

    const resetMenuPageState = useCallback(() => {
        setMenuPageRoute(null);
        setMenuPageTransitionMode('idle');
        setMenuPageSource(null);
        menuPageTransitionProgress.value = 0;
        menuPageSourceProgress.value = 0;
    }, [menuPageSourceProgress, menuPageTransitionProgress]);

    const openMenu = useCallback(() => {
        if (pushStack.length > 0 || menuPageRoute || menuPageTransitionMode !== 'idle' || sheetRoute) {
            return;
        }

        animateMenu(1);
    }, [animateMenu, menuPageRoute, menuPageTransitionMode, pushStack.length, sheetRoute]);

    const setRootScreen = useCallback((screen: RootScreenName) => {
        setRootScreenState(screen);
        resetMenuPageState();
        setPushStack([]);
        setSheetRoute(null);
        closeMenu();
        setActiveGesture('none');
    }, [closeMenu, resetMenuPageState, setActiveGesture]);

    const setRootRoute = useCallback((route: RootRouteTarget) => {
        setRootScreen(route.name);
    }, [setRootScreen]);

    const push = useCallback(<TName extends PushScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
    ) => {
        if (menuPageTransitionMode !== 'idle') {
            return;
        }

        closeMenu();
        setPushStack(current => [...current, createRoute(screen, 'push', params)]);
    }, [closeMenu, menuPageTransitionMode]);

    const pushRoute = useCallback(<TName extends PushScreenName>(route: PushRouteTarget<TName>) => {
        push(route.name, route.params);
    }, [push]);

    const openMenuPage = useCallback(<TName extends PushScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
        source: MenuPageSource = 'side-menu',
    ) => {
        if (pushStack.length > 0 || sheetRoute || menuPageRoute || menuPageTransitionMode !== 'idle') {
            return;
        }

        setActiveGesture('none');
        menuPageSourceProgress.value = menuProgress.value;
        menuPageTransitionProgress.value = 0;
        setMenuPageRoute(createRoute(screen, 'menu-page', params));
        setMenuPageSource(source);
        setMenuPageTransitionMode('enter');
        setPushStack([]);
        setSheetRoute(null);
    }, [
        menuPageTransitionMode,
        menuPageSourceProgress,
        menuPageTransitionProgress,
        menuPageRoute,
        menuProgress,
        pushStack.length,
        setActiveGesture,
        sheetRoute,
    ]);

    const openMenuPageRoute = useCallback(<TName extends PushScreenName>(
        route: PushRouteTarget<TName>,
        source: MenuPageSource = 'side-menu',
    ) => {
        openMenuPage(route.name, route.params, source);
    }, [openMenuPage]);

    const closeMenuPage = useCallback(() => {
        if (!menuPageRoute || menuPageTransitionMode !== 'idle') {
            // TODO: support reversing an in-flight enter transition.
            return;
        }

        setMenuPageTransitionMode('exit');
        setActiveGesture('none');
    }, [menuPageRoute, menuPageTransitionMode, setActiveGesture]);

    const finishMenuPageEnter = useCallback(() => {
        menuProgress.value = 0;
        menuPageSourceProgress.value = 0;
        setMenuPageTransitionMode(current => (current === 'enter' ? 'idle' : current));
    }, [menuPageSourceProgress, menuProgress]);

    const clearMenuPage = useCallback((key: string) => {
        setMenuPageRoute(current => (current?.key === key ? null : current));
        setMenuPageTransitionMode('idle');
        setMenuPageSource(null);
        menuPageTransitionProgress.value = 0;
        menuPageSourceProgress.value = 0;
        setActiveGesture('none');
    }, [menuPageSourceProgress, menuPageTransitionProgress, setActiveGesture]);

    const pop = useCallback(() => {
        setPushStack(current => current.slice(0, -1));
        setActiveGesture('none');
    }, [setActiveGesture]);

    const completePop = useCallback((key: string) => {
        setPushStack(current => current.filter(route => route.key !== key));
        setActiveGesture('none');
    }, [setActiveGesture]);

    const presentSheet = useCallback(<TName extends SheetScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
    ) => {
        setSheetRoute(createRoute(screen, 'bottom-sheet', params));
        setActiveGesture('none');
    }, [setActiveGesture]);

    const presentSheetRoute = useCallback(<TName extends SheetScreenName>(route: SheetRouteTarget<TName>) => {
        presentSheet(route.name, route.params);
    }, [presentSheet]);

    const dismissSheet = useCallback(() => {
        if (!sheetRoute) {
            return;
        }

        setSheetDismissRequest(current => current + 1);
        setActiveGesture('none');
    }, [setActiveGesture, sheetRoute]);

    const clearSheet = useCallback((key: string) => {
        setSheetRoute(current => (current?.key === key ? null : current));
        setActiveGesture('none');
    }, [setActiveGesture]);

    const navigationState = useMemo(
        () => ({
            routeStack: [rootRoute, ...(menuPageRoute ? [menuPageRoute] : []), ...pushStack],
            overlays: sheetRoute ? [sheetRoute] : [],
            menuProgress: menuProgress.value,
            activeGesture,
        }),
        [activeGesture, menuPageRoute, menuProgress, pushStack, rootRoute, sheetRoute],
    );

    const value = useMemo<NavigationContextValue>(
        () => ({
            rootRoute,
            menuPageRoute,
            menuPageTransitionMode,
            menuPageSource,
            pushStack,
            sheetRoute,
            menuProgress,
            menuPageTransitionProgress,
            menuPageSourceProgress,
            activeGestureValue,
            navigationState,
            openMenu,
            closeMenu,
            setRootScreen,
            setRootRoute,
            push,
            pushRoute,
            openMenuPage,
            openMenuPageRoute,
            closeMenuPage,
            finishMenuPageEnter,
            pop,
            completePop,
            presentSheet,
            presentSheetRoute,
            dismissSheet,
            clearMenuPage,
            clearSheet,
            sheetDismissRequest,
            setActiveGesture,
        }),
        [
            activeGestureValue,
            clearMenuPage,
            clearSheet,
            closeMenu,
            closeMenuPage,
            completePop,
            dismissSheet,
            finishMenuPageEnter,
            menuPageRoute,
            menuPageSource,
            menuPageTransitionMode,
            menuPageTransitionProgress,
            menuPageSourceProgress,
            menuProgress,
            navigationState,
            openMenu,
            openMenuPage,
            openMenuPageRoute,
            pop,
            presentSheet,
            presentSheetRoute,
            push,
            pushRoute,
            pushStack,
            rootRoute,
            setActiveGesture,
            setRootRoute,
            setRootScreen,
            sheetDismissRequest,
            sheetRoute,
        ],
    );

    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigationContext() {
    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error('useNavigationContext must be used within NavigationProvider');
    }

    return context;
}

export default NavigationProvider;

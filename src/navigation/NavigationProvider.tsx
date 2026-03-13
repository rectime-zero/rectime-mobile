import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {useSharedValue, withSpring, type SharedValue} from 'react-native-reanimated';
import {
    type ActiveGesture,
    type AppRoute,
    type AppScreenName,
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
    pushStack: AppRoute<PushScreenName>[];
    sheetRoute: AppRoute<SheetScreenName> | null;
    menuProgress: SharedValue<number>;
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
    pop: () => void;
    completePop: (key: string) => void;
    presentSheet: <TName extends SheetScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
    ) => void;
    presentSheetRoute: <TName extends SheetScreenName>(route: SheetRouteTarget<TName>) => void;
    dismissSheet: () => void;
    clearSheet: (key: string) => void;
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
    const [pushStack, setPushStack] = useState<AppRoute<PushScreenName>[]>([]);
    const [sheetRoute, setSheetRoute] = useState<AppRoute<SheetScreenName> | null>(null);
    const [activeGesture, setActiveGestureState] = useState<ActiveGesture>('none');

    const menuProgress = useSharedValue(0);
    const activeGestureValue = useSharedValue<ActiveGesture>('none');

    const rootRoute = useMemo(
        () => createRoute(rootScreen, 'root', undefined),
        [rootScreen],
    );

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

    const openMenu = useCallback(() => {
        if (pushStack.length > 0 || sheetRoute) {
            return;
        }
        animateMenu(1);
    }, [animateMenu, pushStack.length, sheetRoute]);

    const setRootScreen = useCallback((screen: RootScreenName) => {
        setRootScreenState(screen);
        setPushStack([]);
        setSheetRoute(null);
        closeMenu();
        setActiveGesture('none');
    }, [closeMenu, setActiveGesture]);

    const setRootRoute = useCallback((route: RootRouteTarget) => {
        setRootScreen(route.name);
    }, [setRootScreen]);

    const push = useCallback(<TName extends PushScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
    ) => {
        closeMenu();
        setPushStack(current => [...current, createRoute(screen, 'push', params)]);
    }, [closeMenu]);

    const pushRoute = useCallback(<TName extends PushScreenName>(route: PushRouteTarget<TName>) => {
        push(route.name, route.params);
    }, [push]);

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
        setSheetRoute(null);
        setActiveGesture('none');
    }, [setActiveGesture]);

    const clearSheet = useCallback((key: string) => {
        setSheetRoute(current => (current?.key === key ? null : current));
        setActiveGesture('none');
    }, [setActiveGesture]);

    const navigationState = useMemo(
        () => ({
            routeStack: [rootRoute, ...pushStack],
            overlays: sheetRoute ? [sheetRoute] : [],
            menuProgress: menuProgress.value,
            activeGesture,
        }),
        [activeGesture, menuProgress, pushStack, rootRoute, sheetRoute],
    );

    const value = useMemo<NavigationContextValue>(
        () => ({
            rootRoute,
            pushStack,
            sheetRoute,
            menuProgress,
            activeGestureValue,
            navigationState,
            openMenu,
            closeMenu,
            setRootScreen,
            setRootRoute,
            push,
            pushRoute,
            pop,
            completePop,
            presentSheet,
            presentSheetRoute,
            dismissSheet,
            clearSheet,
            setActiveGesture,
        }),
        [
            clearSheet,
            closeMenu,
            completePop,
            dismissSheet,
            activeGestureValue,
            navigationState,
            menuProgress,
            openMenu,
            pop,
            presentSheet,
            push,
            pushStack,
            rootRoute,
            sheetRoute,
            setActiveGesture,
            setRootRoute,
            setRootScreen,
            pushRoute,
            presentSheetRoute,
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

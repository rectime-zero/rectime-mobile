import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {useSharedValue, withSpring, type SharedValue} from 'react-native-reanimated';
import {
    type ActiveGesture,
    type AppRoute,
    type AppScreenName,
    type PresentationMode,
    type PushRouteTarget,
    type PushTransitionMode,
    type PushTransitionSource,
    type PushScreenName,
    type RouteParamsMap,
    type RootRouteTarget,
    type RootScreenName,
    type SheetRouteTarget,
    type SheetScreenName,
    type SideMenuPushRouteTarget,
} from './types';

type NavigationContextValue = {
    rootRoute: AppRoute<RootScreenName>;
    pushStack: AppRoute<PushScreenName>[];
    sheetRoute: AppRoute<SheetScreenName> | null;
    menuProgress: SharedValue<number>;
    pushTransitionProgress: SharedValue<number>;
    pushTransitionSourceProgress: SharedValue<number>;
    pushTransitionMode: PushTransitionMode;
    pushTransitionRouteKey: string | null;
    activeGestureValue: SharedValue<ActiveGesture>;
    openMenu: () => void;
    closeMenu: () => void;
    setRootScreen: (screen: RootScreenName) => void;
    setRootRoute: (route: RootRouteTarget) => void;
    push: <TName extends PushScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
        source?: PushTransitionSource,
    ) => void;
    pushRoute: <TName extends PushScreenName>(route: PushRouteTarget<TName>) => void;
    pushFromMenu: <TName extends PushScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
    ) => void;
    pushFromMenuRoute: (route: SideMenuPushRouteTarget) => void;
    pop: () => void;
    completePop: (key: string) => void;
    finishPushEnter: (key: string) => void;
    presentSheet: <TName extends SheetScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
    ) => void;
    presentSheetRoute: <TName extends SheetScreenName>(route: SheetRouteTarget<TName>) => void;
    dismissSheet: () => void;
    clearSheet: (key: string) => void;
    sheetDismissRequest: number;
    pushDismissRequest: number;
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
    transitionSource: PushTransitionSource = 'default',
): AppRoute<TName> {
    return {
        key: `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        presentation,
        params,
        transitionSource,
    };
}

type NavigationProviderProps = {
    children: React.ReactNode;
};

function NavigationProvider({children}: NavigationProviderProps) {
    const [rootScreen, setRootScreenState] = useState<RootScreenName>('home');
    const [pushStack, setPushStack] = useState<AppRoute<PushScreenName>[]>([]);
    const [sheetRoute, setSheetRoute] = useState<AppRoute<SheetScreenName> | null>(null);
    const [sheetDismissRequest, setSheetDismissRequest] = useState(0);
    const [pushDismissRequest, setPushDismissRequest] = useState(0);
    const [pushTransitionMode, setPushTransitionMode] = useState<PushTransitionMode>('idle');
    const [pushTransitionRouteKey, setPushTransitionRouteKey] = useState<string | null>(null);
    const activeGestureValue = useSharedValue<ActiveGesture>('none');

    const menuProgress = useSharedValue(0);
    const pushTransitionProgress = useSharedValue(0);
    const pushTransitionSourceProgress = useSharedValue(0);

    const rootRoute = useMemo(() => createRoute(rootScreen, 'root', undefined), [rootScreen]);

    const setActiveGesture = useCallback((gesture: ActiveGesture) => {
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
        setPushTransitionMode('idle');
        setPushTransitionRouteKey(null);
        pushTransitionProgress.value = 0;
        pushTransitionSourceProgress.value = 0;
        closeMenu();
        setActiveGesture('none');
    }, [closeMenu, pushTransitionProgress, pushTransitionSourceProgress, setActiveGesture]);

    const setRootRoute = useCallback((route: RootRouteTarget) => {
        setRootScreen(route.name);
    }, [setRootScreen]);

    const push = useCallback(<TName extends PushScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
        source: PushTransitionSource = 'default',
    ) => {
        if (sheetRoute) {
            return;
        }

        const route = createRoute(screen, 'push', params, source);

        if (source === 'side-menu' && pushStack.length === 0 && menuProgress.value > 0.01) {
            pushTransitionSourceProgress.value = menuProgress.value;
            pushTransitionProgress.value = 0;
            setPushTransitionMode('enter');
            setPushTransitionRouteKey(route.key);
        } else {
            closeMenu();
        }

        setPushStack(current => [...current, route]);
    }, [closeMenu, menuProgress, pushStack.length, pushTransitionProgress, pushTransitionSourceProgress, sheetRoute]);

    const pushRoute = useCallback(<TName extends PushScreenName>(route: PushRouteTarget<TName>) => {
        push(route.name, route.params);
    }, [push]);

    const pushFromMenu = useCallback(<TName extends PushScreenName>(
        screen: TName,
        params: RouteParamsMap[TName],
    ) => {
        if (pushStack.length > 0 || sheetRoute) {
            return;
        }

        setActiveGesture('none');
        push(screen, params, 'side-menu');
    }, [push, pushStack.length, setActiveGesture, sheetRoute]);

    const pushFromMenuRoute = useCallback((route: SideMenuPushRouteTarget) => {
        push(route.name, route.params, 'side-menu');
    }, [push]);

    const pop = useCallback(() => {
        if (pushStack.length === 0) {
            return;
        }

        setPushDismissRequest(current => current + 1);
        setActiveGesture('none');
    }, [pushStack.length, setActiveGesture]);

    const completePop = useCallback((key: string) => {
        setPushStack(current => current.filter(route => route.key !== key));
        setActiveGesture('none');
    }, [setActiveGesture]);

    const finishPushEnter = useCallback((key: string) => {
        setPushTransitionRouteKey(currentKey => (currentKey === key ? null : currentKey));
        setPushTransitionMode('idle');
        pushTransitionProgress.value = 0;
        pushTransitionSourceProgress.value = 0;
        menuProgress.value = 0;
    }, [menuProgress, pushTransitionProgress, pushTransitionSourceProgress]);

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

    const value = useMemo<NavigationContextValue>(
        () => ({
            rootRoute,
            pushStack,
            sheetRoute,
            menuProgress,
            pushTransitionProgress,
            pushTransitionSourceProgress,
            pushTransitionMode,
            pushTransitionRouteKey,
            activeGestureValue,
            openMenu,
            closeMenu,
            setRootScreen,
            setRootRoute,
            push,
            pushRoute,
            pushFromMenu,
            pushFromMenuRoute,
            pop,
            completePop,
            finishPushEnter,
            presentSheet,
            presentSheetRoute,
            dismissSheet,
            clearSheet,
            sheetDismissRequest,
            pushDismissRequest,
            setActiveGesture,
        }),
        [
            activeGestureValue,
            clearSheet,
            closeMenu,
            completePop,
            dismissSheet,
            finishPushEnter,
            menuProgress,
            openMenu,
            pop,
            presentSheet,
            presentSheetRoute,
            push,
            pushFromMenu,
            pushFromMenuRoute,
            pushDismissRequest,
            pushRoute,
            pushStack,
            pushTransitionMode,
            pushTransitionProgress,
            pushTransitionRouteKey,
            pushTransitionSourceProgress,
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

import React, {createContext, useContext, useMemo, useState} from 'react';
import {useSharedValue, withSpring, type SharedValue} from 'react-native-reanimated';
import {
    type ActiveGesture,
    type PresentationMode,
    type PushScreenName,
    type RootScreenName,
    type SheetScreenName,
    type StageRoute,
    type StageRouteParamsMap,
    type StageScreenName,
    type StageState,
} from './types';

type StageContextValue = {
    rootRoute: StageRoute<RootScreenName>;
    pushStack: StageRoute<PushScreenName>[];
    sheetRoute: StageRoute<SheetScreenName> | null;
    menuProgress: SharedValue<number>;
    activeGestureValue: SharedValue<ActiveGesture>;
    stageState: StageState;
    openMenu: () => void;
    closeMenu: () => void;
    setRootScreen: (screen: RootScreenName) => void;
    push: <TName extends PushScreenName>(
        screen: TName,
        params: StageRouteParamsMap[TName],
    ) => void;
    pop: () => void;
    completePop: (key: string) => void;
    presentSheet: <TName extends SheetScreenName>(
        screen: TName,
        params: StageRouteParamsMap[TName],
    ) => void;
    dismissSheet: () => void;
    clearSheet: (key: string) => void;
    setActiveGesture: (gesture: ActiveGesture) => void;
};

const StageContext = createContext<StageContextValue | null>(null);

const SPRING_CONFIG = {
    damping: 24,
    stiffness: 220,
    mass: 0.95,
} as const;

function createRoute<TName extends StageScreenName>(
    name: TName,
    presentation: PresentationMode,
    params: StageRouteParamsMap[TName],
): StageRoute<TName> {
    return {
        key: `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        presentation,
        params,
    };
}

type StageProviderProps = {
    children: React.ReactNode;
};

function StageProvider({children}: StageProviderProps) {
    const [rootScreen, setRootScreenState] = useState<RootScreenName>('home');
    const [pushStack, setPushStack] = useState<StageRoute<PushScreenName>[]>([]);
    const [sheetRoute, setSheetRoute] = useState<StageRoute<SheetScreenName> | null>(null);
    const [activeGesture, setActiveGestureState] = useState<ActiveGesture>('none');

    const menuProgress = useSharedValue(0);
    const activeGestureValue = useSharedValue<ActiveGesture>('none');

    const rootRoute = useMemo(
        () => createRoute(rootScreen, 'root', undefined),
        [rootScreen],
    );

    const setActiveGesture = (gesture: ActiveGesture) => {
        setActiveGestureState(gesture);
        activeGestureValue.value = gesture;
    };

    const animateMenu = (toValue: number) => {
        menuProgress.value = withSpring(toValue, SPRING_CONFIG);
    };

    const closeMenu = () => {
        animateMenu(0);
    };

    const openMenu = () => {
        if (pushStack.length > 0 || sheetRoute) {
            return;
        }
        animateMenu(1);
    };

    const setRootScreen = (screen: RootScreenName) => {
        setRootScreenState(screen);
        setPushStack([]);
        setSheetRoute(null);
        closeMenu();
        setActiveGesture('none');
    };

    const push = <TName extends PushScreenName>(
        screen: TName,
        params: StageRouteParamsMap[TName],
    ) => {
        closeMenu();
        setPushStack(current => [...current, createRoute(screen, 'push', params)]);
    };

    const pop = () => {
        setPushStack(current => current.slice(0, -1));
        setActiveGesture('none');
    };

    const completePop = (key: string) => {
        setPushStack(current => current.filter(route => route.key !== key));
        setActiveGesture('none');
    };

    const presentSheet = <TName extends SheetScreenName>(
        screen: TName,
        params: StageRouteParamsMap[TName],
    ) => {
        setSheetRoute(createRoute(screen, 'bottom-sheet', params));
        setActiveGesture('none');
    };

    const dismissSheet = () => {
        setSheetRoute(null);
        setActiveGesture('none');
    };

    const clearSheet = (key: string) => {
        setSheetRoute(current => (current?.key === key ? null : current));
        setActiveGesture('none');
    };

    const stageState = useMemo(
        () => ({
            routeStack: [rootRoute, ...pushStack],
            overlays: sheetRoute ? [sheetRoute] : [],
            menuProgress: menuProgress.value,
            activeGesture,
        }),
        [activeGesture, menuProgress, pushStack, rootRoute, sheetRoute],
    );

    const value = useMemo<StageContextValue>(
        () => ({
            rootRoute,
            pushStack,
            sheetRoute,
            menuProgress,
            activeGestureValue,
            stageState,
            openMenu,
            closeMenu,
            setRootScreen,
            push,
            pop,
            completePop,
            presentSheet,
            dismissSheet,
            clearSheet,
            setActiveGesture,
        }),
        [
            activeGestureValue,
            stageState,
            menuProgress,
            pushStack,
            rootRoute,
            sheetRoute,
        ],
    );

    return <StageContext.Provider value={value}>{children}</StageContext.Provider>;
}

export function useStageContext() {
    const context = useContext(StageContext);

    if (!context) {
        throw new Error('useStageContext must be used within StageProvider');
    }

    return context;
}

export default StageProvider;

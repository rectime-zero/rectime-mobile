import React from 'react';
import {type AppHapticType, triggerNativeHaptic} from './haptics';

type FeedbackContextValue = {
    hapticsEnabled: boolean;
    setHapticsEnabled: (enabled: boolean) => void;
    triggerHaptic: (type: AppHapticType) => void;
    tap: () => void;
    success: () => void;
    warning: () => void;
    error: () => void;
    selection: () => void;
};

const STORAGE_KEY = '@rectime/preferences/haptics-enabled';
let inMemoryHapticsEnabled = true;

type StorageLike = {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
};

function getStorage(): StorageLike {
    try {
        const asyncStorageModule = require('@react-native-async-storage/async-storage');
        const storage = asyncStorageModule?.default ?? asyncStorageModule;

        if (storage?.getItem && storage?.setItem) {
            return storage as StorageLike;
        }
    } catch {
        // Fall back to in-memory state when the native module is unavailable.
    }

    return {
        getItem: async () => String(inMemoryHapticsEnabled),
        setItem: async (_key: string, value: string) => {
            inMemoryHapticsEnabled = value === 'true';
        },
    };
}

const FeedbackContext = React.createContext<FeedbackContextValue | null>(null);

type FeedbackProviderProps = {
    children: React.ReactNode;
};

function FeedbackProvider({children}: FeedbackProviderProps) {
    const [hapticsEnabled, setHapticsEnabledState] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;

        async function hydrate() {
            const storedValue = await getStorage().getItem(STORAGE_KEY);

            if (!isMounted || storedValue == null) {
                return;
            }

            setHapticsEnabledState(storedValue === 'true');
        }

        hydrate();

        return () => {
            isMounted = false;
        };
    }, []);

    const setHapticsEnabled = React.useCallback((enabled: boolean) => {
        setHapticsEnabledState(enabled);
        inMemoryHapticsEnabled = enabled;

        getStorage().setItem(STORAGE_KEY, String(enabled)).catch(() => {
            // Keep the in-memory preference even if persistence fails.
        });
    }, []);

    const triggerHaptic = React.useCallback(
        (type: AppHapticType) => {
            if (!hapticsEnabled) {
                return;
            }

            triggerNativeHaptic(type);
        },
        [hapticsEnabled],
    );

    const tap = React.useCallback(() => {
        triggerHaptic('tap');
    }, [triggerHaptic]);

    const success = React.useCallback(() => {
        triggerHaptic('success');
    }, [triggerHaptic]);

    const warning = React.useCallback(() => {
        triggerHaptic('warning');
    }, [triggerHaptic]);

    const error = React.useCallback(() => {
        triggerHaptic('error');
    }, [triggerHaptic]);

    const selection = React.useCallback(() => {
        triggerHaptic('selection');
    }, [triggerHaptic]);

    const value = React.useMemo<FeedbackContextValue>(
        () => ({
            hapticsEnabled,
            setHapticsEnabled,
            triggerHaptic,
            tap,
            success,
            warning,
            error,
            selection,
        }),
        [error, hapticsEnabled, selection, setHapticsEnabled, success, tap, triggerHaptic, warning],
    );

    return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
}

export function useFeedback() {
    const context = React.useContext(FeedbackContext);

    if (!context) {
        throw new Error('useFeedback must be used within FeedbackProvider');
    }

    return context;
}

export default FeedbackProvider;

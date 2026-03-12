import React from 'react';
import {useColorScheme} from 'react-native';
import {resolveTheme} from './themes';
import {type ResolvedThemeMode, type ThemeId, type ThemeMode, type ThemeTokens} from './types';

type ThemeContextValue = {
    selectedMode: ThemeMode;
    resolvedMode: ResolvedThemeMode;
    selectedThemeId: ThemeId;
    theme: ThemeTokens;
    setSelectedMode: (mode: ThemeMode) => void;
    setSelectedThemeId: (themeId: ThemeId) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
    children: React.ReactNode;
};

function ThemeProvider({children}: ThemeProviderProps) {
    const deviceColorScheme = useColorScheme();
    const [selectedMode, setSelectedMode] = React.useState<ThemeMode>('system');
    const [selectedThemeId, setSelectedThemeId] = React.useState<ThemeId>('default');

    const resolvedMode: ResolvedThemeMode =
        selectedMode === 'system' ? (deviceColorScheme === 'dark' ? 'dark' : 'light') : selectedMode;

    const theme = React.useMemo(
        () => resolveTheme(selectedThemeId, resolvedMode),
        [resolvedMode, selectedThemeId],
    );

    const value = React.useMemo<ThemeContextValue>(
        () => ({
            selectedMode,
            resolvedMode,
            selectedThemeId,
            theme,
            setSelectedMode,
            setSelectedThemeId,
        }),
        [resolvedMode, selectedMode, selectedThemeId, theme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = React.useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }

    return context;
}

export default ThemeProvider;

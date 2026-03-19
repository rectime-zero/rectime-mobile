import {type ResolvedThemeMode, type ThemeId, type ThemeTokens} from './types';
import {blue2024Theme} from './themes/blue2024Theme';
import {defaultTheme} from './themes/defaultTheme';

type ThemeCatalog = Record<ThemeId, Record<ResolvedThemeMode, ThemeTokens>>;

const themeCatalog: ThemeCatalog = {
    default: defaultTheme,
    'blue-2024': blue2024Theme,
};

export function resolveTheme(themeId: ThemeId, mode: ResolvedThemeMode): ThemeTokens {
    return themeCatalog[themeId][mode];
}

export const availableThemes: Array<{id: ThemeId; label: string}> = [
    {id: 'default', label: 'Default'},
    {id: 'blue-2024', label: 'Blue 2024'},
];

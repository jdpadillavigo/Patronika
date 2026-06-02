import { useColorScheme } from 'react-native';
import Colors from './Colors';

/** Colores disponibles en el tema de la app. */
export interface AppColors {
    primary: string;
    gray: string;
    white: string;
    black: string;
    error: string;
    errorBg: string;
    success: string;
    warning: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    inputBackground: string;
    inputBorder: string;
    divider: string;
}

interface ThemeResult {
    colors: AppColors;
    isDark: boolean;
}

export function useAppTheme(): ThemeResult {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const themeColors = isDark ? Colors.dark : Colors.light;

    const colors: AppColors = {
        primary: Colors.primary,
        gray: Colors.gray,
        white: Colors.white,
        black: Colors.black,
        error: Colors.error,
        errorBg: Colors.errorBg,
        success: Colors.success,
        warning: Colors.warning,
        info: Colors.info,

        background: themeColors.background,
        surface: themeColors.surface,
        text: themeColors.text,
        textSecondary: themeColors.textSecondary,
        inputBackground: themeColors.inputBackground,
        inputBorder: themeColors.inputBorder,
        divider: themeColors.divider,
    };

    return { colors, isDark };
}

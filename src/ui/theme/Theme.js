import { useColorScheme } from 'react-native';
import Colors from './Colors';

/**
 * @returns {{ colors: object, isDark: boolean }}
 */
export function useAppTheme() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const themeColors = isDark ? Colors.dark : Colors.light;

    const colors = {
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

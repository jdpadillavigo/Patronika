import { useColorScheme } from 'react-native';
import Colors from './Colors';

/** Colores disponibles en el tema de la app. */
export interface AppColors {
    primary: string;
    primaryAlt: string;
    primaryAlpha45: string;
    primaryAlpha85: string;
    white: string;
    black: string;
    fixedWhite: string;
    fixedBlack: string;
    error: string;
    errorStrong: string;
    errorDark: string;
    errorSoft: string;
    success: string;
    successDark: string;
    info: string;
    infoSoft: string;
    whiteAlpha20: string;
    whiteAlpha35: string;
    whiteAlpha45: string;
    whiteAlpha50: string;
    whiteAlpha55: string;
    whiteAlpha65: string;
    whiteAlpha70: string;
    whiteAlpha75: string;
    whiteAlpha86: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    elevatedSurface: string;
    card: string;
    text: string;
    textStrong: string;
    textHeading: string;
    textSecondary: string;
    textMuted: string;
    textSubtle: string;
    textDisabled: string;
    placeholder: string;
    iconMuted: string;
    inputBackground: string;
    inputBorder: string;
    border: string;
    borderSoft: string;
    borderMuted: string;
    divider: string;
    imageBackground: string;
    primarySubtle: string;
    primarySoft: string;
    editingBannerBackground: string;
    actionBackground: string;
    dangerBackground: string;
    modalHandle: string;
    shadow: string;
    overlay: string;
    overlaySoft: string;
    overlayStrong: string;
    inputUnderline: string;
    avatarBadgeBorder: string;
    communityTechniqueText: string;
    searchBarBackground: string;
    searchBarText: string;
    searchBarPlaceholder: string;
    disabledButtonBackground: string;
    stepperButtonBackground: string;
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
        primaryAlt: Colors.primaryAlt,
        primaryAlpha45: Colors.primaryAlpha45,
        primaryAlpha85: Colors.primaryAlpha85,
        white: Colors.white,
        black: Colors.black,
        fixedWhite: Colors.fixedWhite,
        fixedBlack: Colors.fixedBlack,
        error: Colors.error,
        errorStrong: Colors.errorStrong,
        errorDark: Colors.errorDark,
        errorSoft: Colors.errorSoft,
        success: Colors.success,
        successDark: Colors.successDark,
        info: Colors.info,
        infoSoft: Colors.infoSoft,
        whiteAlpha20: Colors.whiteAlpha20,
        whiteAlpha35: Colors.whiteAlpha35,
        whiteAlpha45: Colors.whiteAlpha45,
        whiteAlpha50: Colors.whiteAlpha50,
        whiteAlpha55: Colors.whiteAlpha55,
        whiteAlpha65: Colors.whiteAlpha65,
        whiteAlpha70: Colors.whiteAlpha70,
        whiteAlpha75: Colors.whiteAlpha75,
        whiteAlpha86: Colors.whiteAlpha86,

        background: themeColors.background,
        surface: themeColors.surface,
        surfaceAlt: themeColors.surfaceAlt,
        elevatedSurface: themeColors.elevatedSurface,
        card: themeColors.card,
        text: themeColors.text,
        textStrong: themeColors.textStrong,
        textHeading: themeColors.textHeading,
        textSecondary: themeColors.textSecondary,
        textMuted: themeColors.textMuted,
        textSubtle: themeColors.textSubtle,
        textDisabled: themeColors.textDisabled,
        placeholder: themeColors.placeholder,
        iconMuted: themeColors.iconMuted,
        inputBackground: themeColors.inputBackground,
        inputBorder: themeColors.inputBorder,
        border: themeColors.border,
        borderSoft: themeColors.borderSoft,
        borderMuted: themeColors.borderMuted,
        divider: themeColors.divider,
        imageBackground: themeColors.imageBackground,
        primarySubtle: themeColors.primarySubtle,
        primarySoft: themeColors.primarySoft,
        editingBannerBackground: themeColors.editingBannerBackground,
        actionBackground: themeColors.actionBackground,
        dangerBackground: themeColors.dangerBackground,
        modalHandle: themeColors.modalHandle,
        shadow: themeColors.shadow,
        overlay: themeColors.overlay,
        overlaySoft: themeColors.overlaySoft,
        overlayStrong: themeColors.overlayStrong,
        inputUnderline: themeColors.inputUnderline,
        avatarBadgeBorder: themeColors.avatarBadgeBorder,
        communityTechniqueText: themeColors.communityTechniqueText,
        searchBarBackground: themeColors.searchBarBackground,
        searchBarText: themeColors.searchBarText,
        searchBarPlaceholder: themeColors.searchBarPlaceholder,
        disabledButtonBackground: themeColors.disabledButtonBackground,
        stepperButtonBackground: themeColors.stepperButtonBackground,
    };

    return { colors, isDark };
}

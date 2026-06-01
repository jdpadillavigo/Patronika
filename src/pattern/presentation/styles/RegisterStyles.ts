import { StyleSheet, Platform } from 'react-native';
import type { AppColors } from '../../../ui/theme/Theme';

export function createRegisterStyles(colors: AppColors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 40,
            paddingTop: 20,
        },
        backButton: {
            alignSelf: 'flex-start',
            paddingVertical: 8,
            paddingRight: 16,
            marginBottom: 16,
        },
        backButtonText: {
            color: colors.textSecondary,
            fontSize: 15,
            fontWeight: '500',
        },
        headerContainer: {
            marginBottom: 32,
        },
        title: {
            fontSize: 32,
            fontWeight: '800',
            color: colors.text,
            letterSpacing: -1,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 15,
            color: colors.textSecondary,
            lineHeight: 22,
        },
        formContainer: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 24,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
        },
        inputGroup: {
            marginBottom: 20,
        },
        label: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
        },
        input: {
            backgroundColor: colors.inputBackground,
            borderWidth: 1.5,
            borderColor: colors.inputBorder,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === 'ios' ? 14 : 12,
            fontSize: 15,
            color: colors.text,
        },
        inputError: {
            borderColor: colors.error,
            backgroundColor: colors.errorBg,
        },
        errorText: {
            color: colors.error,
            fontSize: 12,
            marginTop: 6,
            fontWeight: '500',
        },
        passwordContainer: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            backgroundColor: colors.inputBackground,
            borderWidth: 1.5,
            borderColor: colors.inputBorder,
            borderRadius: 12,
        },
        passwordInput: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === 'ios' ? 14 : 12,
            fontSize: 15,
            color: colors.text,
        },
        eyeButton: {
            paddingHorizontal: 14,
            paddingVertical: 12,
        },
        eyeIcon: {
            fontSize: 18,
        },
        strengthContainer: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            marginTop: 10,
            gap: 10,
        },
        strengthBar: {
            flex: 1,
            height: 4,
            backgroundColor: colors.inputBorder,
            borderRadius: 2,
            overflow: 'hidden' as const,
        },
        strengthFill: {
            height: '100%',
            borderRadius: 2,
        },
        strengthLabel: {
            fontSize: 12,
            fontWeight: '600',
            minWidth: 50,
            textAlign: 'right' as const,
        },
        registerButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center' as const,
            marginTop: 8,
            elevation: 6,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
        },
        registerButtonDisabled: {
            opacity: 0.6,
        },
        registerButtonText: {
            color: colors.white,
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 0.3,
        },
        loginContainer: {
            flexDirection: 'row' as const,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            marginTop: 24,
        },
        loginText: {
            color: colors.textSecondary,
            fontSize: 14,
        },
        loginLink: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: '700',
        },
    });
}

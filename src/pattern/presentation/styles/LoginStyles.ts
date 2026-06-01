import { StyleSheet, Platform } from 'react-native';
import type { AppColors } from '../../../ui/theme/Theme';

export function createLoginStyles(colors: AppColors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 40,
        },
        headerContainer: {
            alignItems: 'center',
            marginBottom: 40,
        },
        logoCircle: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            elevation: 10,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
        },
        logoText: {
            color: colors.white,
            fontSize: 32,
            fontWeight: '800',
        },
        title: {
            fontSize: 30,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 15,
            color: colors.textSecondary,
            textAlign: 'center',
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
        forgotContainer: {
            alignItems: 'flex-end' as const,
            marginTop: -8,
            marginBottom: 24,
        },
        forgotText: {
            color: colors.primary,
            fontSize: 13,
            fontWeight: '600',
        },
        loginButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center' as const,
            elevation: 6,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
        },
        loginButtonDisabled: {
            opacity: 0.6,
        },
        loginButtonText: {
            color: colors.white,
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 0.3,
        },
        dividerContainer: {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            marginVertical: 24,
        },
        dividerLine: {
            flex: 1,
            height: 1,
            backgroundColor: colors.inputBorder,
        },
        dividerText: {
            color: colors.textSecondary,
            paddingHorizontal: 12,
            fontSize: 13,
        },
        registerContainer: {
            flexDirection: 'row' as const,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
        },
        registerText: {
            color: colors.textSecondary,
            fontSize: 14,
        },
        registerLink: {
            color: colors.primary,
            fontSize: 14,
            fontWeight: '700',
        },
    });
}

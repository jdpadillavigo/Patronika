import { StyleSheet } from 'react-native';
import type { AppColors } from '../../../../core/presentation/designsystem/Theme';

export function createOnboardingStyles(colors: AppColors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        slideContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
        },
        iconContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
            elevation: 12,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
        },
        iconText: {
            fontSize: 52,
        },
        slideTitle: {
            fontSize: 28,
            fontWeight: '800',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 16,
        },
        slideDescription: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
            paddingHorizontal: 8,
        },
        footer: {
            paddingHorizontal: 24,
            paddingBottom: 48,
            paddingTop: 16,
        },
        dotsContainer: {
            flexDirection: 'row' as const,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 32,
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.inputBorder,
            marginHorizontal: 4,
        },
        dotActive: {
            width: 24,
            backgroundColor: colors.primary,
        },
        buttonsContainer: {
            flexDirection: 'row' as const,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        skipButton: {
            paddingVertical: 14,
            paddingHorizontal: 20,
        },
        skipButtonText: {
            color: colors.textSecondary,
            fontSize: 15,
            fontWeight: '600',
        },
        nextButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 32,
            elevation: 6,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
        },
        nextButtonText: {
            color: colors.white,
            fontSize: 15,
            fontWeight: '700',
        },
        startButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center' as const,
            width: '100%',
            elevation: 6,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
        },
        startButtonText: {
            color: colors.white,
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 0.3,
        },
    });
}

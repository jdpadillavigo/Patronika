import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../ui/theme/Theme';
import type { AppColors } from '../../../ui/theme/Theme';
import ApiClient from '../../../core/data/networking/ApiClient';
import type { RootStackParamList } from '../../../core/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const { colors } = useAppTheme();
    const styles = useMemo(() => createHomeStyles(colors), [colors]);

    const handleLogout = async () => {
        await ApiClient.clearTokens();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>P</Text>
                </View>
                <Text style={styles.title}>¡Bienvenido!</Text>
                <Text style={styles.subtitle}>
                    Has iniciado sesión exitosamente en Patronika
                </Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

function createHomeStyles(colors: AppColors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 40,
        },
        content: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        logoCircle: {
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            elevation: 10,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
        },
        logoText: {
            color: colors.white,
            fontSize: 40,
            fontWeight: '800',
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 12,
        },
        subtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24,
        },
        logoutButton: {
            backgroundColor: colors.surface,
            borderWidth: 1.5,
            borderColor: colors.inputBorder,
            borderRadius: 12,
            paddingVertical: 16,
            paddingHorizontal: 32,
            alignItems: 'center',
            width: '100%',
            marginBottom: 40,
        },
        logoutButtonText: {
            color: colors.error,
            fontSize: 16,
            fontWeight: '600',
        },
    });
}

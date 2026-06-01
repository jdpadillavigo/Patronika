import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../../pattern/presentation/screens/LoginScreen';
import RegisterScreen from '../../pattern/presentation/screens/RegisterScreen';
import HomeScreen from '../../pattern/presentation/screens/HomeScreen';
import OnboardingScreen from '../../pattern/presentation/screens/OnboardingScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ONBOARDING_KEY = '@patronika_onboarding_done';

export default function AppNavigator() {
    const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

    useEffect(() => {
        async function checkOnboarding() {
            try {
                const done = await AsyncStorage.getItem(ONBOARDING_KEY);
                setInitialRoute(done === 'true' ? 'Login' : 'Onboarding');
            } catch {
                // Si hay error leyendo, mostrar onboarding por seguridad
                setInitialRoute('Onboarding');
            }
        }
        checkOnboarding();
    }, []);

    // Mostrar loading mientras se determina la ruta inicial
    if (initialRoute === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#763A6C" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
}

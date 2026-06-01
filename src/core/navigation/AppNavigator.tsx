import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../../pattern/presentation/screens/LoginScreen.js';
import RegistroScreen from '../../pattern/presentation/screens/RegistroScreen.js';
import MisPatronesScreen from '../../pattern/presentation/screens/MisPatronesScreen.js';
import GenerarPatronScreen from '../../pattern/presentation/screens/GenerarPatronScreen.js';
import FormularioPatronScreen from '../../pattern/presentation/screens/FormularioPatronScreen.js';
import VistaPreviaScreen from '../../pattern/presentation/screens/VistaPreviaScreen.js';
import PerfilScreen from '../../pattern/presentation/screens/PerfilScreen.js';
import OlvidasteContrasenaScreen from '../../pattern/presentation/screens/OlvidasteContrasenaScreen.js';
import VerificarCorreoScreen from '../../pattern/presentation/screens/VerificarCorreoScreen.js';
import RestablecerContrasenaScreen from '../../pattern/presentation/screens/RestablecerContrasenaScreen.js';
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
            <Stack.Screen name="Register" component={RegistroScreen} />
            <Stack.Screen name="Registro" component={RegistroScreen} />
            <Stack.Screen name="Home" component={MisPatronesScreen} />
            <Stack.Screen name="MisPatrones" component={MisPatronesScreen} />
            <Stack.Screen name="GenerarPatron" component={GenerarPatronScreen} />
            <Stack.Screen name="Formulario" component={FormularioPatronScreen} />
            <Stack.Screen name="VistaPrevia" component={VistaPreviaScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
            <Stack.Screen name="OlvidasteContrasena" component={OlvidasteContrasenaScreen} />
            <Stack.Screen name="VerificarCorreo" component={VerificarCorreoScreen} />
            <Stack.Screen name="RestablecerContrasena" component={RestablecerContrasenaScreen} />
        </Stack.Navigator>
    );
}

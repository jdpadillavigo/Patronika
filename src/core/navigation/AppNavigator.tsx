import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../../pattern/presentation/screens/LoginScreen.js';
import RegistroScreen from '../../pattern/presentation/screens/RegistroScreen.js';
import MisPatronesScreen from '../../pattern/presentation/screens/MisPatronesScreen.js';
import PerfilScreen from '../../pattern/presentation/screens/PerfilScreen.js';
import GestionUsuariosScreen from '../../pattern/presentation/screens/GestionUsuariosScreen.js';
import OlvidasteContrasenaScreen from '../../pattern/presentation/screens/OlvidasteContrasenaScreen.js';
import VerificarCorreoScreen from '../../pattern/presentation/screens/VerificarCorreoScreen.js';
import RestablecerContrasenaScreen from '../../pattern/presentation/screens/RestablecerContrasenaScreen.js';
import OnboardingScreen from '../../pattern/presentation/screens/OnboardingScreen';
import TermsAndConditionsScreen from '../../pattern/presentation/screens/TermsAndConditionsScreen.js';
import HomeScreen from '../../pattern/presentation/screens/HomeScreen.js';
import PublicacionDetalleScreen from '../../pattern/presentation/screens/PublicacionDetalleScreen.js';
import CrearPublicacionScreen from '../../pattern/presentation/screens/CrearPublicacionScreen.js';
import GeneratePatternNavigator from './GeneratePatternNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ONBOARDING_KEY = '@patronika_onboarding_done';
const tabLikeScreenOptions = { animation: 'none' as const };
const bottomSheetScreenOptions = {
    animation: 'none' as const,
    presentation: 'modal' as const,
    gestureDirection: 'vertical' as const,
};

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
            <Stack.Screen name="Home" component={MisPatronesScreen} options={tabLikeScreenOptions} />
            <Stack.Screen name="MisPatrones" component={MisPatronesScreen} options={tabLikeScreenOptions} />
            <Stack.Screen name="GenerarPatron" component={GeneratePatternNavigator} options={bottomSheetScreenOptions} />
            <Stack.Screen name="Perfil" component={PerfilScreen} options={tabLikeScreenOptions} />
            <Stack.Screen name="GestionUsuarios" component={GestionUsuariosScreen} options={tabLikeScreenOptions}/>
            <Stack.Screen name="OlvidasteContrasena" component={OlvidasteContrasenaScreen} />
            <Stack.Screen name="VerificarCorreo" component={VerificarCorreoScreen} />
            <Stack.Screen name="RestablecerContrasena" component={RestablecerContrasenaScreen} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
            <Stack.Screen name="Comunidad" component={HomeScreen} options={tabLikeScreenOptions} />
            <Stack.Screen name="PublicacionDetalle" component={PublicacionDetalleScreen} />
            <Stack.Screen name="CrearPublicacion" component={CrearPublicacionScreen} />
        </Stack.Navigator>
    );
}

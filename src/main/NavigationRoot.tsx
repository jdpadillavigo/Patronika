import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../features/auth/login/presentation/screens/LoginScreen.js';
import RegisterScreen from '../features/auth/register/presentation/screens/RegisterScreen.js';
import VerifyEmailScreen from '../features/auth/verification/presentation/screens/VerifyEmailScreen.js';
import AdminCommunityManagementScreen from '../features/admin/communityManagement/presentation/screens/AdminCommunityManagementScreen.js';
import SanctionUserDeletePublicationScreen from '../features/admin/communityManagement/presentation/screens/SanctionUserDeletePublicationScreen.js';
import AddUserScreen from '../features/admin/userManagement/presentation/screens/AddUserScreen.js';
import EditUserScreen from '../features/admin/userManagement/presentation/screens/EditUserScreen.js';
import UserManagementScreen from '../features/admin/userManagement/presentation/screens/UserManagementScreen.js';
import HomeScreen from '../features/home/presentation/screens/HomeScreen.js';
import OnboardingScreen from '../features/onboarding/presentation/screens/OnboardingScreen';
import MyPatternsScreen from '../features/pattern/presentation/screens/MyPatternsScreen.js';
import AdminTutorialManagementScreen from '../features/tutorial/presentation/screens/AdminTutorialManagementScreen.js';
import TutorialFormScreen from '../features/tutorial/presentation/screens/TutorialFormScreen.js';
import TutorialesScreen from '../features/tutorial/presentation/screens/TutorialesScreen.js';
import CreatePostScreen from '../features/post/presentation/screens/CreatePostScreen.js';
import PostDetailScreen from '../features/post/presentation/screens/PostDetailScreen.js';
import ProfileScreen from '../features/profile/presentation/screens/ProfileScreen.js';
import ForgotPasswordScreen from '../features/resetPassword/presentation/screens/ForgotPasswordScreen.js';
import ResetPasswordScreen from '../features/resetPassword/presentation/screens/ResetPasswordScreen.js';
import TermsAndConditionsScreen from '../features/terms/presentation/screens/TermsAndConditionsScreen.js';
import GeneratePatternNavigator from './GeneratePatternNavigator';
import type { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ONBOARDING_KEY = '@patronika_onboarding_done';
const tabLikeScreenOptions = { animation: 'none' as const };
const bottomSheetScreenOptions = {
    animation: 'none' as const,
    presentation: 'modal' as const,
    gestureDirection: 'vertical' as const,
};

export default function NavigationRoot() {
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
            <Stack.Screen name="Registro" component={RegisterScreen} />
            <Stack.Screen name="Home" component={MyPatternsScreen} options={tabLikeScreenOptions} />
            <Stack.Screen name="MisPatrones" component={MyPatternsScreen} options={tabLikeScreenOptions} />
            <Stack.Screen name="GenerarPatron" component={GeneratePatternNavigator} options={bottomSheetScreenOptions} />
            <Stack.Screen name="Perfil" component={ProfileScreen} options={tabLikeScreenOptions} />
            <Stack.Screen name="GestionUsuarios" component={UserManagementScreen} options={tabLikeScreenOptions}/>
            <Stack.Screen name="AgregarUsuarioAdmin" component={AddUserScreen} />
            <Stack.Screen name="EditarUsuarioAdmin" component={EditUserScreen} />
            <Stack.Screen name="GestionComunidadAdmin" component={AdminCommunityManagementScreen} options={tabLikeScreenOptions}/>
            <Stack.Screen name="SancionarEliminarPublicacionAdmin" component={SanctionUserDeletePublicationScreen} />
            <Stack.Screen name="GestionTutorialesAdmin" component={AdminTutorialManagementScreen} options={tabLikeScreenOptions} />
            <Stack.Screen name="AgregarTutorialAdmin" component={TutorialFormScreen} />
            <Stack.Screen name="EditarTutorialAdmin" component={TutorialFormScreen} />
            <Stack.Screen name="OlvidasteContrasena" component={ForgotPasswordScreen} />
            <Stack.Screen name="VerificarCorreo" component={VerifyEmailScreen} />
            <Stack.Screen name="RestablecerContrasena" component={ResetPasswordScreen} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
            <Stack.Screen name="Comunidad" component={HomeScreen} options={tabLikeScreenOptions} />
            <Stack.Screen name="PublicacionDetalle" component={PostDetailScreen} />
            <Stack.Screen name="CrearPublicacion" component={CreatePostScreen} />
            <Stack.Screen name="Tutoriales" component={TutorialesScreen} options={tabLikeScreenOptions} />
        </Stack.Navigator>
    );
}

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../../pattern/presentation/screens/LoginScreen';
import RegisterScreen from '../../pattern/presentation/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

/**
 * Navigator principal de la app.
 * Por ahora contiene Login y Register.
 * Se irá expandiendo con Onboarding, Home, etc.
 */
export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

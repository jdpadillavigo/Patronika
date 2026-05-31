import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegistroScreen from './screens/RegistroScreen';
import MisPatronesScreen from './screens/MisPatronesScreen'; 
import GenerarPatronScreen from './screens/GenerarPatronScreen';
import FormularioPatronScreen from './screens/FormularioPatronScreen';
import VistaPreviaScreen from './screens/VistaPreviaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="MisPatrones" component={MisPatronesScreen} /> 
        <Stack.Screen name="GenerarPatron" component={GenerarPatronScreen} />
        <Stack.Screen name="Formulario" component={FormularioPatronScreen} />
        <Stack.Screen name="VistaPrevia" component={VistaPreviaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


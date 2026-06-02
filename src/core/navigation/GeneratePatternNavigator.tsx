import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import GenerarPatronScreen from '../../pattern/presentation/screens/GenerarPatronScreen.js';
import FormularioPatronScreen from '../../pattern/presentation/screens/FormularioPatronScreen.js';
import VistaPreviaScreen from '../../pattern/presentation/screens/VistaPreviaScreen.js';
import { GeneratePatternFlowContext } from './GeneratePatternFlowContext';

const Stack = createNativeStackNavigator();
const SCREEN_HEIGHT = Dimensions.get('window').height;

type Props = NativeStackScreenProps<RootStackParamList, 'GenerarPatron'>;

export default function GeneratePatternNavigator({ navigation }: Props) {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const isClosing = useRef(false);

    React.useEffect(() => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 280,
            useNativeDriver: true,
        }).start();
    }, [translateY]);

    const closeWithAnimation = useCallback((afterClose?: () => void) => {
        if (isClosing.current) return;
        isClosing.current = true;

        Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 280,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (!finished) return;
            navigation.goBack();
            afterClose?.();
        });
    }, [navigation, translateY]);

    const actions = useMemo(() => ({
        closeFlow: () => closeWithAnimation(),
        acceptPattern: () => closeWithAnimation(() => navigation.navigate('MisPatrones')),
    }), [closeWithAnimation, navigation]);

    return (
        <GeneratePatternFlowContext.Provider value={actions}>
            <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
                <Stack.Navigator
                    initialRouteName="GenerarPatronInicio"
                    screenOptions={{
                        headerShown: false,
                        animation: 'fade',
                    }}
                >
                    <Stack.Screen name="GenerarPatronInicio" component={GenerarPatronScreen} />
                    <Stack.Screen name="Formulario" component={FormularioPatronScreen} />
                    <Stack.Screen name="VistaPrevia" component={VistaPreviaScreen} />
                </Stack.Navigator>
            </Animated.View>
        </GeneratePatternFlowContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

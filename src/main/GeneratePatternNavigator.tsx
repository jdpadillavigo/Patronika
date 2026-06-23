import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './navigationTypes';

import GeneratePatternScreen from '../features/pattern/presentation/screens/GeneratePatternScreen.js';
import PatternFormScreen from '../features/pattern/presentation/screens/PatternFormScreen.js';
import PatternPreviewScreen from '../features/pattern/presentation/screens/PatternPreviewScreen.js';
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
                    <Stack.Screen name="GenerarPatronInicio" component={GeneratePatternScreen} />
                    <Stack.Screen name="Formulario" component={PatternFormScreen} />
                    <Stack.Screen name="VistaPrevia" component={PatternPreviewScreen} />
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

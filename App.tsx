import React, { useEffect, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import AppNavigator from './src/core/navigation/AppNavigator';
import type { RootStackParamList } from './src/core/navigation/types';
import SessionExpiredModal from './src/core/presentation/SessionExpiredModal';
import SessionExpiredService from './src/core/domain/session/SessionExpiredService';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function App() {
    const [sessionExpiredVisible, setSessionExpiredVisible] = useState(false);

    useEffect(() => {
        return SessionExpiredService.subscribe(() => {
            setSessionExpiredVisible(true);

            if (navigationRef.isReady()) {
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        });
    }, []);

    const handleSessionExpiredAccept = () => {
        setSessionExpiredVisible(false);
        SessionExpiredService.reset();
    };

    return (
        <NavigationContainer ref={navigationRef}>
            <AppNavigator />
            <SessionExpiredModal
                visible={sessionExpiredVisible}
                onAccept={handleSessionExpiredAccept}
            />
        </NavigationContainer>
    );
}

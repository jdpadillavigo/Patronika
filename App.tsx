import React, { useEffect, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import NavigationRoot from './src/main/NavigationRoot';
import type { RootStackParamList } from './src/main/navigationTypes';
import SessionExpiredModal from './src/core/presentation/designsystem/components/SessionExpiredModal';
import SessionExpiredService from './src/core/domain/session/SessionExpiredService';
import SystemBarsLayout from './src/core/presentation/designsystem/components/SystemBarsLayout';

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
        <SystemBarsLayout>
            <NavigationContainer ref={navigationRef}>
                <NavigationRoot />
                <SessionExpiredModal
                    visible={sessionExpiredVisible}
                    onAccept={handleSessionExpiredAccept}
                />
            </NavigationContainer>
        </SystemBarsLayout>
    );
}

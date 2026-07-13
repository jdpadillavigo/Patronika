import React, { type PropsWithChildren, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import {
    initialWindowMetrics,
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';

import Colors from '../Colors';
import { useAppTheme } from '../Theme';

function SystemBarsContent({ children }: PropsWithChildren) {
    const { colors, isDark } = useAppTheme();
    const navigationBarColor = colors.background;

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        // SDK 58: setStyle defines the button color (light buttons on dark theme).
        NavigationBar.setStyle(isDark ? 'light' : 'dark');
    }, [isDark]);

    return (
        <View style={[styles.root, { backgroundColor: navigationBarColor }]}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.statusBarArea} edges={['top']}>
                <SafeAreaView
                    style={[styles.content, { backgroundColor: navigationBarColor }]}
                    edges={['bottom']}
                >
                    {children}
                </SafeAreaView>
            </SafeAreaView>
        </View>
    );
}

export default function SystemBarsLayout({ children }: PropsWithChildren) {
    return (
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <SystemBarsContent>{children}</SystemBarsContent>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    statusBarArea: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    content: {
        flex: 1,
    },
});

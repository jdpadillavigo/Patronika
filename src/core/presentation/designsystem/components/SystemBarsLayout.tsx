import React, { type PropsWithChildren, useEffect } from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import {
    initialWindowMetrics,
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';

import Colors from '../Colors';

function SystemBarsContent({ children }: PropsWithChildren) {
    const isDark = useColorScheme() === 'dark';
    const navigationBarColor = isDark ? Colors.black : Colors.white;

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        NavigationBar.setStyle(isDark ? 'dark' : 'light');
        NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark').catch(() => undefined);
    }, [isDark]);

    return (
        <View style={[styles.root, { backgroundColor: navigationBarColor }]}>
            <StatusBar style="light" backgroundColor={Colors.primary} translucent />
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

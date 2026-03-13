import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import NavigationProvider from './NavigationProvider';
import NavigationRenderer from './NavigationRenderer';
import {ThemeProvider, useTheme} from '../theme';

function AppContent() {
    const {resolvedMode, theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme.colors.navigationSurface), [theme.colors.navigationSurface]);

    return (
        <View style={styles.appShell}>
            <StatusBar
                barStyle={resolvedMode === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.navigationSurface}
                translucent={false}
            />
            <NavigationProvider>
                <NavigationRenderer />
            </NavigationProvider>
        </View>
    );
}

function App() {
    return (
        <GestureHandlerRootView style={styles.root}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});

function createStyles(backgroundColor: string) {
    return StyleSheet.create({
        appShell: {
            flex: 1,
            backgroundColor,
        },
    });
}

export default App;

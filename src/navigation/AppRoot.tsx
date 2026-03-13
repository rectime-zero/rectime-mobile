import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import NavigationProvider from '../presentation/NavigationProvider';
import NavigationRenderer from '../presentation/NavigationRenderer';
import {ThemeProvider, useTheme} from '../theme';

function AppContent() {
    const {resolvedMode, theme} = useTheme();

    return (
        <>
            <StatusBar
                barStyle={resolvedMode === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.appBackground}
            />
            <NavigationProvider>
                <NavigationRenderer />
            </NavigationProvider>
        </>
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

export default App;

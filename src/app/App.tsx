import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import StageProvider from '../stage/StageProvider';
import StageRenderer from '../stage/StageRenderer';

function App() {
    return (
        <GestureHandlerRootView style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#E7ECF7" />
            <SafeAreaProvider>
                <StageProvider>
                    <StageRenderer />
                </StageProvider>
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

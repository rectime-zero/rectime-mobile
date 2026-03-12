import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import StageProvider from '../stage/StageProvider';
import StageRenderer from '../stage/StageRenderer';

function App() {
    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#E7ECF7" />
            <StageProvider>
                <StageRenderer />
            </StageProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});

export default App;

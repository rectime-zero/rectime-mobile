/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NewAppScreen} from '@react-native/new-app-screen';
import {StyleSheet, Text, View} from 'react-native';

function App() {
    return (
        <>
            <Text>こんにちはaaaてすとaa</Text>

            {/*<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>*/}
            <AppContent/>
        </>
    );
}

function AppContent() {
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 28, marginTop: 80, textAlign: 'center'}}>
                Hot Reload Test
            </Text>
            <NewAppScreen templateFileName="src/app/App.tsx"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;

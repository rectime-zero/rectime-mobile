import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PushScreenLayout from '../../components/layout/screen/PushScreenLayout';
import {type AppRoute} from '../../navigation/types';
import {useTheme} from '../../theme';

type DevelopmentScreenProps = {
    route: AppRoute<'development'>;
};

function DevelopmentScreen({route}: DevelopmentScreenProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PushScreenLayout route={route}>
            <View style={styles.card}>
                <Text style={styles.label}>開発</Text>
            </View>
        </PushScreenLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        card: {
            borderRadius: 22,
            padding: 20,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        label: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
    });
}

export default DevelopmentScreen;

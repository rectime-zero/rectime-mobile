import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AccessoryButton from '../../components/button/AccessoryButton';
import PageLayout from '../../components/layout/PageLayout';
import {type AppRoute} from '../../navigation/types';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';

type DevelopmentScreenProps = {
    route: AppRoute<'development'>;
};

function DevelopmentScreen({route}: DevelopmentScreenProps) {
    const {theme} = useTheme();
    const {closeMenuPage, pop} = useNavigation();
    const handleBack = route.presentation === 'menu-page' ? closeMenuPage : pop;
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<AccessoryButton accessibilityLabel="戻る" icon="chevron-left" onPress={handleBack} />}
            title="開発メニュー">
            <View style={styles.card}>
                <Text style={styles.label}>開発</Text>
            </View>
        </PageLayout>
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

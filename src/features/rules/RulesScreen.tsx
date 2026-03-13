import React from 'react';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import {StyleSheet, Text, View} from 'react-native';
import HeaderIconButton from '../../components/HeaderIconButton';
import PageLayout from '../../components/layout/PageLayout';
import MenuAvatarButton from '../../components/MenuAvatarButton';
import {sheetRoutes} from '../../config/navigationRoutes';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';
import {ruleEntries, rulesHeroCopy} from './data';

function RulesScreen() {
    const {theme} = useTheme();
    const {openMenu, presentSheetRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<MenuAvatarButton onPress={openMenu} />}
            headerTrailing={
                <HeaderIconButton
                    icon="bell"
                    label="通知"
                    onPress={() => presentSheetRoute(sheetRoutes.notifications)}
                />
            }
            title="ルール">
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>{rulesHeroCopy.title}</Text>
                <Text style={styles.heroBody}>{rulesHeroCopy.body}</Text>
            </View>

            <View style={styles.ruleList}>
                {ruleEntries.map(rule => (
                    <View key={rule.title} style={styles.ruleCard}>
                        <View style={styles.iconBadge}>
                            <FontAwesome5 color={theme.colors.navigationActive} iconStyle="solid" name={rule.icon} size={16} />
                        </View>
                        <View style={styles.ruleContent}>
                            <Text style={styles.ruleTitle}>{rule.title}</Text>
                            <Text style={styles.ruleBody}>{rule.body}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        hero: {
            gap: 8,
            borderRadius: 24,
            padding: 18,
            backgroundColor: theme.colors.surfaceMuted,
        },
        heroTitle: {
            color: theme.colors.textPrimary,
            fontSize: 22,
            fontWeight: '800',
        },
        heroBody: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 21,
        },
        ruleList: {
            marginTop: 12,
            gap: 12,
        },
        ruleCard: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 14,
            borderRadius: 22,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        iconBadge: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceAccent,
        },
        ruleContent: {
            flex: 1,
            gap: 6,
        },
        ruleTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '800',
        },
        ruleBody: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
        },
    });
}

export default RulesScreen;

import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import HeaderIconButton from '../../components/HeaderIconButton';
import PageLayout from '../../components/layout/PageLayout';
import {type AppRoute} from '../../navigation/types';
import {useNavigation} from '../../navigation/useNavigation';
import {availableThemes, useTheme} from '../../theme';

type SettingsScreenProps = {
    route: AppRoute<'settings'>;
};

function SettingsScreen({route}: SettingsScreenProps) {
    const {theme, selectedThemeId, setSelectedThemeId} = useTheme();
    const {closeMenuPage, pop} = useNavigation();
    const handleBack = route.presentation === 'menu-page' ? closeMenuPage : pop;
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<HeaderIconButton icon="chevron-left" label="戻る" onPress={handleBack} />}
            title="設定">
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>表示テーマ</Text>
                <Text style={styles.sectionBody}>アプリ全体の配色を切り替えます。</Text>

                <View style={styles.themeList}>
                    {availableThemes.map(item => {
                        const isSelected = item.id === selectedThemeId;

                        return (
                            <View key={item.id} style={[styles.themeCard, isSelected ? styles.themeCardSelected : null]}>
                                <View>
                                    <Text style={styles.themeTitle}>{item.label}</Text>
                                    <Text style={styles.themeBody}>
                                        {item.id === 'blue-2024'
                                            ? 'コントラストを強めた配色です。'
                                            : 'やわらかく見やすい標準配色です。'}
                                    </Text>
                                </View>
                                <Switch
                                    value={isSelected}
                                    onValueChange={() => setSelectedThemeId(item.id)}
                                    trackColor={{
                                        false: theme.colors.surfaceMuted,
                                        true: theme.colors.buttonPrimary,
                                    }}
                                    thumbColor={theme.colors.buttonPrimaryText}
                                />
                            </View>
                        );
                    })}
                </View>
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        section: {
            gap: 14,
        },
        sectionTitle: {
            color: theme.colors.textPrimary,
            fontSize: 22,
            fontWeight: '800',
        },
        sectionBody: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
        },
        themeList: {
            gap: 12,
        },
        themeCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            borderRadius: 22,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        themeCardSelected: {
            borderColor: theme.colors.navigationActive,
        },
        themeTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '700',
        },
        themeBody: {
            marginTop: 4,
            color: theme.colors.textSecondary,
            fontSize: 13,
            lineHeight: 20,
        },
    });
}

export default SettingsScreen;

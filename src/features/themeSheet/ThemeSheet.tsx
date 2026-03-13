import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import ActionButton from '../../components/ActionButton';
import {useNavigation} from '../../navigation/useNavigation';
import {availableThemes, useTheme} from '../../theme';

function ThemeSheet() {
    const {theme, selectedThemeId, setSelectedThemeId} = useTheme();
    const {dismissSheet} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>テーマ</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="閉じる" onPress={dismissSheet} style={styles.closeButton}>
                    <FontAwesome5 color={theme.colors.textPrimary} iconStyle="solid" name="times" size={14} />
                </Pressable>
            </View>

            <Text style={styles.body}>アプリ全体の見た目を切り替えます。選択したテーマはすぐに反映されます。</Text>

            <View style={styles.optionList}>
                {availableThemes.map(item => {
                    const isSelected = item.id === selectedThemeId;

                    return (
                        <Pressable
                            key={item.id}
                            accessibilityRole="button"
                            onPress={() => setSelectedThemeId(item.id)}
                            style={[styles.optionCard, isSelected ? styles.optionCardSelected : null]}>
                            <View style={styles.optionPreview}>
                                <View
                                    style={[
                                        styles.previewBase,
                                        item.id === 'blue-2024' ? styles.previewBlue : styles.previewDefault,
                                    ]}
                                />
                                <View
                                    style={[
                                        styles.previewAccent,
                                        item.id === 'blue-2024' ? styles.previewAccentBlue : styles.previewAccentDefault,
                                    ]}
                                />
                            </View>
                            <View style={styles.optionCopy}>
                                <Text style={styles.optionTitle}>{item.label}</Text>
                                <Text style={styles.optionBody}>
                                    {item.id === 'blue-2024' ? 'コントラストを強めたクールな配色です。' : '標準のやわらかい配色です。'}
                                </Text>
                            </View>
                            {isSelected ? (
                                <View style={styles.selectedBadge}>
                                    <FontAwesome5
                                        color={theme.colors.buttonPrimaryText}
                                        iconStyle="solid"
                                        name="check"
                                        size={12}
                                    />
                                </View>
                            ) : null}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            gap: 16,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        title: {
            color: theme.colors.textPrimary,
            fontSize: 24,
            fontWeight: '800',
        },
        closeButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceMuted,
        },
        body: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 24,
        },
        optionList: {
            gap: 12,
        },
        optionCard: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            borderRadius: 24,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        optionCardSelected: {
            borderColor: theme.colors.navigationActive,
            backgroundColor: theme.colors.surfaceMuted,
        },
        optionPreview: {
            width: 52,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 26,
            backgroundColor: theme.colors.surfaceMuted,
        },
        previewBase: {
            width: 28,
            height: 28,
            borderRadius: 14,
        },
        previewDefault: {
            backgroundColor: '#D9DEE7',
        },
        previewBlue: {
            backgroundColor: '#355CFF',
        },
        previewAccent: {
            position: 'absolute',
            right: 10,
            bottom: 10,
            width: 14,
            height: 14,
            borderRadius: 7,
            borderWidth: 2,
            borderColor: '#FFFFFF',
        },
        previewAccentDefault: {
            backgroundColor: '#8E9AAF',
        },
        previewAccentBlue: {
            backgroundColor: '#8DE1FF',
        },
        optionCopy: {
            flex: 1,
            gap: 4,
        },
        optionTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '700',
        },
        optionBody: {
            color: theme.colors.textSecondary,
            fontSize: 13,
            lineHeight: 20,
        },
        selectedBadge: {
            width: 26,
            height: 26,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 13,
            backgroundColor: theme.colors.buttonPrimary,
        },
    });
}

export default ThemeSheet;

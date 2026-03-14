import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import SurfaceButton from '../../components/SurfaceButton';
import SheetHeader from '../../components/layout/SheetHeader';
import {useNavigation} from '../../navigation/useNavigation';
import {availableThemes, useTheme} from '../../theme';

function ThemeSheet() {
    const {theme, selectedThemeId, setSelectedThemeId} = useTheme();
    const {dismissSheet} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <SheetHeader onRightPress={dismissSheet} rightAction="close" title="テーマ" />

            <Text style={styles.body}>
                アプリ全体の見た目を選べます。テーマを変更すると、画面全体にすぐ反映されます。
            </Text>

            <View style={styles.optionList}>
                {availableThemes.map(item => {
                    const isSelected = item.id === selectedThemeId;

                    return (
                        <SurfaceButton
                            key={item.id}
                            accessibilityLabel={item.label}
                            chrome="solid"
                            onPress={() => setSelectedThemeId(item.id)}
                            style={[styles.optionCard, isSelected ? styles.optionCardSelected : null]}
                            contentStyle={styles.optionCardContent}>
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
                                        item.id === 'blue-2024'
                                            ? styles.previewAccentBlue
                                            : styles.previewAccentDefault,
                                    ]}
                                />
                            </View>
                            <View style={styles.optionCopy}>
                                <Text style={styles.optionTitle}>{item.label}</Text>
                                <Text style={styles.optionBody}>
                                    {item.id === 'blue-2024'
                                        ? 'コントラストを強めたクールな配色です。'
                                        : 'やわらかく見やすい標準配色です。'}
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
                        </SurfaceButton>
                    );
                })}
            </View>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            flex: 1,
            gap: 16,
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
            borderRadius: 24,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderColor: theme.colors.borderSubtle,
        },
        optionCardSelected: {
            borderColor: theme.colors.navigationActive,
            backgroundColor: theme.colors.surfaceMuted,
        },
        optionCardContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
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

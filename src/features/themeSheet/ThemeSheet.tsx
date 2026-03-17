import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import AppIcon from '../../components/icon/AppIcon';
import PressSurface from '../../components/surface/PressSurface';
import SheetHeader from '../../components/layout/SheetHeader';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';

const themeModes = [
    {id: 'light', title: 'ライト', icon: 'sun'},
    {id: 'dark', title: 'ダーク', icon: 'moon'},
] as const;

const colorModes = [
    {
        id: 'default',
        title: 'デフォルト',
        description: 'やわらかく見やすい標準配色です。',
        preview: 'default',
    },
    {
        id: 'blue-2024',
        title: 'Blue 2024',
        description: 'コントラストを強めたクールな配色です。',
        preview: 'blue',
    },
] as const;

function ThemeSheet() {
    const {
        theme,
        selectedMode,
        resolvedMode,
        selectedThemeId,
        setSelectedMode,
        setSelectedThemeId,
    } = useTheme();
    const {dismissSheet} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const useSystemMode = selectedMode === 'system';

    return (
        <View style={styles.container}>
            <SheetHeader onRightPress={dismissSheet} rightAction="close" title="テーマ" />

            <Text style={styles.body}>
                アプリ全体の見た目を選べます。テーマモードで明るさを決めて、その下でカラーモードを選択します。
            </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>テーマモード</Text>
                <View style={styles.modePanel}>
                    <View style={styles.modeGrid}>
                        {themeModes.map(item => {
                            const isSelected = resolvedMode === item.id;

                            return (
                                <PressSurface
                                    key={item.id}
                                    accessibilityLabel={item.title}
                                    chrome="solid"
                                    onPress={() => setSelectedMode(item.id)}
                                    style={[styles.modeCard, isSelected ? styles.modeCardSelected : null]}
                                    contentStyle={styles.modeCardContent}>
                                    <View
                                        style={[
                                            styles.modePreview,
                                            item.id === 'dark' ? styles.modePreviewDark : styles.modePreviewLight,
                                        ]}>
                                        <View style={styles.modePreviewHeader} />
                                        <View style={[styles.modePreviewLine, styles.modePreviewLineWide]} />
                                        <View style={styles.modePreviewLine} />
                                    </View>

                                    <View style={styles.modeTitleRow}>
                                        <AppIcon
                                            color={isSelected ? theme.colors.navigationActive : theme.colors.textSecondary}
                                            icon={{kind: 'font-awesome', name: item.icon}}
                                            size={16}
                                        />
                                        <Text style={styles.modeTitle}>{item.title}</Text>
                                    </View>

                                    <View style={isSelected ? styles.modeDotSelected : styles.modeDot} />
                                </PressSurface>
                            );
                        })}
                    </View>

                    <View style={styles.autoRow}>
                        <Text style={styles.autoLabel}>自動</Text>
                        <Switch
                            value={useSystemMode}
                            onValueChange={value => setSelectedMode(value ? 'system' : resolvedMode)}
                            trackColor={{
                                false: theme.colors.surfaceMuted,
                                true: theme.colors.buttonPrimary,
                            }}
                            thumbColor={theme.colors.buttonPrimaryText}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>カラーモード</Text>
                <View style={styles.optionGrid}>
                    {colorModes.map(item => {
                        const isSelected = item.id === selectedThemeId;
                        const isBlue = item.preview === 'blue';

                        return (
                            <PressSurface
                                key={item.id}
                                accessibilityLabel={item.title}
                                chrome="solid"
                                onPress={() => setSelectedThemeId(item.id)}
                                style={[styles.optionCard, isSelected ? styles.optionCardSelected : null]}
                                contentStyle={styles.optionCardContent}>
                                <View style={styles.optionPreview}>
                                    <View
                                        style={[
                                            styles.previewBase,
                                            isBlue ? styles.previewBlue : styles.previewDefault,
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.previewAccent,
                                            isBlue ? styles.previewAccentBlue : styles.previewAccentDefault,
                                        ]}
                                    />
                                </View>

                                <Text style={styles.optionTitle}>{item.title}</Text>
                                <Text style={styles.optionBody}>{item.description}</Text>

                                {isSelected ? (
                                    <View style={styles.selectedBadge}>
                                        <FontAwesome5
                                            color={theme.colors.buttonPrimaryText}
                                            iconStyle="solid"
                                            name="check"
                                            size={12}
                                        />
                                    </View>
                                ) : (
                                    <View style={styles.optionDot} />
                                )}
                            </PressSurface>
                        );
                    })}
                </View>
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
        section: {
            gap: 12,
        },
        sectionTitle: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        modePanel: {
            gap: 12,
            borderRadius: 24,
            padding: 14,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        modeGrid: {
            flexDirection: 'row',
            gap: 12,
        },
        modeCard: {
            flex: 1,
            borderRadius: 18,
            padding: 12,
            backgroundColor: theme.colors.surfaceMuted,
            borderColor: 'transparent',
        },
        modeCardSelected: {
            borderColor: theme.colors.navigationActive,
            backgroundColor: theme.colors.surfaceAccent,
        },
        modeCardContent: {
            alignItems: 'center',
            gap: 10,
        },
        modePreview: {
            width: '100%',
            height: 78,
            borderRadius: 14,
            padding: 8,
            gap: 6,
        },
        modePreviewLight: {
            backgroundColor: '#F4F6FA',
        },
        modePreviewDark: {
            backgroundColor: '#241C33',
        },
        modePreviewHeader: {
            width: '68%',
            height: 14,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.22)',
        },
        modePreviewLine: {
            width: '54%',
            height: 10,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.18)',
        },
        modePreviewLineWide: {
            width: '86%',
        },
        modeTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        modeTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '700',
        },
        modeDot: {
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: theme.colors.borderStrong,
            backgroundColor: 'transparent',
        },
        modeDotSelected: {
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: theme.colors.navigationActive,
            backgroundColor: theme.colors.navigationActive,
        },
        autoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: theme.colors.borderSubtle,
            paddingTop: 12,
        },
        autoLabel: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '700',
        },
        optionGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
        },
        optionCard: {
            width: '48%',
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
            alignItems: 'center',
            gap: 12,
        },
        optionPreview: {
            width: '100%',
            height: 74,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 18,
            backgroundColor: theme.colors.surfaceMuted,
        },
        previewBase: {
            width: 32,
            height: 32,
            borderRadius: 16,
        },
        previewDefault: {
            backgroundColor: '#D9DEE7',
        },
        previewBlue: {
            backgroundColor: '#355CFF',
        },
        previewAccent: {
            position: 'absolute',
            right: 18,
            bottom: 16,
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
        optionTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '700',
            textAlign: 'center',
        },
        optionBody: {
            color: theme.colors.textSecondary,
            fontSize: 13,
            lineHeight: 20,
            textAlign: 'center',
        },
        selectedBadge: {
            width: 26,
            height: 26,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 13,
            backgroundColor: theme.colors.buttonPrimary,
        },
        optionDot: {
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: theme.colors.borderStrong,
            backgroundColor: 'transparent',
        },
    });
}

export default ThemeSheet;

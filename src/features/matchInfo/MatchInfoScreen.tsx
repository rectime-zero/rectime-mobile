import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import AccessoryButton from '../../components/AccessoryButton';
import PageLayout from '../../components/layout/PageLayout';
import {type AppRoute} from '../../navigation/types';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';

type MatchInfoScreenProps = {
    route: AppRoute<'match-info'>;
};

const recentResults = [
    {label: '第1試合', rival: 'IH22', score: '78 - 64', tone: 'success' as const},
    {label: '第2試合', rival: 'IS41', score: '71 - 73', tone: 'danger' as const},
    {label: '第3試合', rival: 'IK11', score: '82 - 69', tone: 'success' as const},
];

function MatchInfoScreen({route}: MatchInfoScreenProps) {
    const {theme} = useTheme();
    const {closeMenuPage, pop} = useNavigation();
    const handleBack = route.presentation === 'menu-page' ? closeMenuPage : pop;
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<AccessoryButton accessibilityLabel="戻る" icon="chevron-left" onPress={handleBack} />}
            title="対戦情報">
            <View style={styles.heroCard}>
                <View>
                    <Text style={styles.teamLabel}>{route.params.teamName}</Text>
                    <Text style={styles.summary}>{route.params.summary}</Text>
                </View>
                <View style={styles.heroIcon}>
                    <FontAwesome5 color={theme.colors.navigationActive} iconStyle="solid" name="clipboard-check" size={20} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>直近の試合</Text>
                <View style={styles.resultList}>
                    {recentResults.map(item => (
                        <View key={`${item.label}-${item.rival}`} style={styles.resultCard}>
                            <View>
                                <Text style={styles.resultLabel}>{item.label}</Text>
                                <Text style={styles.resultRival}>vs {item.rival}</Text>
                            </View>
                            <Text style={item.tone === 'success' ? styles.resultScoreSuccess : styles.resultScoreDanger}>
                                {item.score}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        heroCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            borderRadius: 24,
            padding: 20,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        teamLabel: {
            color: theme.colors.textPrimary,
            fontSize: 24,
            fontWeight: '900',
        },
        summary: {
            marginTop: 8,
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
        },
        heroIcon: {
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 28,
            backgroundColor: theme.colors.surfaceAccent,
        },
        section: {
            gap: 12,
        },
        sectionTitle: {
            color: theme.colors.textPrimary,
            fontSize: 20,
            fontWeight: '800',
        },
        resultList: {
            gap: 12,
        },
        resultCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            borderRadius: 20,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        resultLabel: {
            color: theme.colors.textSecondary,
            fontSize: 13,
            fontWeight: '700',
        },
        resultRival: {
            marginTop: 4,
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        resultScoreSuccess: {
            color: theme.colors.textSuccess,
            fontSize: 18,
            fontWeight: '900',
        },
        resultScoreDanger: {
            color: theme.colors.textDanger,
            fontSize: 18,
            fontWeight: '900',
        },
    });
}

export default MatchInfoScreen;

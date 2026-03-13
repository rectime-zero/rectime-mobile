import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import HeaderIconButton from '../../components/HeaderIconButton';
import PageLayout from '../../components/PageLayout';
import {sheetRoutes} from '../../config/navigationRoutes';
import {type AppRoute} from '../../navigation/types';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';
import {recentMatches} from './data';

type DetailScreenProps = {
    route: AppRoute<'detail'>;
};

function DetailScreen({route}: DetailScreenProps) {
    const {theme} = useTheme();
    const {pop, presentSheetRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<HeaderIconButton icon="chevron-left" label="戻る" onPress={pop} />}
            headerTrailing={<HeaderIconButton icon="ellipsis-h" label="その他" onPress={() => presentSheetRoute(sheetRoutes.notifications)} />}
            title={route.params.title}>
            <View style={styles.scoreCard}>
                <View>
                    <Text style={styles.scoreLabel}>現在の総合得点</Text>
                    <Text style={styles.scoreValue}>
                        450 <Text style={styles.scoreUnit}>pts</Text>
                    </Text>
                </View>
                <View style={styles.scoreIcon}>
                    <FontAwesome5 color={theme.colors.navigationActive} iconStyle="solid" name="trophy" size={22} />
                </View>
            </View>

            <Text style={styles.sectionTitle}>対戦結果（直近5試合）</Text>

            {recentMatches.map(match => (
                <Pressable key={`${match.title}-${match.rival}`} style={styles.matchCard}>
                    <View style={styles.matchTopRow}>
                        <Text style={styles.matchTag}>{match.title}</Text>
                        <View
                            style={[
                                styles.resultPill,
                                match.tone === 'success' ? styles.resultPillSuccess : styles.resultPillDanger,
                            ]}>
                            <Text
                                style={[
                                    styles.resultPillText,
                                    match.tone === 'success' ? styles.resultPillTextSuccess : styles.resultPillTextDanger,
                                ]}>
                                {match.result}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.matchBottomRow}>
                        <Text style={styles.matchNames}>
                            IA31 <Text style={styles.matchVs}>vs</Text> {match.rival}
                        </Text>
                        <Text
                            style={[
                                styles.matchDelta,
                                match.tone === 'success' ? styles.matchDeltaSuccess : styles.matchDeltaDanger,
                            ]}>
                            {match.delta}
                        </Text>
                    </View>
                </Pressable>
            ))}
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        scoreCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 24,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            paddingHorizontal: 20,
            paddingVertical: 22,
        },
        scoreLabel: {
            color: theme.colors.textSecondary,
            fontSize: 16,
            fontWeight: '700',
        },
        scoreValue: {
            marginTop: 8,
            color: theme.colors.textPrimary,
            fontSize: 44,
            fontWeight: '900',
        },
        scoreUnit: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.textMuted,
        },
        scoreIcon: {
            width: 72,
            height: 72,
            borderRadius: 36,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surfaceAccent,
        },
        sectionTitle: {
            color: theme.colors.textSecondary,
            fontSize: 18,
            fontWeight: '800',
        },
        matchCard: {
            borderRadius: 22,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            padding: 16,
            gap: 16,
        },
        matchTopRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        matchTag: {
            alignSelf: 'flex-start',
            borderRadius: 10,
            overflow: 'hidden',
            color: theme.colors.textSecondary,
            fontSize: 14,
            fontWeight: '700',
            backgroundColor: theme.colors.surfaceMuted,
            paddingHorizontal: 10,
            paddingVertical: 8,
        },
        resultPill: {
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 8,
        },
        resultPillSuccess: {
            backgroundColor: theme.colors.surfaceSuccess,
        },
        resultPillDanger: {
            backgroundColor: theme.colors.surfaceDanger,
        },
        resultPillText: {
            fontSize: 14,
            fontWeight: '800',
        },
        resultPillTextSuccess: {
            color: theme.colors.textSuccess,
        },
        resultPillTextDanger: {
            color: theme.colors.textDanger,
        },
        matchBottomRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
        },
        matchNames: {
            color: theme.colors.textPrimary,
            fontSize: 20,
            fontWeight: '900',
        },
        matchVs: {
            color: theme.colors.textMuted,
            fontSize: 16,
        },
        matchDelta: {
            fontSize: 18,
            fontWeight: '800',
        },
        matchDeltaSuccess: {
            color: theme.colors.textSuccess,
        },
        matchDeltaDanger: {
            color: theme.colors.textDanger,
        },
    });
}

export default DetailScreen;

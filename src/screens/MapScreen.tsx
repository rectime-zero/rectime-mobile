import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import PageLayout from '../components/PageLayout';
import {useStage} from '../stage/useStage';
import {useTheme} from '../theme';

function MapScreen() {
    const {theme} = useTheme();
    const {openMenu} = useStage();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            eyebrow="Venue"
            title="マップ"
            description="会場内の主要エリアをざっくり把握するためのページです。移動前の確認に向いています。"
            headerSlot={
                <ActionButton
                    label="メニュー"
                    onPress={openMenu}
                    tone="secondary"
                    size="compact"
                />
            }>
            <View style={styles.mapCard}>
                <View style={styles.mapTop}>
                    <View style={[styles.zone, styles.zoneWide]}>
                        <Text style={styles.zoneTitle}>センターコート</Text>
                    </View>
                    <View style={styles.zone}>
                        <Text style={styles.zoneTitle}>受付</Text>
                    </View>
                </View>
                <View style={styles.mapBottom}>
                    <View style={styles.zone}>
                        <Text style={styles.zoneTitle}>フード</Text>
                    </View>
                    <View style={styles.zone}>
                        <Text style={styles.zoneTitle}>休憩</Text>
                    </View>
                    <View style={styles.zone}>
                        <Text style={styles.zoneTitle}>物販</Text>
                    </View>
                </View>
            </View>

            <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>移動メモ</Text>
                <Text style={styles.tipBody}>
                    センターコート周辺は試合前後に混みやすいので、フードエリアへはサブ通路側から回るとスムーズです。
                </Text>
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
    mapCard: {
        backgroundColor: theme.colors.surfaceInverse,
        borderRadius: 28,
        padding: 16,
        gap: 12,
    },
    mapTop: {
        flexDirection: 'row',
        gap: 12,
    },
    mapBottom: {
        flexDirection: 'row',
        gap: 12,
    },
    zone: {
        flex: 1,
        minHeight: 92,
        borderRadius: 20,
        backgroundColor: theme.colors.mapZone,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    zoneWide: {
        flex: 2,
        backgroundColor: theme.colors.mapZoneStrong,
    },
    zoneTitle: {
        color: theme.colors.mapZoneText,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    tipCard: {
        backgroundColor: theme.colors.surfacePrimary,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        padding: 18,
        gap: 8,
    },
    tipTitle: {
        color: theme.colors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
    },
    tipBody: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        lineHeight: 21,
    },
    });
}

export default MapScreen;

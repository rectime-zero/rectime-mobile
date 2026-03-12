import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import PageLayout from '../components/PageLayout';
import {useStage} from '../stage/useStage';

function MapScreen() {
    const {openMenu} = useStage();

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

const styles = StyleSheet.create({
    mapCard: {
        backgroundColor: '#0F172A',
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
        backgroundColor: '#1E293B',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    zoneWide: {
        flex: 2,
        backgroundColor: '#1D4ED8',
    },
    zoneTitle: {
        color: '#F8FAFC',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    tipCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 18,
        gap: 8,
    },
    tipTitle: {
        color: '#0F172A',
        fontSize: 18,
        fontWeight: '700',
    },
    tipBody: {
        color: '#475569',
        fontSize: 14,
        lineHeight: 21,
    },
});

export default MapScreen;

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SheetHeader from '../../components/layout/sheet/SheetHeader';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';
import {TicketQrCode} from './components/TicketQrCode';
import {useTicketQr} from './hooks/useTicketQr';

const MOCK_USER = {
    name: 'HAL 太郎',
    ticketLabel: '一般入場',
    userId: 'IA12B-12345',
};

export function TicketQrSheet() {
    const {theme} = useTheme();
    const {dismissSheet} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const {qrValue, remainingSeconds, isLoading, isError, reload} = useTicketQr(MOCK_USER.userId);

    return (
        <View style={styles.container}>
            <SheetHeader onRightPress={dismissSheet} rightAction="close" title="マイQR" />

            <View style={styles.heroCard}>
                <View style={styles.heroTextBlock}>
                    <Text style={styles.heroEyebrow}>Entrance Pass</Text>
                    <Text style={styles.heroTitle}>{MOCK_USER.name}</Text>
                    <Text style={styles.heroMeta}>{MOCK_USER.ticketLabel}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>DEMO</Text>
                </View>
            </View>

            <View style={styles.qrCard}>
                <TicketQrCode
                    qrValue={qrValue}
                    remainingSeconds={remainingSeconds}
                    isLoading={isLoading}
                    isError={isError}
                    onRetry={reload}
                />
            </View>

            <Text style={styles.footnote}>
                現在は雛形実装です。認証連携後にユーザー情報と本番 QR 生成へ差し替えます。
            </Text>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            gap: 16,
        },
        heroCard: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            borderRadius: 26,
            padding: 18,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        heroTextBlock: {
            flex: 1,
            gap: 6,
        },
        heroEyebrow: {
            color: theme.colors.navigationActive,
            fontSize: 12,
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
        },
        heroTitle: {
            color: theme.colors.textPrimary,
            fontSize: 24,
            fontWeight: '800',
        },
        heroMeta: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            fontWeight: '700',
        },
        badge: {
            borderRadius: 999,
            backgroundColor: theme.colors.surfaceAccent,
            paddingHorizontal: 10,
            paddingVertical: 6,
        },
        badgeText: {
            color: theme.colors.navigationActive,
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.7,
        },
        qrCard: {
            gap: 16,
            borderRadius: 28,
            padding: 20,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        footnote: {
            color: theme.colors.textMuted,
            fontSize: 12,
            lineHeight: 18,
            textAlign: 'center',
        },
    });
}

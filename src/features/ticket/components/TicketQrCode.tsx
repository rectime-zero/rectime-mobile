import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import CommandButton from '../../../components/button/CommandButton';
import {useTheme} from '../../../theme';

type TicketQrCodeProps = {
    qrValue: string | null;
    remainingSeconds: number;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
};

export function TicketQrCode({qrValue, remainingSeconds, isLoading, isError, onRetry}: TicketQrCodeProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const progress = remainingSeconds / 30;

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingBlock} />
                <Text style={styles.helperText}>QR を準備しています…</Text>
            </View>
        );
    }

    if (isError || !qrValue) {
        return (
            <View style={styles.container}>
                <View style={styles.errorCard}>
                    <Text style={styles.errorTitle}>チケット情報を取得できませんでした</Text>
                    <Text style={styles.helperText}>通信状態を確認して、もう一度お試しください。</Text>
                </View>
                <CommandButton label="再読み込み" onPress={onRetry} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.qrFrame}>
                <QRCode
                    value={qrValue}
                    size={210}
                    color="#111111"
                    backgroundColor="#ffffff"
                    quietZone={10}
                />
            </View>

            <View style={styles.progressBlock}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, {width: `${Math.max(progress, 0.06) * 100}%`}]} />
                </View>
                <View style={styles.progressMetaRow}>
                    <Text style={styles.progressLabel}>更新まで</Text>
                    <Text style={styles.progressValue}>{remainingSeconds}s</Text>
                </View>
            </View>

            <Text numberOfLines={1} style={styles.codeValue}>
                {qrValue}
            </Text>
        </View>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        container: {
            gap: 16,
            alignItems: 'center',
        },
        qrFrame: {
            borderRadius: 28,
            padding: 16,
            backgroundColor: '#ffffff',
        },
        progressBlock: {
            width: '100%',
            gap: 8,
        },
        progressTrack: {
            height: 10,
            overflow: 'hidden',
            borderRadius: 999,
            backgroundColor: theme.colors.surfaceMuted,
        },
        progressFill: {
            height: '100%',
            borderRadius: 999,
            backgroundColor: theme.colors.navigationActive,
        },
        progressMetaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        progressLabel: {
            color: theme.colors.textMuted,
            fontSize: 12,
            fontWeight: '700',
        },
        progressValue: {
            color: theme.colors.textPrimary,
            fontSize: 14,
            fontWeight: '800',
        },
        codeValue: {
            width: '100%',
            color: theme.colors.textSecondary,
            fontSize: 12,
            fontWeight: '600',
            textAlign: 'center',
        },
        helperText: {
            color: theme.colors.textSecondary,
            fontSize: 13,
            lineHeight: 20,
            textAlign: 'center',
        },
        loadingBlock: {
            width: 242,
            height: 242,
            borderRadius: 28,
            backgroundColor: theme.colors.surfaceMuted,
        },
        errorCard: {
            gap: 8,
            alignItems: 'center',
            borderRadius: 22,
            padding: 18,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        errorTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '800',
            textAlign: 'center',
        },
    });
}

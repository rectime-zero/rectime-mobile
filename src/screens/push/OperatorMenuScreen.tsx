import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CommandButton from '../../components/button/CommandButton';
import PushScreenLayout from '../../components/layout/screen/PushScreenLayout';
import {pushRoutes} from '../../config/navigationRoutes';
import {useNavigation} from '../../navigation/useNavigation';
import {type AppRoute} from '../../navigation/types';
import {useTheme} from '../../theme';
import {getOptionalVisionCameraRuntime} from '../../infrastructure/native/optionalVisionCamera';

type OperatorMenuScreenProps = {
    route: AppRoute<'operator-menu'>;
};

function OperatorMenuScreen({route}: OperatorMenuScreenProps) {
    const {theme} = useTheme();
    const {pushRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);
    const visionCameraRuntime = React.useMemo(() => getOptionalVisionCameraRuntime(), []);

    return (
        <PushScreenLayout route={route}>
            <View style={styles.heroCard}>
                <Text style={styles.heroEyebrow}>Operations</Text>
                <Text style={styles.heroTitle}>会場運営向けの操作をここに集約します。</Text>
                <Text style={styles.heroBody}>
                    QR 認証、来場チェック、将来の運営専用機能をこの画面から起動する前提の土台です。
                </Text>
            </View>

            {!visionCameraRuntime.isAvailable ? (
                <View style={styles.noticeCard}>
                    <Text style={styles.noticeTitle}>カメラ機能は未初期化です</Text>
                    <Text style={styles.noticeBody}>
                        VisionCamera のネイティブモジュールが未反映です。iOS の場合は `pod install` 後に再ビルドしてください。
                    </Text>
                </View>
            ) : null}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>認証業務</Text>
                <View style={styles.actionCard}>
                    <View style={styles.actionTextBlock}>
                        <Text style={styles.actionTitle}>QR認証スタート</Text>
                        <Text style={styles.actionDescription}>
                            来場者の QR を読み取り、入場判定へ進みます。現時点ではモック判定まで接続しています。
                        </Text>
                    </View>
                    <CommandButton label="開始する" onPress={() => pushRoute(pushRoutes.gateScan())} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>今後追加する機能</Text>
                <View style={styles.todoCard}>
                    <Text style={styles.todoItem}>来場記録一覧</Text>
                    <Text style={styles.todoItem}>未同期キュー確認</Text>
                    <Text style={styles.todoItem}>運営スタッフ向け設定</Text>
                </View>
            </View>
        </PushScreenLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        heroCard: {
            gap: 10,
            borderRadius: 28,
            padding: 22,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        heroEyebrow: {
            color: theme.colors.navigationActive,
            fontSize: 12,
            fontWeight: '800',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
        },
        heroTitle: {
            color: theme.colors.textPrimary,
            fontSize: 24,
            lineHeight: 30,
            fontWeight: '800',
        },
        heroBody: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
        },
        noticeCard: {
            gap: 8,
            borderRadius: 24,
            padding: 18,
            backgroundColor: '#fef3c7',
        },
        noticeTitle: {
            color: '#92400e',
            fontSize: 15,
            fontWeight: '800',
        },
        noticeBody: {
            color: '#92400e',
            fontSize: 13,
            lineHeight: 20,
        },
        section: {
            gap: 12,
        },
        sectionTitle: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        actionCard: {
            gap: 16,
            borderRadius: 24,
            padding: 18,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        actionTextBlock: {
            gap: 8,
        },
        actionTitle: {
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
        },
        actionDescription: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 21,
        },
        todoCard: {
            gap: 10,
            borderRadius: 24,
            padding: 18,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        todoItem: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 20,
            fontWeight: '700',
        },
    });
}

export default OperatorMenuScreen;

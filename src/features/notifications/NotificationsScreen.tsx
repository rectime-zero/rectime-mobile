import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AccessoryButton from '../../components/button/AccessoryButton';
import PushScreenLayout from '../../components/layout/screen/PushScreenLayout';
import {type AppRoute} from '../../navigation/types';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';

type NotificationsScreenProps = {
    route: AppRoute<'notifications'>;
};

const notificationItems = [
    {
        title: '100m走 決勝がまもなく開始',
        body: 'メインコート周辺は混雑が予想されます。移動に余裕を持ってください。',
        time: '5分前',
    },
    {
        title: 'ランキング更新',
        body: 'IA31 が総合 2 位に浮上しました。最新順位を確認できます。',
        time: '15分前',
    },
    {
        title: '雨天時アナウンス',
        body: '午後の一部プログラムは体育館へ移動予定です。詳細は会場放送を確認してください。',
        time: '30分前',
    },
];

function NotificationsScreen({route: _route}: NotificationsScreenProps) {
    const {theme} = useTheme();
    const {pop} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PushScreenLayout
            headerLeading={<AccessoryButton accessibilityLabel="戻る" icon="chevron-left" onPress={pop} />}
            title="通知">
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>新着</Text>
                <Text style={styles.sectionBody}>試合開始や順位更新、当日の案内をまとめて確認できます。</Text>
            </View>

            <View style={styles.list}>
                {notificationItems.map(item => (
                    <View key={`${item.title}-${item.time}`} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardTime}>{item.time}</Text>
                        </View>
                        <Text style={styles.cardBody}>{item.body}</Text>
                    </View>
                ))}
            </View>
        </PushScreenLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        section: {
            gap: 8,
        },
        sectionTitle: {
            color: theme.colors.textPrimary,
            fontSize: 22,
            fontWeight: '800',
        },
        sectionBody: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
        },
        list: {
            gap: 12,
        },
        card: {
            gap: 10,
            borderRadius: 22,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
        },
        cardTitle: {
            flex: 1,
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '800',
        },
        cardTime: {
            color: theme.colors.textMuted,
            fontSize: 12,
            fontWeight: '700',
        },
        cardBody: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
        },
    });
}

export default NotificationsScreen;

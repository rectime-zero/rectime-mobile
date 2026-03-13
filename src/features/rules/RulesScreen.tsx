import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import HeaderIconButton from '../../components/HeaderIconButton';
import MenuAvatarButton from '../../components/MenuAvatarButton';
import PageLayout from '../../components/PageLayout';
import {type AppIconName} from '../../components/iconNames';
import {sheetRoutes} from '../../config/navigationRoutes';
import {useNavigation} from '../../presentation/useNavigation';
import {useTheme} from '../../theme';

const rules = [
    {icon: 'clock' as AppIconName, title: '集合時間', body: '競技開始の5分前までに指定エリアへ集合してください。'},
    {icon: 'camera' as AppIconName, title: '撮影ルール', body: '会場内の撮影は可能ですが、フラッシュの使用は禁止です。'},
    {icon: 'clipboard-check' as AppIconName, title: 'ランキング反映', body: 'ランキング対象試合はスタッフ確認後に記録が反映されます。'},
    {icon: 'users' as AppIconName, title: '混雑対応', body: '混雑時は一部エリアで入場規制がかかる場合があります。'},
];

function RulesScreen() {
    const {theme} = useTheme();
    const {openMenu, presentSheetRoute} = useNavigation();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<MenuAvatarButton onPress={openMenu} />}
            headerTrailing={<HeaderIconButton icon="bell" label="通知" onPress={() => presentSheetRoute(sheetRoutes.notifications)} />}
            title="ルール">
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>当日の基本ガイド</Text>
                <Text style={styles.heroBody}>参加者が迷わず動けるよう、重要なルールだけを先にまとめています。</Text>
            </View>

            {rules.map(rule => (
                <View key={rule.title} style={styles.ruleCard}>
                    <View style={styles.iconBadge}>
                        <FontAwesome5 color={theme.colors.navigationActive} iconStyle="solid" name={rule.icon} size={16} />
                    </View>
                    <View style={styles.ruleContent}>
                        <Text style={styles.ruleTitle}>{rule.title}</Text>
                        <Text style={styles.ruleBody}>{rule.body}</Text>
                    </View>
                </View>
            ))}
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        hero: {
            borderRadius: 24,
            backgroundColor: theme.colors.surfaceMuted,
            padding: 18,
            gap: 8,
        },
        heroTitle: {
            color: theme.colors.textPrimary,
            fontSize: 22,
            fontWeight: '800',
        },
        heroBody: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 21,
        },
        ruleCard: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 14,
            borderRadius: 22,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            padding: 16,
        },
        iconBadge: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surfaceAccent,
        },
        ruleContent: {
            flex: 1,
            gap: 6,
        },
        ruleTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '800',
        },
        ruleBody: {
            color: theme.colors.textSecondary,
            fontSize: 14,
            lineHeight: 22,
        },
    });
}

export default RulesScreen;

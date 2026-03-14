import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import HeaderIconButton from '../../components/HeaderIconButton';
import PageLayout from '../../components/layout/PageLayout';
import {type AppRoute} from '../../navigation/types';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';

type SettingsScreenProps = {
    route: AppRoute<'settings'>;
};

function SettingsScreen({route}: SettingsScreenProps) {
    const {theme} = useTheme();
    const {closeMenuPage, pop} = useNavigation();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [hapticsEnabled, setHapticsEnabled] = React.useState(true);
    const handleBack = route.presentation === 'menu-page' ? closeMenuPage : pop;
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PageLayout
            headerLeading={<HeaderIconButton icon="chevron-left" label="戻る" onPress={handleBack} />}
            title="設定">
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>アプリ設定</Text>
                <Text style={styles.sectionBody}>通知や操作時のフィードバックをここで切り替えられます。</Text>

                <View style={styles.settingList}>
                    <View style={styles.settingCard}>
                        <View style={styles.settingCopy}>
                            <Text style={styles.settingTitle}>通知</Text>
                            <Text style={styles.settingBody}>試合開始や更新情報の通知を受け取ります。</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{
                                false: theme.colors.surfaceMuted,
                                true: theme.colors.buttonPrimary,
                            }}
                            thumbColor={theme.colors.buttonPrimaryText}
                        />
                    </View>

                    <View style={styles.settingCard}>
                        <View style={styles.settingCopy}>
                            <Text style={styles.settingTitle}>触覚フィードバック</Text>
                            <Text style={styles.settingBody}>操作時に軽い振動で反応を返します。</Text>
                        </View>
                        <Switch
                            value={hapticsEnabled}
                            onValueChange={setHapticsEnabled}
                            trackColor={{
                                false: theme.colors.surfaceMuted,
                                true: theme.colors.buttonPrimary,
                            }}
                            thumbColor={theme.colors.buttonPrimaryText}
                        />
                    </View>
                </View>
            </View>
        </PageLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        section: {
            gap: 14,
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
        settingList: {
            gap: 12,
        },
        settingCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            borderRadius: 22,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        settingCopy: {
            flex: 1,
        },
        settingTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '700',
        },
        settingBody: {
            marginTop: 4,
            color: theme.colors.textSecondary,
            fontSize: 13,
            lineHeight: 20,
        },
    });
}

export default SettingsScreen;

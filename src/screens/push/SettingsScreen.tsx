import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import PushScreenLayout from '../../components/layout/screen/PushScreenLayout';
import {useFeedback} from '../../feedback';
import SettingsSection from '../../features/settings/components/SettingsSection';
import SettingsToggleRow from '../../features/settings/components/SettingsToggleRow';
import {type AppRoute} from '../../navigation/types';

type SettingsScreenProps = {
    route: AppRoute<'settings'>;
};

function SettingsScreen({route}: SettingsScreenProps) {
    const {hapticsEnabled, setHapticsEnabled, triggerHaptic} = useFeedback();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const styles = React.useMemo(() => createStyles(), []);

    const handleHapticsValueChange = React.useCallback(
        (enabled: boolean) => {
            setHapticsEnabled(enabled);

            if (enabled) {
                triggerHaptic('selection');
            }
        },
        [setHapticsEnabled, triggerHaptic],
    );

    return (
        <PushScreenLayout route={route}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}>
                <View style={styles.sections}>
                    <SettingsSection title="アプリ設定">
                        <SettingsToggleRow
                            icon="bell"
                            title="通知"
                            description="試合開始や更新情報の通知を受け取ります。"
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                        />
                        <SettingsToggleRow
                            icon="cog"
                            title="触覚フィードバック"
                            description="操作時に軽い振動で反応を返します。"
                            value={hapticsEnabled}
                            onValueChange={handleHapticsValueChange}
                            isLast
                        />
                    </SettingsSection>
                </View>
            </ScrollView>
        </PushScreenLayout>
    );
}

function createStyles() {
    return StyleSheet.create({
        content: {
            paddingBottom: 20,
        },
        sections: {
            gap: 16,
        },
    });
}

export default SettingsScreen;

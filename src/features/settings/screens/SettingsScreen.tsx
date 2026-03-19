import React from 'react';
import {StyleSheet, View} from 'react-native';
import PushScreenLayout from '../../../components/layout/screen/PushScreenLayout';
import {useFeedback} from '../../../feedback';
import {type AppRoute} from '../../../navigation/types';
import SettingsSection from '../components/SettingsSection';
import SettingsToggleRow from '../components/SettingsToggleRow';

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
        <PushScreenLayout route={route} contentContainerStyle={styles.content}>
            <View style={styles.sections}>
                <SettingsSection title="アプリ設定">
                    <SettingsToggleRow
                        icon="bell"
                        title="通知"
                        description="試合開始や更新情報の通知を受け取ります。"
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        accent
                    />
                    <SettingsToggleRow
                        icon="bullseye"
                        title="触覚フィードバック"
                        description="操作時に軽い振動で反応を返します。"
                        value={hapticsEnabled}
                        onValueChange={handleHapticsValueChange}
                        isLast
                    />
                </SettingsSection>
            </View>
        </PushScreenLayout>
    );
}

function createStyles() {
    return StyleSheet.create({
        content: {
            paddingBottom: 20,
        },
        sections: {
            gap: 0,
        },
    });
}

export default SettingsScreen;

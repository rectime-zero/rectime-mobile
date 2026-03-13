import React from 'react';
import {Text, View} from 'react-native';
import ActionButton from '../../components/ActionButton';
import {useNavigation} from '../../navigation/useNavigation';
import {useTheme} from '../../theme';

function SampleBottomSheet() {
    const {theme} = useTheme();
    const {dismissSheet} = useNavigation();

    return (
        <View className="gap-4">
            <Text style={{color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.1}}>
                Bottom Sheet
            </Text>
            <Text style={{color: theme.colors.textPrimary, fontSize: 24, fontWeight: '800'}}>
                下から出るカード状の UI
            </Text>
            <Text style={{color: theme.colors.textSecondary, fontSize: 14, lineHeight: 24}}>
                drag dismiss に対応した最小サンプルです。タップでも閉じられ、gesture
                の所有権は stage 側で一元管理します。
            </Text>

            <View className="gap-3 rounded-[24px] p-4" style={{backgroundColor: theme.colors.surfaceMuted}}>
                <Text style={{color: theme.colors.textPrimary, fontSize: 16, fontWeight: '700'}}>使い道</Text>
                <Text style={{color: theme.colors.textSecondary, fontSize: 14, lineHeight: 24}}>
                    popup menu、確認 UI、フィルター、軽量フォームなどを同じ presentation で増やせます。
                </Text>
            </View>

            <ActionButton label="閉じる" onPress={dismissSheet} />
        </View>
    );
}

export default SampleBottomSheet;

import React from 'react';
import {Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import {useStage} from '../stage/useStage';

function SampleBottomSheet() {
    const {dismissSheet} = useStage();

    return (
        <View className="gap-4">
            <Text className="text-xs font-bold uppercase tracking-[1.1px] text-slate-500">
                Bottom Sheet
            </Text>
            <Text className="text-2xl font-extrabold text-slate-950">
                下から出るカード状の UI
            </Text>
            <Text className="text-sm leading-6 text-slate-600">
                drag dismiss に対応した最小サンプルです。タップでも閉じられ、gesture
                の所有権は stage 側で一元管理します。
            </Text>

            <View className="gap-3 rounded-[24px] bg-slate-100 p-4">
                <Text className="text-base font-bold text-slate-900">使い道</Text>
                <Text className="text-sm leading-6 text-slate-600">
                    popup menu、確認 UI、フィルター、軽量フォームなどを同じ presentation で増やせます。
                </Text>
            </View>

            <ActionButton label="閉じる" onPress={dismissSheet} />
        </View>
    );
}

export default SampleBottomSheet;

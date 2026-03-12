import React from 'react';
import {Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import PageLayout from '../components/PageLayout';
import {type StageRoute} from '../stage/types';
import {useStage} from '../stage/useStage';

type DetailScreenProps = {
    route: StageRoute<'detail'>;
};

function DetailScreen({route}: DetailScreenProps) {
    const {pop, presentSheet} = useStage();

    return (
        <PageLayout
            eyebrow="Push Layer"
            title={route.params.title}
            description={route.params.summary}
            headerSlot={
                <View className="flex-row items-center justify-between gap-3">
                    <ActionButton label="戻る" onPress={pop} tone="secondary" size="compact" />
                    <Text className="text-xs font-bold uppercase tracking-[1.1px] text-slate-500">
                        Interactive Pop
                    </Text>
                </View>
            }>
            <View className="gap-4 rounded-[26px] bg-white p-5">
                <Text className="text-2xl font-extrabold text-slate-950">
                    右から重なって出る詳細ページ
                </Text>
                <Text className="text-sm leading-6 text-slate-600">
                    この画面は現在ページの上にカードとして積まれています。左端から右へドラッグすると、
                    途中で止められる interactive pop で戻れます。
                </Text>
                <ActionButton
                    label="この上からシートを出す"
                    onPress={() => presentSheet('sample-sheet', undefined)}
                />
            </View>

            <View className="gap-3 rounded-[26px] bg-slate-950 p-5">
                <Text className="text-lg font-bold text-white">拡張ポイント</Text>
                <Text className="text-sm leading-6 text-slate-300">
                    ここに feature ごとの detail content を差し替えても、push 表示や gesture
                    の責務は stage 側に残せます。
                </Text>
            </View>
        </PageLayout>
    );
}

export default DetailScreen;

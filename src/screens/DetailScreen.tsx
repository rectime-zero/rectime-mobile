import React from 'react';
import {Text, View} from 'react-native';
import ActionButton from '../components/ActionButton';
import PageLayout from '../components/PageLayout';
import {type StageRoute} from '../stage/types';
import {useStage} from '../stage/useStage';
import {useTheme} from '../theme';

type DetailScreenProps = {
    route: StageRoute<'detail'>;
};

function DetailScreen({route}: DetailScreenProps) {
    const {theme} = useTheme();
    const {pop, presentSheet} = useStage();

    return (
        <PageLayout
            eyebrow="Push Layer"
            title={route.params.title}
            description={route.params.summary}
            headerSlot={
                <View className="flex-row items-center justify-between gap-3">
                    <ActionButton label="戻る" onPress={pop} tone="secondary" size="compact" />
                    <Text style={{color: theme.colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.1}}>
                        Interactive Pop
                    </Text>
                </View>
            }>
            <View className="gap-4 rounded-[26px] p-5" style={{backgroundColor: theme.colors.surfacePrimary}}>
                <Text style={{color: theme.colors.textPrimary, fontSize: 24, fontWeight: '800'}}>
                    右から重なって出る詳細ページ
                </Text>
                <Text style={{color: theme.colors.textSecondary, fontSize: 14, lineHeight: 24}}>
                    この画面は現在ページの上にカードとして積まれています。左端から右へドラッグすると、
                    途中で止められる interactive pop で戻れます。
                </Text>
                <ActionButton
                    label="この上からシートを出す"
                    onPress={() => presentSheet('sample-sheet', undefined)}
                />
            </View>

            <View className="gap-3 rounded-[26px] p-5" style={{backgroundColor: theme.colors.surfaceInverse}}>
                <Text style={{color: theme.colors.textInverse, fontSize: 18, fontWeight: '700'}}>拡張ポイント</Text>
                <Text style={{color: theme.mode === 'dark' ? theme.colors.textSecondary : '#CBD5E1', fontSize: 14, lineHeight: 24}}>
                    ここに feature ごとの detail content を差し替えても、push 表示や gesture
                    の責務は stage 側に残せます。
                </Text>
            </View>
        </PageLayout>
    );
}

export default DetailScreen;

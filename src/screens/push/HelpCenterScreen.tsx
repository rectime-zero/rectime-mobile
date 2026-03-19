import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import PushScreenLayout from '../../components/layout/screen/PushScreenLayout';
import {type AppRoute} from '../../navigation/types';
import {useTheme} from '../../theme';

type HelpCenterScreenProps = {
    route: AppRoute<'help-center'>;
};

function HelpCenterScreen({route}: HelpCenterScreenProps) {
    const {theme} = useTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    return (
        <PushScreenLayout route={route}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ヘルプセンター</Text>
                    <Text style={styles.sectionBody}>アプリの使い方やよくある質問への回答をご確認ください。</Text>
                </View>

                <View style={styles.faqList}>
                    <View style={styles.faqCard}>
                        <Text style={styles.faqTitle}>アプリについて</Text>
                        <Text style={styles.faqBody}>
                            このアプリは、試合情報やスコア、ランキングをリアルタイムで確認できるアプリケーションです。対戦結果の確認や試合スケジュールの閲覧が可能です。
                        </Text>
                    </View>

                    <View style={styles.faqCard}>
                        <Text style={styles.faqTitle}>対戦情報の確認方法</Text>
                        <Text style={styles.faqBody}>
                            サイドメニューから「対戦情報」を選択すると、最新の対戦結果やスコア推移を確認できます。ボトムメニューの「ホーム」タブからも最新情報にアクセスできます。
                        </Text>
                    </View>

                    <View style={styles.faqCard}>
                        <Text style={styles.faqTitle}>通知の設定</Text>
                        <Text style={styles.faqBody}>
                            サイドメニューから「設定」を選択し、通知のオン・オフを切り替えることができます。重要な試合情報の通知を受け取ることで、見逃さずに最新情報をキャッチできます。
                        </Text>
                    </View>

                    <View style={styles.faqCard}>
                        <Text style={styles.faqTitle}>触覚フィードバック</Text>
                        <Text style={styles.faqBody}>
                            設定から触覚フィードバックのオン・オフを切り替えられます。有効にするとボタン操作時に軽い振動で反応を返すため、より直感的な操作感が得られます。
                        </Text>
                    </View>

                    <View style={styles.faqCard}>
                        <Text style={styles.faqTitle}>ランキングの見方</Text>
                        <Text style={styles.faqBody}>
                            ボトムメニューの「ランキング」から全体のランキング情報を確認できます。各プレイヤーの順位、スコア、戦績などが表示されます。
                        </Text>
                    </View>

                    <View style={styles.faqCard}>
                        <Text style={styles.faqTitle}>テーマの変更</Text>
                        <Text style={styles.faqBody}>
                            設定の「テーマ」オプションから、アプリのカラーテーマを変更できます。ライト・ダーク・その他のテーマから選択して、自分の好みのデザインにカスタマイズできます。
                        </Text>
                    </View>

                    <View style={styles.faqCard}>
                        <Text style={styles.faqTitle}>ルールの確認</Text>
                        <Text style={styles.faqBody}>
                            ボトムメニューの「ルール」から、対戦ルールの詳細を確認できます。スコアの計算方法や試合形式などの重要な情報が記載されています。
                        </Text>
                    </View>

                    <View style={styles.faqCard}>
                        <Text style={styles.faqTitle}>データについて</Text>
                        <Text style={styles.faqBody}>
                            このアプリに表示されるすべてのデータは公式サーバーから取得されています。リアルタイムで更新されるため、常に最新の情報をご確認いただけます。
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </PushScreenLayout>
    );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
    return StyleSheet.create({
        section: {
            gap: 14,
            marginBottom: 20,
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
        faqList: {
            gap: 12,
            paddingBottom: 20,
        },
        faqCard: {
            gap: 8,
            borderRadius: 22,
            padding: 16,
            backgroundColor: theme.colors.surfacePrimary,
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
        },
        faqTitle: {
            color: theme.colors.textPrimary,
            fontSize: 16,
            fontWeight: '700',
        },
        faqBody: {
            color: theme.colors.textSecondary,
            fontSize: 13,
            lineHeight: 20,
        },
    });
}

export default HelpCenterScreen;

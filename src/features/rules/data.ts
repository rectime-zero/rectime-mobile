import {type RuleEntry, type RulesHeroCopy} from './types';

export const rulesHeroCopy: RulesHeroCopy = {
    title: '当日の基本ガイド',
    body: '参加者が迷わず動けるよう、重要なルールだけを先にまとめています。',
};

export const ruleEntries: RuleEntry[] = [
    {icon: 'clock', title: '集合時間', body: '競技開始の5分前までに指定エリアへ集合してください。'},
    {icon: 'camera', title: '撮影ルール', body: '会場内の撮影は可能ですが、フラッシュの使用は禁止です。'},
    {icon: 'clipboard-check', title: 'ランキング反映', body: 'ランキング対象試合はスタッフ確認後に記録が反映されます。'},
    {icon: 'users', title: '混雑対応', body: '混雑時は一部エリアで入場規制がかかる場合があります。'},
];

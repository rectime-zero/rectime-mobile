# Codex CLI Prompt - rectime 設定画面

以下の仕様に従って、`rectime` の設定画面をこのリポジトリの実装方針に合わせて改善してください。

このプロンプトは、一般的な React Native テンプレートではなく、このリポジトリ固有の構成とポリシーを前提にしています。

---

## 目的

既存の設定画面は 1 ファイルに UI と設定項目の表現がまとまっています。

今回の目的は次の 2 点です。

1. 設定画面の UI を、セクションと行コンポーネントに分割して見通しを良くする
2. 既存の設定機能を維持したまま、設定画面の構成を拡張しやすくする

重要:

- 既存の「通知」と「触覚フィードバック」の切り替え機能は削除しない
- 未定義の画面や未実装の route には遷移させない
- この変更で新規ライブラリは導入しない

---

## 対象ファイル

以下のように feature 配下で責務分割してください。

```txt
src/features/settings/
  components/
    SettingsSection.tsx
    SettingsToggleRow.tsx
  screens/
    SettingsScreen.tsx
  index.ts
```

補足:

- 既存の `src/features/settings/SettingsScreen.tsx` は `screens/SettingsScreen.tsx` へ移し、責務を薄くする
- `src/features/settings/index.ts` の export は新しい配置に合わせて更新する
- 他ファイルの import が壊れないように必要な参照更新を行う

---

## このリポジトリで従う前提

### アーキテクチャ

- `features` は主要なモジュール境界
- screen は feature-owned module
- feature 固有 UI は `src/features/<feature>/components` に置く
- 共有 UI でないものを `src/components` に上げない

### ナビゲーション

- React Navigation は使わない
- このリポジトリの独自 navigation を使う
- 画面コンテナは既存の `PushScreenLayout` を使う
- ルート型は既存の `AppRoute<'settings'>` を使う

### スタイリング

- `NativeWind` や `className` は使わない
- 既存実装に合わせて `StyleSheet.create` を使ってよい
- 色や背景は固定値ではなく `useTheme()` の token を使う
- ダークテーマ専用の固定デザインにはしない

### アイコン

- 新しい icon ライブラリは追加しない
- 既存依存だけで表現する
- アイコンが不要なら無理に入れなくてよい

---

## 画面仕様

### 画面全体

- `PushScreenLayout` の中に設定画面を配置する
- 縦スクロール可能にする
- セクション見出しと設定カードを使って構成する
- 現在の設定画面より責務を分離し、将来項目追加しやすい構成にする

### セクション構成

今回は少なくとも 1 セクションを用意する。

#### アプリ設定

- 通知
- 触覚フィードバック

補足:

- どちらもトグル行として表現する
- 現在の説明文は残してよいが、行コンポーネントの責務に収まる形へ整理する

### 行コンポーネント

`SettingsToggleRow` は次の責務だけを持つ。

- ラベル表示
- 説明文表示
- `Switch` 表示
- `onValueChange` の受け取り

ローカル state や feature hook は screen 側で持ち、row 側に閉じ込めないこと。

---

## 動作要件

### 通知

- 既存どおり画面内 state で on/off を保持してよい
- UI 上の切り替えが維持されていればよい

### 触覚フィードバック

- 既存の `useFeedback()` を使う
- `hapticsEnabled` を表示に反映する
- `setHapticsEnabled(enabled)` を呼ぶ
- `enabled === true` に切り替わったときだけ `triggerHaptic('selection')` を呼ぶ

既存挙動を変えないこと。

---

## コンポーネント設計

### `SettingsSection`

役割:

- セクションタイトルの表示
- セクション内コンテンツのラップ

Props 例:

```ts
type SettingsSectionProps = {
    title: string;
    children: React.ReactNode;
};
```

### `SettingsToggleRow`

役割:

- 1 つのトグル設定項目を表示する

Props 例:

```ts
type SettingsToggleRowProps = {
    title: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
};
```

必要なら、見た目の都合で `isLast?: boolean` のような表示専用 props を追加してよい。

---

## 実装制約

- 新規ライブラリ追加は禁止
- 未定義 route の追加は禁止
- `navigation.navigate(key as never)` のような型逃がしは禁止
- UI コンポーネント内に feature 固有の設定ロジックを埋め込まない
- `SettingsScreen` が巨大化しすぎないように責務を分割する

---

## 受け入れ条件

- 設定画面が既存 route から引き続き開ける
- 通知トグルが表示され、切り替えできる
- 触覚フィードバックトグルが表示され、既存挙動が維持される
- feature 内で screen と components が分離される
- `useTheme()` ベースの見た目になっている
- 新しい依存追加なしで TypeScript 上の整合が取れている

---

## レビュー観点

実装時は次を確認してください。

1. feature 内の責務分離ができているか
2. screen が state と orchestration のみに寄っているか
3. row/component が presentational な責務に収まっているか
4. 既存の haptics 挙動を壊していないか
5. この repo に存在しない navigation / styling 前提を持ち込んでいないか

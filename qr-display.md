# QR表示機能 指示書

## 概要・目的

来場者が自分のチケット QR コードをアプリ上に表示する機能。
QR コードは一定時間ごとに更新される値を含み、オフライン時でも継続表示できることを目標とする。

このドキュメントは、現在の bare React Native プロジェクト構成とレイヤーポリシーに整合する形で QR 表示機能を追加するための設計指針を定義する。

---

## 現在の前提

- アプリは bare React Native 構成である
- ナビゲーションは React Navigation ではなく `src/navigation` 配下の独自構成である
- ticket / auth feature は現時点では未実装である
- TOTP 生成ロジックは pure function として domain に置く
- secret の取得、保存、更新は infrastructure 経由で扱う

---

## 目標の責務分離

- Presentation
  - QR コードの描画
  - 残り時間表示
  - ローディング / エラー表示
- Application
  - secret 読み込み
  - 表示用 QR 値の定期更新
  - UI 用 state の提供
- Domain
  - TOTP 生成
  - 残り秒数計算
  - QR payload 文字列の生成
- Infrastructure
  - ticket secret API
  - secret storage
  - 画面輝度制御が必要なら native bridge

hook に storage 実装や API DTO を直接持ち込まない。

---

## 推奨ファイル構成

```txt
src/
  features/
    ticket/
      components/
        TicketQrCode.tsx
      hooks/
        useTicketQr.ts
      screens/
        TicketScreen.tsx
      services/
        loadTicketSecret.ts
      types.ts
  domain/
    ticket/
      generateTicketTotp.ts
      buildTicketQrValue.ts
      timeWindow.ts
      models.ts
  infrastructure/
    ticket/
      ticketSecretApi.ts
      ticketSecretStorage.ts
  infrastructure/
    device/
      screenBrightness.ts
```

補足:

- `TicketScreen.tsx` は `components/` ではなく `screens/` に置く
- QR 表示が将来的に単独 feature になるなら `ticket` 配下で完結させる
- native 機能は feature hook から直接呼ばず infrastructure 経由にする

---

## 各ファイルの責務

### `src/domain/ticket/generateTicketTotp.ts`

責務:

- TOTP 値の生成のみを行う純粋関数
- React / React Native 依存を持たない

インターフェース例:

```ts
export function generateTicketTotp(
  userId: string,
  secret: string,
  timestamp?: number
): string
```

仕様:

- 30 秒窓を前提にする
- 出力フォーマットとアルゴリズムはスキャン側検証と一致させる
- 実装ライブラリを使う場合でも、ライブラリ呼び出しは domain の責務として閉じる

### `src/domain/ticket/timeWindow.ts`

責務:

- 現在窓の残り秒数計算

インターフェース例:

```ts
export function getRemainingSeconds(timestamp?: number): number
```

### `src/domain/ticket/buildTicketQrValue.ts`

責務:

- 内部値から QR 埋め込み文字列を組み立てる
- 表示文字列フォーマットを domain で一元化する

インターフェース例:

```ts
export function buildTicketQrValue(userId: string, totpValue: string): string
```

仕様:

- 文字列フォーマットは `rectime:userId:totpValue`
- スキャン側の parser と対になるよう維持する

### `src/features/ticket/hooks/useTicketQr.ts`

責務:

- secret の読み込みユースケースを呼ぶ
- 残り秒数と QR 値を UI 向けに提供する
- 再生成タイミングを制御する

インターフェース例:

```ts
export type UseTicketQrReturn = {
  qrValue: string | null;
  remainingSeconds: number;
  isLoading: boolean;
  isError: boolean;
  reload: () => Promise<void>;
};

export function useTicketQr(userId: string): UseTicketQrReturn
```

仕様:

- `loadTicketSecret` を経由して secret を取得する
- secret が取得済みなら、時間窓の切り替わりに応じて QR 値を再計算する
- API shape や storage key を hook 内に直接持たない

### `src/features/ticket/components/TicketQrCode.tsx`

責務:

- QR 文字列を受け取って描画する
- 残り時間と状態を表示する

インターフェース例:

```tsx
type TicketQrCodeProps = {
  qrValue: string | null;
  remainingSeconds: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function TicketQrCode(props: TicketQrCodeProps): JSX.Element
```

注意:

- QR 描画ライブラリは現時点で未導入のため、実装時に bare React Native で使えるものを選定する
- `react-native-qrcode-svg` を採用するなら dependency 追加を別途行う

### `src/features/ticket/screens/TicketScreen.tsx`

責務:

- `useTicketQr` を呼び出し、`TicketQrCode` に渡す
- チケット表示画面全体のレイアウトを担う

仕様:

- route param 前提ではなく、将来の session/store/auth feature から `userId` を受け取る
- 現在のナビゲーション構成に追加する場合は `src/navigation/types.ts` と `src/navigation/renderRoute.tsx` を更新する
- 画面輝度の制御を入れる場合は infrastructure の関数を経由する

---

## 推奨データフロー

```txt
session or auth boundary
  -> userId
  -> useTicketQr
     -> loadTicketSecret
        -> storage を確認
        -> 必要なら API を呼ぶ
     -> generateTicketTotp
     -> buildTicketQrValue
  -> TicketQrCode
```

---

## secret の扱い

secret の管理方針:

- storage 実装は infrastructure に閉じ込める
- 保存キーは infrastructure 側で定義する
- hook や UI は保存方式を知らない
- 暗号化保存が必要なら、そのライブラリ導入は別タスクとして選定する

現時点では以下を前提にしない:

- `expo-secure-store`
- auth context がすでに存在すること
- API がすでに接続済みであること

---

## スキャン機能との整合

- QR 文字列フォーマットは `rectime:userId:totpValue`
- TOTP のアルゴリズム、桁数、時間窓はスキャン側検証と一致させる
- 表示側と検証側で仕様だけを共有し、UI や storage 実装は共有しない

必要なら共通化するのは UI ではなく domain の仕様である。

---

## ナビゲーション追加時の前提

このプロジェクトは React Navigation の screen props 前提ではないため、以下に合わせる:

- route 名は `src/navigation/types.ts` に追加する
- 画面描画の紐付けは `src/navigation/renderRoute.tsx` に追加する
- feature screen は `src/features/ticket/screens/TicketScreen.tsx` から参照する

---

## 非整合だった前提の整理

このプロジェクトでは以下をそのまま前提にしない:

- React Navigation 固有の screen 定義
- `expo-brightness`
- `expo-screen-capture`
- `expo-secure-store`
- `react-native-qrcode-svg` が既に導入済みであること

必要な native 機能やライブラリは、bare React Native 対応のものを個別に導入し、infrastructure 境界から利用する。

# QRスキャン機能 指示書

## 概要・目的

スタッフが来場者の QR コードを読み取り、入場可否を判定する機能。
現在のプロジェクトは bare React Native 構成であり、既存の QR スキャン実装は `gate` feature に存在する。

このドキュメントは、現行リポジトリの構成に合わせて QR スキャン機能を拡張するための設計指針を定義する。

---

## 現在の前提

- アプリは Expo ではなく bare React Native 構成である
- カメラ実装は `react-native-vision-camera` を前提とする
- VisionCamera の optional runtime は `src/infrastructure/native/optionalVisionCamera.ts` を境界として扱う
- 既存の QR スキャン画面は `src/features/gate/screens/QRScanScreen.tsx` に存在する
- ナビゲーションは React Navigation ではなく、`src/navigation` 配下の独自ルーティング構成を使用している
- 認証、API、永続化、オンライン判定は未整備の箇所があるため、この機能はそれらの具体実装を直接前提にしない

---

## 目標の責務分離

- Presentation
  - スキャン画面の表示
  - 結果オーバーレイの表示
  - カメラ許可状態に応じた UI の出し分け
- Application
  - スキャンセッションの進行制御
  - QR 解析結果に応じたユースケースの呼び出し
  - オンライン時送信とオフライン時保留の分岐
- Domain
  - QR 文字列のパース
  - TOTP 検証
  - スキャン判定結果の表現
- Infrastructure
  - VisionCamera runtime
  - API 通信
  - ローカルキュー保存
  - ネットワーク状態取得
  - 端末 ID 取得

hook に API DTO や storage 実装を直接埋め込まない。

---

## 推奨ファイル構成

```txt
src/
  features/
    gate/
      components/
        ScanCamera.tsx
        ScanResultOverlay.tsx
      hooks/
        useScanSession.ts
      screens/
        QRScanScreen.tsx
      services/
        submitGateScan.ts
        syncPendingGateScans.ts
      types.ts
  domain/
    gate/
      parseGateQr.ts
      validateGateTotp.ts
      models.ts
  infrastructure/
    gate/
      gateScanApi.ts
      gateScanQueueStorage.ts
      gateNetworkStatus.ts
      gateDeviceIdStorage.ts
```

補足:

- 既存の `src/features/gate/screens/QRScanScreen.tsx` を起点に段階的に分割する
- VisionCamera 依存は `src/infrastructure/native/optionalVisionCamera.ts` を経由する
- ドメインロジックは `features` ではなく `domain` に置く

---

## 各ファイルの責務

### `src/domain/gate/parseGateQr.ts`

責務:

- QR 文字列を内部モデルへ明示的に変換する
- 外部フォーマットを domain に直接持ち込まない

インターフェース例:

```ts
export type ParsedGateQr =
  | {ok: true; userId: string; totpValue: string}
  | {ok: false; reason: 'invalid_format'};

export function parseGateQr(qrValue: string): ParsedGateQr
```

仕様:

- QR フォーマットは `rectime:userId:totpValue`
- split 結果をそのまま下流へ渡さず、正規化済みオブジェクトに変換する

### `src/domain/gate/validateGateTotp.ts`

責務:

- QR から得た `userId` と `totpValue` をローカルで検証する純粋関数
- React / React Native 依存を持たない

インターフェース例:

```ts
export type GateTotpValidationResult =
  | {ok: true; userId: string}
  | {ok: false; reason: 'invalid_format' | 'expired' | 'invalid_totp' | 'secret_not_found'};

export async function validateGateTotp(
  qrValue: string,
  getSecretByUserId: (userId: string) => Promise<string | null>,
  timestamp?: number
): Promise<GateTotpValidationResult>
```

仕様:

- `parseGateQr` の結果を受けて検証する
- TOTP のアルゴリズムと時間窓は QR 表示側と一致させる
- secret 取得は注入関数経由にし、SecureStore などの実装詳細は domain に入れない

### `src/features/gate/hooks/useScanSession.ts`

責務:

- スキャンセッション全体の状態遷移を管理する
- ドメイン関数と feature service を組み合わせる
- UI が扱いやすい view state を返す

インターフェース例:

```ts
export type ScanStatus =
  | 'idle'
  | 'scanning'
  | 'success'
  | 'error'
  | 'duplicate'
  | 'offline_recorded';

export type ScanResult = {
  status: ScanStatus;
  userId?: string;
  message?: string;
};

export type UseScanSessionReturn = {
  isOnline: boolean;
  currentResult: ScanResult;
  pendingCount: number;
  handleScan: (qrValue: string) => Promise<void>;
  clearResult: () => void;
};

export function useScanSession(): UseScanSessionReturn
```

仕様:

- オンライン判定は infrastructure から取得する
- API 通信は `services/submitGateScan.ts` を経由する
- 保留キュー同期は `services/syncPendingGateScans.ts` を経由する
- hook は API response shape や storage record shape を直接知らない

### `src/features/gate/components/ScanCamera.tsx`

責務:

- VisionCamera を用いた QR 読み取り UI
- 読み取り結果を親へ通知する

インターフェース例:

```tsx
type ScanCameraProps = {
  onScan: (qrValue: string) => void;
  disabled: boolean;
};

export function ScanCamera(props: ScanCameraProps): JSX.Element
```

仕様:

- `react-native-vision-camera` を使用する
- runtime の取得は `optionalVisionCamera` を経由する
- `disabled` 中は `onScan` を発火しない
- 同一値の連続読み取り抑止を入れる

### `src/features/gate/components/ScanResultOverlay.tsx`

責務:

- スキャン結果を画面上に表示する
- 表示時間経過後に dismiss を通知する

インターフェース例:

```tsx
type ScanResultOverlayProps = {
  result: ScanResult;
  onDismiss: () => void;
};

export function ScanResultOverlay(props: ScanResultOverlayProps): JSX.Element
```

注意:

- 音再生ライブラリは現時点で未導入のため、導入する場合は bare React Native 対応ライブラリを別途選定する
- 音を入れない場合でも、色・文言・アニメーションだけで結果が判別できる設計にする

### `src/features/gate/screens/QRScanScreen.tsx`

責務:

- `ScanCamera` と `useScanSession` を組み合わせる
- スキャン画面全体のレイアウトを担う
- 既存の `QRScanScreen` の責務を維持しつつ、モック表示から実機能へ段階移行する

仕様:

- feature 固有の UI をまとめる screen とする
- ルーティングの登録は `src/navigation/types.ts` と `src/navigation/renderRoute.tsx` に対して行う
- 認証や権限判定が未整備な現段階では、画面内に認可ロジックを埋め込まず、将来の session/store 境界から注入する

---

## 推奨フロー

オンライン時:

```txt
ScanCamera
  -> useScanSession.handleScan(qrValue)
  -> parseGateQr
  -> validateGateTotp
  -> submitGateScan
     -> success: success
     -> duplicate: duplicate
     -> recoverable error: queue に積んで offline_recorded
```

オフライン時:

```txt
ScanCamera
  -> useScanSession.handleScan(qrValue)
  -> parseGateQr
  -> validateGateTotp
  -> queue に積む
  -> offline_recorded
```

同期時:

```txt
network reconnected
  -> syncPendingGateScans
  -> 成功分を queue から削除
  -> duplicate も queue から削除
```

---

## API と storage の扱い

現時点では API 契約はこのリポジトリ内に未実装のため、以下は feature service / infrastructure で吸収する前提とする。

- API request DTO は infrastructure 側で定義する
- API response DTO は infrastructure 側で定義する
- queue 保存用 record も infrastructure 側で定義する
- `useScanSession` はそれらの shape を直接参照しない

---

## 現在のコードとの接続点

- 既存画面: `src/features/gate/screens/QRScanScreen.tsx`
- 既存 feature 公開面: `src/features/gate/index.ts`
- 既存カメラ境界: `src/infrastructure/native/optionalVisionCamera.ts`

この機能は新規 feature を切るより、既存の `gate` feature を拡張する方が現在のコードベースと整合する。

---

## 非整合だった前提の整理

このプロジェクトでは以下を前提にしない:

- `expo-camera`
- `expo-av`
- `expo-keep-awake`
- `expo-device`
- React Navigation 固有 API
- auth context がすでに存在すること
- MMKV や SecureStore がすでに導入済みであること

必要なら別タスクとして dependency 選定と infrastructure 追加を行う。

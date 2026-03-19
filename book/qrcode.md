# タスク: QR入場スキャン画面の実装（モック）

## 背景・目的

rectime-mobile にQRコードによる入場チェックイン画面を追加する。
現時点ではバックエンド送信は行わず、読み取り成功時に Alert を表示するモックとして実装する。
将来的にバックエンド接続に差し替えられる構造にしておくこと。

---

## プロジェクト前提

- Pure React Native（Expo なし）
- iOS / Android 両対応
- NativeWind v4 によるスタイリング
- React Navigation（Stack + BottomTab + Drawer 構成）
- TypeScript strict モード
- ディレクトリ構成: `src/features/<feature>/screens/`, `src/features/<feature>/components/`
- パスエイリアス: `@/` → `src/`

---

## 使用ライブラリ

```bash
yarn add react-native-vision-camera vision-camera-code-scanner
cd ios && pod install
```

---

## ネイティブセットアップ

### Android

`android/app/src/main/AndroidManifest.xml` に以下が**なければ追加**:

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

### iOS

`ios/<AppName>/Info.plist` に以下が**なければ追加**:

```xml
<key>NSCameraUsageDescription</key>
<string>QRコードを読み取るためにカメラを使用します。</string>
```

---

## 作成・変更するファイル

---

### 1. `src/features/gate/screens/QRScanScreen.tsx`（新規作成）

#### 仕様

- `react-native-vision-camera` の `Camera` コンポーネントで全画面カメラを表示する
- `useCameraPermission()` で権限チェックを行い、未許可の場合は権限要求UIを表示する
- `useCodeScanner()` で `qr` タイプのみをスキャン対象とする
- QR読み取り成功時の処理:
  - `useRef` の `isScanning` フラグで連続読み取りを防止する（Alert を閉じるまで再スキャンしない）
  - 以下の型のペイロードをコンソールに出力する（TODO: 本番では API に POST する）
    ```ts
    type GateCheckInPayload = {
      qrData: string;
      scannedAt: string; // ISO 8601
    };
    ```
  - `Alert.alert` でQRの内容を表示する
  - Alert のボタン:
    - 「続けてスキャン」→ フラグをリセットしてスキャン再開
    - 「閉じる」→ `navigation.goBack()`
- UI構成:
  - 全画面カメラ映像
  - 上部ヘッダー: 左に「✕ 閉じる」ボタン、中央に「QR 入場スキャン」テキスト
  - 中央にスキャン枠（四隅マーカーのみ、背景透過）
  - 枠下に案内テキスト「QRコードを枠内に合わせてください」
  - 画面下部に `MOCK — API 未接続` バッジ（黄色）
- スタイリングは NativeWind v4 の className を使う
- `StyleSheet.create` は使わない

---

### 2. `src/features/dev/screens/DevMenuScreen.tsx`（既存ファイルに追記）

#### 仕様

- 既存の開発メニューリストに以下のボタンを1件追加する
  - アイコン: 📷
  - タイトル: `QR入場スキャン`
  - サブテキスト: `入管システム（モック）`
  - onPress: `navigation.navigate('QRScan')`
- 既存のボタンのスタイル・構造に揃えること
- 既存コードは変更しない（追記のみ）

---

### 3. `src/navigation/RootNavigator.tsx`（既存ファイルに追記）

#### 仕様

- `RootStackParamList` に `QRScan: undefined` を追加する
- `Stack.Screen` を以下の設定で追加する:
  ```tsx
  <Stack.Screen
    name="QRScan"
    component={QRScanScreen}
    options={{
      headerShown: false,
      presentation: 'fullScreenModal',
    }}
  />
  ```
- 既存のスクリーン定義は変更しない（追記のみ）

---

## 完了条件

- [ ] `yarn android` / `yarn ios` でビルドが通る
- [ ] 開発メニューに「QR入場スキャン」ボタンが表示される
- [ ] ボタンタップでカメラが全画面で起動する
- [ ] カメラ権限を未許可の場合、権限要求UIが表示される
- [ ] QRコードをかざすと Alert が表示され、QRの内容が確認できる
- [ ] 「続けてスキャン」で再スキャンが可能になる
- [ ] 「閉じる」で開発メニューに戻る
- [ ] コンソールに `GateCheckInPayload` が出力される
- [ ] TypeScript のエラーが0件である

---

## やらないこと（スコープ外）

- バックエンドへの API 送信
- 認証・権限によるアクセス制御（管理者のみ表示など）
- スキャン履歴の保存
- エラーハンドリングの作り込み（Alert の最小表示のみでよい）
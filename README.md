# rectime-mobile

rectime の React Native モバイルアプリです。

## 技術スタック

- React Native 0.84
- React 19
- TypeScript

## ディレクトリ

- `src/assets`: 画像やアイコンなどの静的アセット
- `src/components`: 複数画面で共有する UI コンポーネント
- `src/config`: ルート定義やアプリ共通設定
- `src/features`: 機能ごとの screen / data / local UI
- `src/navigation`: 画面遷移とナビゲーション UI
- `src/theme`: テーマ定義とトークン
- `android`: Android ネイティブプロジェクト
- `ios`: iOS ネイティブプロジェクト

## 補助ドキュメント

- Android セットアップ: `SETUP_ANDROID.md`
- Android 起動手順: `STARTUP_ANDROID.md`
- iOS 起動手順: `STARTUP_IOS.md`
- 実装ポリシー: `react-native-policy.md`

## 開発コマンド

- `npm run android:emulator`: Android Emulator を起動
- `npm start`: Metro を起動
- `npm run android:no-packager`: Metro を別で起動している前提で Android アプリを起動
- `npm run android:stop-tools`: Android emulator / adb を停止
- `npm run ios`: iOS アプリを起動

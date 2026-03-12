# rectime-mobile

rectime の React Native モバイルアプリです。

## 技術スタック

- React Native 0.84
- React 19
- TypeScript
- NativeWind

## ディレクトリ

- `src/app`: アプリ入口
- `src/navigation`: ナビゲーション
- `src/screens`: 画面
- `src/components`: 共通 UI
- `src/assets`: 画像などの共通アセット
- `android`: Android ネイティブプロジェクト
- `ios`: iOS ネイティブプロジェクト
- `scripts`: 起動補助スクリプト
- `.idea/runConfigurations`: JetBrains / Android Studio の共有実行設定

## 開発の入口

- アプリ本体: `src/app/App.tsx`
- Stage 状態管理: `src/stage/StageProvider.tsx`
- Stage 描画: `src/stage/StageRenderer.tsx`
- 各ページ: `src/screens/*`
- アイコン元画像: `src/assets/icons/app-icon.png`

## ドキュメント

- Android の初回セットアップ: `SETUP_ANDROID.md`
- Android の日常起動手順: `STARTUP_ANDROID.md`

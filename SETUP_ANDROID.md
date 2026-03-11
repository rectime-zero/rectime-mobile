# SETUP ANDROID

## 前提

Windows 環境を前提にしています。

必要なもの:

- Node.js
- npm
- Android Studio
- Android SDK
- Android Emulator

## 初回セットアップ

1. 依存を入れる

```powershell
npm install
```

2. Android Studio で必要なコンポーネントを入れる

- Android SDK Platform
- Android SDK Build-Tools
- Android Emulator
- Platform Tools

3. エミュレーターを 1 台作成する

4. エミュレーターを起動できることを確認する

## JetBrains / Android Studio

共有 Run Configuration:

- `Metro`
- `Android No Packager`

これらは `.idea/runConfigurations` にあります。

## 手動起動に使うスクリプト

- `scripts/Start-Metro.ps1`
- `scripts/Run-Android.ps1`

これらのスクリプトは Android Studio / SDK の標準的な配置を自動検出します。

# SETUP ANDROID

## 前提

Windows / macOS の両方を対象にしています。

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

- `Android Emulator`
- `Android Kill Tasks`
- `Metro`
- `Android Rebuild`

これらは `.idea/runConfigurations` にあります。

- Windows / macOS ともに `Android Emulator` / `Android Kill Tasks` / `Metro` / `Android Rebuild` を使います
- JetBrains の `npm` Run Configuration として共有しています
- エミュレーター起動は `Android Emulator` ボタンでも Android Studio の Device Manager でもできます
- IntelliJ の `npm` ツールウィンドウから `start` と `android:no-packager` を実行しても同じです

## 手動起動

Metro:

```sh
npm start
```

Android Emulator:

```sh
npm run android:emulator
```

Android:

```sh
npm run android:no-packager
```

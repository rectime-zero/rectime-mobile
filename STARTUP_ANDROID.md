# STARTUP ANDROID

## 起動順

1. `Android Emulator` を実行する
2. `Metro` を実行する
3. `Android Rebuild` を実行する

## それぞれ何をするか

### `Android Emulator`

- 共有 CLI としては `npm run android:emulator` を実行する
- JetBrains の共有 Run Configuration は `package.json` の `android:emulator` script を実行する
- 既定では `Medium_Phone_API_36.1` を cold boot で起動する
- Android Studio の Device Manager を使って起動してもよい

### `Metro`

- 共有 CLI としては `npm start` を実行する
- JetBrains の共有 Run Configuration は `package.json` の `start` script を実行する
- Metro dev server を起動して待機する
- 常駐プロセスなので開いたままにする

### `Android Rebuild`

- 共有 CLI としては `npm run android:no-packager` を実行する
- JetBrains の共有 Run Configuration は `package.json` の `android:no-packager` script を実行する
- Android アプリを build / install / launch する
- 正常終了するのが正しい動作

## 反映方法

次の変更は `Metro` が起動していれば Fast Refresh で反映されます。

- `src/app/App.tsx`
- `src/screens/*.tsx`
- `src/components/*.tsx`
- `src/navigation/*.tsx`
- `src/stage/*.tsx`

次の変更は `Android Rebuild` の再実行が必要です。

- `android/` 配下
- ネイティブ依存の追加や変更
- Gradle 設定変更
- アプリアイコン変更

## 現在の実装前提

- 画面遷移の土台は `Stage UI` です
- 入口は `src/app/App.tsx` から `src/stage/StageProvider.tsx` と `src/stage/StageRenderer.tsx` を使います
- サンプルとして `Home / Detail / SampleBottomSheet / SideMenu` が入っています

## 現在の Android 制約

- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-worklets`
- `react-native-safe-area-context`

上の native 依存は、この環境では Android の `:app:packageDebug` で packaging に失敗したため、現在は `react-native.config.js` で Android autolink を止めています。

そのため現時点の Stage 実装は、内部的には React Native 標準の `Animated` / `PanResponder` を使っています。

つまり今の状態はこうです。

- 設計: `StageProvider / StageRenderer / ScreenContent` の分離を採用
- Android 実装: stock `Animated` / `PanResponder`
- 将来: native gesture / animation ライブラリへ差し替え可能な構造

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

## 反映されないとき

1. `Metro` が起動しているか確認する
2. エミュレーターでアプリが開いているか確認する
3. Metro 側で `r` を押す
4. それでもだめなら `Android Rebuild` を再実行する
5. `adb devices` が `offline` ならエミュレーターを再起動する

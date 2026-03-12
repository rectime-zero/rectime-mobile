# STARTUP ANDROID

## 起動順

1. エミュレーターを起動する
2. `Metro` を実行する
3. `Android No Packager` を実行する

## それぞれ何をするか

### `Metro`

- `scripts/Start-Metro.ps1` を実行する
- Metro dev server を起動して待機する
- 常駐プロセスなので開いたままにする

### `Android No Packager`

- `scripts/Run-Android.ps1` を実行する
- Android アプリを build / install / launch する
- 正常終了するのが正しい動作

## 反映方法

次の変更は `Metro` が起動していれば Fast Refresh で反映されます。

- `src/app/App.tsx`
- `src/screens/*.tsx`
- `src/components/*.tsx`
- `src/navigation/*.tsx`
- `src/stage/*.tsx`

次の変更は `Android No Packager` の再実行が必要です。

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

```powershell
npm start
```

Android:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\Run-Android.ps1
```

## 反映されないとき

1. `Metro` が起動しているか確認する
2. エミュレーターでアプリが開いているか確認する
3. Metro 側で `r` を押す
4. それでもだめなら `Android No Packager` を再実行する
5. `adb devices` が `offline` ならエミュレーターを再起動する

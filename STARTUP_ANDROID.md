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

次の変更は `Android No Packager` の再実行が必要です。

- `android/` 配下
- ネイティブ依存の追加や変更
- Gradle 設定変更
- アプリアイコン変更

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

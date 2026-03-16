# STARTUP IOS

## 起動順

1. `Metro` を実行する
2. `iOS Rebuild` を実行する

## それぞれ何をするか

### `Metro`

- 共有 CLI としては `npm start` を実行する
- JetBrains の共有 Run Configuration は `package.json` の `start` script を実行する
- Metro dev server を起動して待機する

### `iOS Rebuild`

- 共有 CLI としては `npm run ios` を実行する
- JetBrains の共有 Run Configuration は `package.json` の `ios` script を実行する
- 選択された iOS ターゲットへアプリを build / install / launch する
- ターゲットは iOS Simulator のこともあれば、接続中の実機のこともある
- 正常終了するのが正しい動作

## すでに起動済みのとき

- アプリが Simulator または実機に入っていて起動済みなら、JS 修正は `Metro` だけで Fast Refresh されます
- アプリが停止中でも端末に入っていれば、手動でアプリを開いて再起動できます

## 再ビルドが必要なとき

- `ios/` 配下の変更
- Pod の追加や更新
- ネイティブ依存の追加や更新
- Xcode project / scheme / signing の変更
- アプリアイコンや launch screen の変更

## 手動起動

Metro:

```sh
npm start
```

iOS:

```sh
npm run ios
```

## 反映されないとき

1. `Metro` が起動しているか確認する
2. Simulator または実機でアプリが開いているか確認する
3. 端末側でアプリを再起動する
4. それでもだめなら `iOS Rebuild` を再実行する

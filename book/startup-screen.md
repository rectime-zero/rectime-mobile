# スプラッシュ画面実装設計書

## 概要

| 項目 | 内容 |
|------|------|
| 対象プロジェクト | rectime-mobile |
| 対象プラットフォーム | iOS / Android |
| 実装方式 | react-native-splash-screen（ネイティブ連携） |
| アニメーション | Reveal & Rise（ロゴ + タイトルが下から浮き上がりフェードイン） |
| ステータス | プレースホルダー実装済み・ロゴ/タイトル差し替え待ち |

---

## ディレクトリ構成

```
rectime-mobile/
├── src/
│   └── components/
│       └── SplashScreen.tsx        # JSアニメーション層（本ファイル）
├── android/
│   └── app/
│       ├── src/main/
│       │   ├── java/.../MainActivity.kt   # SplashScreen.show() 追加済み
│       │   └── res/
│       │       ├── layout/
│       │       │   └── launch_screen.xml  # ネイティブスプラッシュレイアウト
│       │       ├── drawable/
│       │       │   └── logo_placeholder.png  # TODO: 正式ロゴに差し替え
│       │       └── values/
│       │           └── colors.xml         # splashBackground カラー定義
├── ios/
│   └── rectime/
│       ├── AppDelegate.swift              # RNSplashScreen.show() 追加済み
│       └── LaunchScreen.storyboard        # TODO: 正式ロゴ画像に差し替え
└── App.tsx                                # SplashScreen コンポーネントのエントリ制御
```

---

## パッケージ

```bash
npm install react-native-splash-screen
cd ios && pod install
```

---

## ネイティブ設定

### Android — `MainActivity.kt`

```kotlin
import android.os.Bundle
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this) // ← 追加
        super.onCreate(savedInstanceState)
    }
}
```

### Android — `res/layout/launch_screen.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/splashBackground">

    <ImageView
        android:layout_centerInParent="true"
        android:layout_width="120dp"
        android:layout_height="120dp"
        android:src="@drawable/logo_placeholder" />
</RelativeLayout>
```

### Android — `res/values/colors.xml`

```xml
<resources>
    <!-- TODO: ブランドカラーが決まったら変更 -->
    <color name="splashBackground">#FFFFFF</color>
</resources>
```

### iOS — `AppDelegate.swift`

```swift
import RNSplashScreen

func application(_ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // ...既存コード...
    RNSplashScreen.show()
    return true
}
```

### iOS — `LaunchScreen.storyboard`

Xcode で以下を設定する：

- 背景色：`#FFFFFF`（TODO: ブランドカラーに変更）
- 中央に `ImageView` を配置し、ロゴ画像をアサイン（TODO: 正式ロゴに差し替え）

---

## JS層コンポーネント

### `src/components/SplashScreen.tsx`

#### Props

| Prop | 型 | 説明 |
|------|----|------|
| `onFinish` | `() => void` | アニメーション完了後に呼び出すコールバック |

#### アニメーションシーケンス

```
[0ms]   ネイティブスプラッシュ非表示（RNSplashScreen.hide()）
[0ms]   ロゴ フェードイン + translateY(24→0)  duration: 500ms
[600ms] タイトル フェードイン + translateY(24→0)  duration: 400ms
[1100ms] 表示維持  duration: 800ms
[1900ms] ロゴ + タイトル フェードアウト  duration: 300ms
[2200ms] onFinish() → メイン画面へ遷移
```

> すべてのアニメーションは `useNativeDriver: true`（GPU駆動）

#### 実装コード

```tsx
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import RNSplashScreen from 'react-native-splash-screen';

interface Props {
  onFinish: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(24)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    RNSplashScreen.hide();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => onFinish());
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* ロゴ: 正式画像が決まったら <Image> に差し替え */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      >
        {/* TODO: 差し替え
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        */}
        <View style={styles.logoPlaceholder} />
      </Animated.View>

      {/* タイトル: 正式タイトルが決まったら文字列を差し替え */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        {/* TODO: 正式タイトルに差し替え */}
        AppTitle
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // TODO: ブランドカラーに変更
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#E0E0E0', // TODO: ロゴ差し替えと同時に削除
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333', // TODO: ブランドカラーに変更
    letterSpacing: 1,
  },
});
```

---

## App.tsx エントリ制御

```tsx
import React, { useState } from 'react';
import { SplashScreen } from './src/components/SplashScreen';
import { MainNavigator } from './src/navigation/MainNavigator';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return <MainNavigator />;
}
```

---

## TODO（ロゴ・ブランド確定後の差し替えリスト）

| # | 対応ファイル | 対応内容 |
|---|-------------|---------|
| 1 | `SplashScreen.tsx` | `<View style={styles.logoPlaceholder} />` を `<Image source={require('../assets/logo.png')} style={styles.logo} />` に差し替え |
| 2 | `SplashScreen.tsx` | `logoPlaceholder` スタイル定義を削除 |
| 3 | `SplashScreen.tsx` | `AppTitle` を正式タイトル文字列に変更 |
| 4 | `SplashScreen.tsx` | `backgroundColor` / `color` をブランドカラーに変更 |
| 5 | `res/values/colors.xml` | `splashBackground` をブランドカラーに変更 |
| 6 | `res/drawable/` | `logo_placeholder.png` を正式ロゴ画像に差し替え |
| 7 | `LaunchScreen.storyboard` | 背景色・ロゴ画像を正式なものに変更（Xcode） |

---

## 制約・注意事項

- `useNativeDriver: true` を必ず維持すること（`layout` 系プロパティには使用不可）
- ネイティブスプラッシュと JS層スプラッシュの間にチラつきが出る場合は、ネイティブ側の背景色と JS側の `backgroundColor` を一致させること
- `RNSplashScreen.hide()` は `useEffect` 内の最初の行で呼ぶこと（遅延すると白画面が見える）
- iOS の `LaunchScreen.storyboard` は App Store のスクリーンショット審査対象になるため、プレースホルダーのまま提出しないこと
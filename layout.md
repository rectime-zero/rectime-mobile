React Native で、Claude iOS アプリ風の「重なったカードで動く」ナビゲーションシステムを実装してください。

最重要:
これは一般的な DrawerNavigator + StackNavigator の組み合わせではありません。
アプリ全体を「トランプカードのように重なったステージ」として扱う独自UIとして実装してください。

================================
目的
================================
このアプリのメインデザイン思想は、画面をトランプカードのように重ねて扱うことです。

実現したい動きは大きく3種類あります。

1. Claude風サイドメニュー
- 背面にサイドメニューが常時存在する
- 前面にホーム画面が存在する
- メニューを開くと、前面のホーム画面だけが右へスライドする
- メニューが前面から被さるのではなく、下にいたメニューが見える
- ホーム画面は開く途中からカード感が出て、角丸・影・軽い縮小が入る

2. ページ遷移
- 現在のページは基本的に動かさない
- 遷移先ページが右から上に重なるように出てくる
- 戻るときは、最前面ページを右へドラッグして途中で止められる
- つまり iOS 風の interactive pop のような挙動にしたい

3. 下から出る popup / sheet
- 画面内容とは別に、下からカード状の UI を出せるようにしたい
- 途中で止められる drag dismiss が可能な構造にしたい
- これは bottom-sheet / popup-menu / modal-sheet のような用途を想定

================================
設計方針
================================
画面内容そのものと、表示方法を分離してください。

各ページの中身はただの ScreenContent として作り、
それをどう表示するかは Stage / Presentation レイヤーで管理してください。

つまり、
- 内容物コンポーネント
- カードとしての表示方法
- カード群全体の状態管理
を分けてください。

アプリ全体を1つの StageController で管理し、gesture と animation の責任を一元化してください。

================================
実装してほしいアーキテクチャ
================================
最低限、以下の責務分割で実装してください。

1. StageProvider / StageController
責務:
- 背面メニューの開閉状態を管理
- 前景カードスタックを管理
- push / pop / present / dismiss を管理
- active gesture を1か所で管理
- menu gesture と back gesture と sheet gesture の競合を防ぐ

2. StageRenderer
責務:
- 積まれているカードを presentation ごとに描画する
- メニュー、通常ページ、sheet、modal をレイヤーとして重ねる
- 角丸、影、scale、translate の見た目を presentation ごとに適用する

3. ScreenContent
責務:
- 各ページの中身だけを持つ
- gesture や stage 制御の責務は持たない
- navigation API は呼んでよいが、直接アニメーション制御はしない

================================
state 設計
================================
メニューとページ遷移と sheet は別々にバラバラ管理せず、
1つの上位 state で扱ってください。

推奨イメージ:

type PresentationMode =
  | 'root'
  | 'push'
  | 'bottom-sheet'
  | 'modal';

type StageItem = {
  key: string;
  presentation: PresentationMode;
  content: React.ReactNode;
};

type ActiveGesture =
  | 'none'
  | 'menu'
  | 'back'
  | 'sheet';

type StageState = {
  routeStack: StageItem[];
  overlays: StageItem[];
  menuProgress: number;
  activeGesture: ActiveGesture;
};

上記はあくまで参考です。
よりよい設計であれば変更して構いませんが、
「一元管理で競合を防ぐ」思想は必ず守ってください。

================================
gesture のルール
================================
gesture 判定は必ず stage の上位1か所で行ってください。
各ページごとに個別判定させないでください。

重要:
右スワイプは状況によって意味が変わるため、gesture 開始時に ownership をロックしてください。

期待するルール:
- 現在がホーム階層の最上位ページなら、左端からの右スワイプは menu gesture
- 現在がホーム以外の push されたページなら、左端からの右スワイプは back gesture
- bottom-sheet が最前面にある場合は sheet gesture を優先
- ある gesture が開始したら、終了まで他 gesture に切り替えない
- アニメーション進行中は別 gesture を開始しない

================================
UI のレイヤー構造
================================
全体は absolute / overlay ベースでレイヤーを重ねてよいですが、
画面内部の通常レイアウトまで全部 absolute にしないでください。

正しい方針:
- ステージ上の「画面カード」だけ absolute で重ねる
- 各画面の中身は通常の flex layout で構築する

イメージ:
- MenuLayer
- CurrentCardStack
- TopPageCard
- BottomSheetCard
- ModalCard

================================
Claude風サイドメニューの仕様
================================
これは一般的な drawer ではありません。

やってほしいこと:
- メニューは常時背面に存在する
- ホーム画面は前面カード
- メニューを開くと、前面ホームカードだけが右へ動く
- 開く progress に応じてホームカードの borderRadius を増やす
- progress に応じて scale を少し下げてもよい
- shadow を強めてカード感を出す
- overflow: hidden 相当の見た目になるようにする
- iOS の Claude アプリっぽい質感を目指す

やってはいけないこと:
- メニューを z-index の高い前面パネルとして被せる
- menu と home を横並びにして押し出すだけの X 風構造にする
- 一般的な drawer と同じ実装にする

================================
ページ遷移の仕様
================================
- 現在ページはそのまま残す
- 次ページが右外から上に被さるように出る
- 戻るときは、最前面ページのみを右へドラッグできる
- ドラッグ progress に応じて戻り遷移を制御する
- 途中で止められること
- velocity や threshold を使って complete / cancel を自然に判定すること

================================
bottom sheet / popup の仕様
================================
- 内容物コンポーネントを下から出せるようにする
- 表示方法は presentation として切り替えられるようにする
- drag dismiss をできるようにする
- 背景 dim を持たせる
- sheet もステージ管理下に置く

================================
safe area と角丸
================================
- react-native-safe-area-context を使って safe area を考慮してください
- iOS では physical display corner radius の正確取得は不要
- まずは safe area と大きめの自然な corner radius で Claude風の見た目を実現してください
- Android は後で個別に角丸値を注入しやすいように、四隅の radius を拡張可能な構造にしてください

================================
技術要件
================================
- React Native
- TypeScript
- react-native-gesture-handler
- react-native-reanimated
- react-native-safe-area-context

上記を前提に実装してください。

================================
求める API
================================
以下のような API を使える構造にしてください。

- push(screen)
- pop()
- presentSheet(screen)
- dismissSheet()
- openMenu()
- closeMenu()

必要なら screen ではなく config object にしても構いません。

================================
実装してほしいサンプル
================================
最小構成でよいので以下を入れてください。

1. HomeScreen
- 左上に menu open ボタン
- 適当なリストやダミー本文

2. DetailScreen
- Home から push で遷移
- interactive pop で戻れる

3. SampleBottomSheet
- Home から下から出せる
- drag dismiss できる

4. SideMenu
- Claude風の背面メニュー
- ダミー項目でよい

================================
出力形式
================================
以下をまとめて出力してください。

1. ファイル構成
2. 実装コード一式
3. 各コンポーネントの責務説明
4. gesture 競合をどう防いでいるかの説明
5. 今後拡張するならどこを触ればよいかの説明

================================
重要な注意
================================
- 普通のナビゲーションライブラリの既製 drawer をそのまま使うのではなく、
  今回の独自 Stage UI を中心に構築してください
- 画面内容と表示方法を分離してください
- 各ページに gesture の主導権を持たせないでください
- interactive transition を成立させる構造を優先してください
- 見た目だけ似せるのではなく、今後の拡張に耐える設計を重視してください
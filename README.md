# Coffee Bean Explorer 

## 含まれるもの

- `.github/copilot-instructions.md` — GitHub Copilot 共通指示
- `.github/agents/` — Planner / Frontend / Data / QA エージェント
- `.github/prompts/` — 実装・レビュー用プロンプト
- `.github/agents/stripe-demo.agent.md` — Stripe デモ決済担当エージェント
- `.github/prompts/add-stripe-demo-checkout.prompt.md` — デモ購入機能の実装プロンプト
- `.github/instructions/react-jsx.instructions.md` — JSX 専用ルール
- `.vscode/mcp.json` — MUI / amCharts MCP サーバー設定
- `AGENTS.md` — 複数エージェント向け共通ルール
- `CLAUDE.md` — Claude Code 向け入口
- `GEMINI.md` — Gemini 向け入口
- `.cursor/rules/` — Cursor 向けプロジェクトルール

## 導入手順

1. `originsg.json` が実際の地図データのファイル名か確認します。名前が違う場合は、設定内の参照を実ファイル名に合わせてください。
2. VS Code で `.vscode/mcp.json` を開き、必要に応じて MCP サーバーの起動・接続を承認します。
3. Copilot Chat の Agent モードで `Planner` / `Frontend` / `Data` / `QA` を選択して使います（環境の Copilot バージョンにより UI 表記が異なる場合があります）。
4. まず `inspect-project.prompt.md` を使い、既存構成を調べてから実装を始めます。

## MCP 設定について

- MUI: `npx -y @mui/mcp@latest` を stdio で起動する想定です。
- amCharts: `https://mcp.amcharts.com/mcp` を HTTP MCP サーバーとして登録します。
- MCP サーバーの配布方式や設定スキーマは変更されることがあるため、接続エラー時は各サーバーの公式ドキュメントを確認してください。
- この設定は MCP の接続先を登録するもので、アプリ側の地図データや amCharts の可視化を自動実装するものではありません。

## 重要な実装方針

- 既存の技術スタックを最初に調査し、根拠なくフレームワークや依存関係を変更しない。
- `originsg.json` を唯一の地図データの一次ソースとして扱う。スキーマを推測で決めず、実ファイルを読んで確認する。
- 地図上の地点をクリックすると、豆情報のモーダルと豆ポイント加算を連動させる。
- 購入ボタンのクリックでローディング演出を開始し、豆袋がカートに入る体験につなげる。
- ローディング演出はアプリの `light` / `dark` テーマに応じて切り替える。
- 既存コードを確認する前にファイル全体を書き換えない。変更は小さく、検証可能に行う。
- UI の共通操作部品には MUI (`@mui/material`) を使用し、地図描画とアニメーションは既存の amCharts / CSS 実装を維持する。

## UX

Coffee Bean Explorer は、地図上の産地を選びながらコーヒー豆の情報を学べる体験を中心に構成しています。

1. **産地を探す**
   amCharts の世界地図上に、`originsg.json` の実データをもとに産地を表示します。マーカーの大きさはコーヒー生産量に応じて変わり、地図はパンとズームに対応します。
2. **豆の情報を見る**
   産地マーカーをクリックすると、国名、地域、概要、生産量、フレーバーノートなどをモーダルで確認できます。国名の横には FlagCDN の国旗画像を表示し、画像を取得できない場合は国名だけを表示します。
3. **オリジナルブレンドを作る**
   詳細モーダルの「ブレンドに追加」を明示的に選択した豆だけが構成に入ります。CheckoutCard で追加済みの豆を確認・削除できます。
4. **ポイントと金額を確認する**
   選択した豆は 1 件につき 1 point として集計され、購入予定金額は選択数にかかわらず 1,800 円です。
5. **カートへ進む**
   ブレンドが空でない状態で購入ボタンを押すと、現在のライト / ダークテーマに応じたトランジションが一度だけ開始します。演出完了後に構成をカートへ確定し、Stripe Checkout へ進みます。
6. **決済結果を確認する**
   Stripe Checkout 完了後はリダイレクトだけで成功と判断せず、サーバーが Checkout Session の `payment_status` を確認します。成功、キャンセル、エラー、再試行の状態を画面に表示します。
7. **テーマとアクセシビリティ**
   ヘッダーのテーマ切り替えで地図背景と画面配色を変更できます。モーダルはキーボードの `Escape` で閉じられ、国旗画像の読み込み失敗で画面全体が停止しないようにしています。

## app 構造

```text
.
├─ originsg.json              # コーヒー生産国・産地の一次データ
├─ public/images/maps/        # MapRasterSeries が読むライト / ダーク背景画像
├─ server/
│  └─ index.js                # Express サーバーと Stripe Checkout API
└─ src/
   ├─ App.jsx                 # テーマ、ブレンド、カート、トランジション、決済状態の統括
   ├─ main.jsx                # React エントリーポイント、MUI ThemeProvider / CssBaseline
   ├─ muiTheme.js             # MUI の共通タイポグラフィ、形状、ベーススタイル
   ├─ styles.css              # アプリ全体のレイアウト、テーマ、コンポーネントスタイル
   ├─ components/
   │  ├─ Header.jsx           # テーマ切り替え、ポイント、カート表示
   │  ├─ OriginMap.jsx        # amCharts 地図、背景ラスタ、国ポリゴン、産地マーカー
   │  ├─ OriginDetailsModal.jsx # 選択した産地の詳細モーダル
   │  ├─ CountryFlag.jsx      # FlagCDN の国旗画像と読み込み失敗時のフォールバック
   │  ├─ transitions/
   │  │  ├─ BeanTransition.jsx # GSAP / MorphSVG の共通モーフ制御と完了通知
   │  │  ├─ LightBeanTransition.jsx # ライトテーマの SVG 配色
   │  │  ├─ DarkBeanTransition.jsx  # ダークテーマの SVG 配色
   │  │  └─ shapes.json          # 8 シーン分の SVG パスデータ
   │  └─ CheckoutCard.jsx     # ブレンド一覧、削除、ポイント、金額、決済状態
   └─ lib/
      ├─ config.js             # ポイント、換算ルール、地図、ズームなどの名前付き設定
      ├─ blend.js              # ブレンドポイントと購入金額の計算
      └─ origins.js            # データ正規化、座標、生産量表示、国旗 URL 生成
```

### データと状態の流れ

- `originsg.json` を `App.jsx` が読み込み、`normalizeOrigins` で表示用の産地配列にします。
- `OriginMap.jsx` が産地配列を受け取り、座標が存在するレコードだけをマップ上に表示します。
- マーカー選択は `App.jsx` に通知され、選択中の産地を `OriginDetailsModal.jsx` に渡します。
- `OriginDetailsModal.jsx` の追加操作で `blendItems` を更新し、CheckoutCard の削除操作で同じ構成を編集します。
- 購入ボタンで `BeanTransition.jsx` を表示し、完了時に構成を `cartItems` として確定してから Checkout Session を作成します。
- 決済開始時はブラウザーから産地 ID の配列を `/api/checkout-session` に送ります。秘密鍵を持つ `server/index.js` が ID と価格を再検証して Stripe Checkout Session を作成します。
- 決済後は `/api/checkout-status` でサーバーから支払い状態を検証します。

## ローカル実行

```bash
npm install
copy .env.example .env
npm run dev
```

`originsg.json` は元の `oriinsg.json` を正規化した一次データです。地図の地点はこのファイルの実レコードから表示しています。Stripe の購入デモを使う場合は `.env` に Stripe のテスト用秘密鍵（`sk_test_...`）を設定してください。ブラウザーには秘密鍵を渡しません。

Stripe Checkout では公式テストカードを利用できます。成功は `4242 4242 4242 4242`、拒否は `4000 0000 0000 9995` です。成功画面へのリダイレクト後もサーバーが Checkout Session の `payment_status` を確認してから成功表示にします。

## React JSX と Stripe デモ購入

- フロントエンドは React + JavaScript JSX（`.jsx`）を必須とし、TypeScript / `.tsx` は使用しません。
- Stripe のテストモードを使い、Checkout または Elements / Payment Element で購入体験を実装します。
- `sk_test_...` などの秘密鍵はサーバー側の環境変数にのみ保存し、ブラウザーへ渡したり Git にコミットしたりしません。
- クライアントが送る価格・合計額を信用せず、サーバー側で商品と金額を検証します。
- 成功・失敗・キャンセル・通信エラー・再試行を実装し、クライアント側の表示だけで注文を「支払い済み」にしません。
- 成功カード `4242 4242 4242 4242`、拒否テストカード `4000 0000 0000 9995` など、Stripe 公式のテストカードを使います。
- テストカードの詳細は [Stripe Testing（日本語）](https://docs.stripe.com/testing?locale=ja-JP) を参照してください。
- バックエンドがない場合は、実装前に既存構成を確認し、秘密鍵を安全に扱えるサーバー側の決済処理を用意してください。

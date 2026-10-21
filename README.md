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
- 閾値到達時はローディング演出を開始し、豆袋がカートに入る体験につなげる。
- ローディング演出はアプリの `light` / `dark` テーマに応じて切り替える。
- 既存コードを確認する前にファイル全体を書き換えない。変更は小さく、検証可能に行う。

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

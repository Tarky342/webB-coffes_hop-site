# SVG Morph Studio (React 18 + Vite 6 + GSAP MorphSVG)

## 起動

```bash
npm install
npm run dev
```

既存プロジェクトに統合する場合は `npm install gsap @gsap/react` を実行し、`src/MorphStudio.jsx` と `src/shapes.json` を移してコンポーネントを呼び出してください。スタイルは `src/style.css` を参照してください。

## 設計

- アセット1→2: 10個の対応するpathを形状変形。
- アセット3→7: 同じviewBoxの共通パーツ（0〜23とbase）を形状変形。新規・消失パーツはフェードで表示。
- アセット2→3、7→8、8→1: 大きく異なるトポロジー／viewBoxを強引に変形せず、透明度とスケールで接続。
- SVGのCSSクラス依存をなくすため、各pathにfillを展開、polygonをpath化したデータが `shapes.json`。
- 操作: 再生/一時停止、各ステージ移動、速度変更、スクラブ、無限ループ。

## 留意点

原画の構造と形状の意味が異なるパーツを無理に一対一にするとねじれます。共通パーツのキー定義は `shapes.json` の `key` で変更可能です。厳密な意味的対応付けは手動レイヤー設計でさらに調整してください。

GSAPは3.13以降MorphSVGPluginをnpm配布しています。GSAPのライセンスは公式を確認してください。

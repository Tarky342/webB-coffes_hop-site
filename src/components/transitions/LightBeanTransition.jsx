export const LIGHT_MORPH_PALETTE = {
  "#774520": "#9b3e28",
  "#ddd": "#e7d9c8",
  "#cecece": "#d9c8b4",
  "#f4f4f4": "#fffaf2",
  "#999899": "#b28b72",
  "#c6c6c6": "#d7bda1",
  "#a49494": "#b8795f",
  "#5a5b5b": "#725445",
  "#989595": "#a56b52",
  "#cc3130": "#ca5c3c",
  "#767777": "#6d5548",
  "#905b5b": "#a76550",
  "#c2a7a7": "#cf9b83",
  "#887171": "#9a6655"
};

export function LightBeanTransition() {
  return {
    palette: LIGHT_MORPH_PALETTE,
    message: "新しい豆のバッグを準備中…"
  };
}

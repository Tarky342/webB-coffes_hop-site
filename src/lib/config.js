export const APP_CONFIG = {
  score: {
    initialValue: 0,
    awardCondition: "blend-add",
    awardAmount: 1
  },
  pricing: {
    mode: "fixed",
    fixedPrice: 1800,
    currency: "jpy"
  },
  productName: "オリジナルブレンドコーヒー豆"
};

export const MAP_CONFIG = {
  layout: {
    maxWidth: 1280
  },
  dotScale: {
    minRadius: 5,
    maxRadius: 16,
    method: "log"
  },
  dotStyle: {
    color: "#CA5C3C",
    strokeColor: "#FFFFFF",
    strokeWidth: 3
  },
  countryStyle: {
    defaultFill: "#F1F3F2",
    defaultStroke: "#927D69",
    defaultStrokeWidth: 0.7
  },
  geography: {
    excludeAntarctica: true
  },
  initialView: {
    centerLongitude: 20,
    centerLatitude: 5,
    zoomLevel: 1.25
  },
  interaction: {
    dotClickable: true,
    mapPan: true,
    mapZoom: true,
    countryClickable: false,
    backgroundClickable: false
  },
  zoom: {
    minLevel: 1,
    maxLevel: 8,
    maxPanOut: 0
  },
  production: {
    unit: "トン",
    source: "FAOSTAT「Coffee, green, production, t」2024年（Invokely掲載）",
    sourceUrl: "https://invokely.ai/rankings/coffee-production/countries"
  }
};

const ORIGIN_COORDINATES = {
  ET: { latitude: 9.1, longitude: 40.5 },
  BR: { latitude: -14.2, longitude: -51.9 },
  CO: { latitude: 4.6, longitude: -74.1 },
  KE: { latitude: 0.2, longitude: 37.9 },
  ID: { latitude: -2.5, longitude: 118 },
  VN: { latitude: 14, longitude: 108 },
  GT: { latitude: 15.8, longitude: -90.2 },
  CR: { latitude: 9.7, longitude: -84.2 },
  HN: { latitude: 14.1, longitude: -86.2 },
  MX: { latitude: 23.6, longitude: -102.5 }
};

export function normalizeOrigins(data) {
  return Object.values(data).filter(
    (origin) => origin && typeof origin === "object" && origin.id
  );
}

export function getOriginCoordinates(originId) {
  return ORIGIN_COORDINATES[originId] || null;
}

export function getProductionRadius(productionTonnes, origins, sizeConfig) {
  const values = origins
    .map((origin) => origin.productionTonnes)
    .filter((value) => Number.isFinite(value) && value > 0);
  const minProduction = values.length ? Math.min(...values) : 0;
  const maxProduction = Math.max(...values, 0);
  if (!Number.isFinite(productionTonnes) || productionTonnes < 0 || maxProduction <= 0) {
    return sizeConfig.minRadius;
  }
  if (sizeConfig.method !== "log" || maxProduction <= minProduction) {
    return (sizeConfig.minRadius + sizeConfig.maxRadius) / 2;
  }

  const value = Math.log1p(Math.max(0, productionTonnes));
  const min = Math.log1p(Math.max(0, minProduction));
  const max = Math.log1p(Math.max(0, maxProduction));
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return sizeConfig.minRadius + ratio * (sizeConfig.maxRadius - sizeConfig.minRadius);
}

export function formatProduction(origin, productionConfig) {
  if (!Number.isFinite(origin.productionTonnes) || origin.productionTonnes < 0) {
    return "生産量情報なし";
  }
  const estimate = origin.productionEstimated ? "（推計値）" : "";
  return `${origin.productionTonnes.toLocaleString("ja-JP")} ${productionConfig.unit}${estimate} / ${origin.productionYear}年`;
}

export function hasProductionData(origin) {
  return Number.isFinite(origin.productionTonnes) && origin.productionTonnes >= 0;
}

export function getAwardedScore(currentScore, scoreConfig, condition) {
  if (
    condition !== scoreConfig.awardCondition ||
    !Number.isFinite(currentScore) ||
    !Number.isFinite(scoreConfig.awardAmount) ||
    scoreConfig.awardAmount <= 0 ||
    !Number.isFinite(scoreConfig.maxScore) ||
    currentScore >= scoreConfig.maxScore
  ) {
    return currentScore;
  }

  return Math.min(currentScore + scoreConfig.awardAmount, scoreConfig.maxScore);
}

export function formatAltitude(conditions) {
  const altitude = conditions?.altitudeM;
  if (!altitude || (altitude.min == null && altitude.max == null)) {
    return "標高情報はないみたいだ";
  }
  return `${altitude.min ?? "—"}–${altitude.max ?? "—"} m`;
}

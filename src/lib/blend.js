import { APP_CONFIG } from "./config.js";

export function getBlendPoints(items, scoreConfig = APP_CONFIG.score) {
  return items.length * scoreConfig.awardAmount;
}

export function getBlendPrice(points, pricingConfig = APP_CONFIG.pricing) {
  if (!Number.isFinite(points) || points <= 0) return 0;
  if (pricingConfig.mode === "fixed") {
    return pricingConfig.fixedPrice;
  }
  if (pricingConfig.mode === "points-only") {
    return points * pricingConfig.pointPrice;
  }
  return 0;
}

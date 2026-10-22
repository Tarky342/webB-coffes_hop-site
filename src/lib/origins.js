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

export function formatAltitude(conditions) {
  const altitude = conditions?.altitudeM;
  if (!altitude || (altitude.min == null && altitude.max == null)) {
    return "標高情報なし";
  }
  return `${altitude.min ?? "—"}–${altitude.max ?? "—"} m`;
}

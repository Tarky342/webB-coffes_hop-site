export function normalizeOrigins(data) {
  return Object.values(data).filter(
    (origin) => origin && typeof origin === "object" && origin.id
  );
}

export function formatAltitude(conditions) {
  const altitude = conditions?.altitudeM;
  if (!altitude || (altitude.min == null && altitude.max == null)) {
    return "標高情報なし";
  }
  return `${altitude.min ?? "—"}–${altitude.max ?? "—"} m`;
}

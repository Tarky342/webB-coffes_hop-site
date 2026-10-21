const MARKER_POSITIONS = {
  ET: [24, 57], BR: [38, 68], CO: [34, 58], KE: [53, 58], ID: [68, 73],
  VN: [66, 58], GT: [34, 43], CR: [34, 48], HN: [35, 52], MX: [30, 37]
};

export function OriginMap({ origins, onOriginSelect }) {
  return (
    <div className="map-card">
      <div className="section-label"><span>COFFEE ORIGINS</span><span>{origins.length} ORIGINS</span></div>
      <div className="map-surface" aria-label="コーヒー産地マップ">
        <div className="map-grid" />
        {origins.map((origin, index) => {
          const [left, top] = MARKER_POSITIONS[origin.id] || [
            12 + (index * 17) % 76,
            18 + (index * 23) % 62
          ];
          return (
            <button
              key={origin.id}
              className="origin-marker"
              style={{ left: `${left}%`, top: `${top}%` }}
              onClick={() => onOriginSelect(origin)}
              title={`${origin.name}を表示`}
              aria-label={`${origin.name}の詳細を開く`}
            >
              <span />{origin.name}
            </button>
          );
        })}
        {origins.length === 0 && <p className="empty-state">表示できる産地データがありません。</p>}
      </div>
      <p className="map-note">地点を選ぶと、産地の詳細を確認して +1 pt 獲得できます。</p>
    </div>
  );
}

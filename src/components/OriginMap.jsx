import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { APP_CONFIG } from "../lib/config.js";

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

const MAP_BOUNDS = { north: 80, south: -60 };
const MAP_COLORS = {
  light: { land: 0xcbbca9, border: 0x927d69, hover: 0xca5c3c },
  dark: { land: 0x4b514c, border: 0x858b80, hover: 0xd97952 }
};

function getMarkerPosition(origin, index) {
  const coordinates = ORIGIN_COORDINATES[origin.id];
  if (!coordinates) {
    return {
      left: 12 + (index * 17) % 76,
      top: 18 + (index * 23) % 62
    };
  }

  return {
    left: ((coordinates.longitude + 180) / 360) * 100,
    top: ((MAP_BOUNDS.north - coordinates.latitude) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100
  };
}

export function OriginMap({ origins, theme, onOriginSelect }) {
  const chartElement = useRef(null);

  useLayoutEffect(() => {
    if (!chartElement.current) return undefined;
    const colors = MAP_COLORS[theme] || MAP_COLORS.light;

    const root = am5.Root.new(chartElement.current);
    const chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: "rotateX",
      panY: "none",
      projection: am5map.geoMercator(),
      homeGeoPoint: { longitude: 15, latitude: 15 },
      homeZoomLevel: 1.1
    }));
    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow
    }));

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(colors.land),
      fillOpacity: 1,
      stroke: am5.color(colors.border),
      strokeWidth: 0.7,
      tooltipText: "{name}"
    });
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(colors.hover)
    });
    chart.appear(500, 50);

    return () => root.dispose();
  }, [theme]);

  return (
    <div className="map-card">
      <div className="section-label"><span>COFFEE ORIGINS</span><span>{origins.length} ORIGINS</span></div>
      <div className="map-surface" aria-label="コーヒー産地マップ">
        <div ref={chartElement} className="world-map-chart" aria-hidden="true" />
        {origins.map((origin, index) => {
          const { left, top } = getMarkerPosition(origin, index);
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
      <p className="map-note">地点を選ぶと、産地の詳細を確認して +{APP_CONFIG.scorePerOrigin} pt 獲得できます。</p>
    </div>
  );
}

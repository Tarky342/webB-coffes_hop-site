import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { APP_CONFIG } from "../lib/config.js";
import { getOriginCoordinates } from "../lib/origins.js";

const MAP_COLORS = {
  light: { land: 0xcbbca9, border: 0x927d69, hover: 0xca5c3c, text: 0x3f342b },
  dark: { land: 0x4b514c, border: 0x858b80, hover: 0xd97952, text: 0xf1e6d8 }
};

export function OriginMap({ origins, theme, onOriginSelect }) {
  const chartElement = useRef(null);
  const onOriginSelectRef = useRef(onOriginSelect);

  useLayoutEffect(() => {
    onOriginSelectRef.current = onOriginSelect;
  }, [onOriginSelect]);

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

    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {
      latitudeField: "latitude",
      longitudeField: "longitude"
    }));

    pointSeries.bullets.push((bulletRoot, series, dataItem) => {
      const origin = dataItem.dataContext.origin;
      const marker = am5.Container.new(bulletRoot, {
        layout: am5.VerticalLayout.new(bulletRoot, {
          spacing: 7
        }),
        centerX: am5.p50,
        centerY: am5.p50,
        cursorOverStyle: "pointer",
        interactive: true,
        focusable: true,
        role: "button",
        ariaLabel: `${origin.name}の詳細を開く`
      });
      const dot = marker.children.push(am5.Circle.new(bulletRoot, {
        radius: 7,
        fill: am5.color(colors.hover),
        stroke: am5.color(0xffffff),
        strokeWidth: 3,
        interactive: false
      }));
      marker.children.push(am5.Label.new(bulletRoot, {
        text: origin.name,
        fill: am5.color(colors.text),
        centerX: am5.p50,
        fontSize: 11,
        interactive: false
      }));

      marker.events.on("click", () => onOriginSelectRef.current(origin));
      marker.events.on("pointerover", () => dot.animate({
        key: "scale",
        to: 1.4,
        duration: 150
      }));
      marker.events.on("pointerout", () => dot.animate({
        key: "scale",
        to: 1,
        duration: 150
      }));

      return am5.Bullet.new(bulletRoot, { sprite: marker });
    });
    pointSeries.data.setAll(origins.flatMap((origin) => {
      const coordinates = getOriginCoordinates(origin.id);
      return coordinates ? [{ ...coordinates, origin }] : [];
    }));

    chart.appear(500, 50);

    return () => root.dispose();
  }, [origins, theme]);

  return (
    <div className="map-card">
      <div className="section-label"><span>COFFEE ORIGINS</span><span>{origins.length} ORIGINS</span></div>
      <div className="map-surface" aria-label="コーヒー産地マップ">
        <div ref={chartElement} className="world-map-chart" />
        {origins.length === 0 && <p className="empty-state">表示できる産地データがありません。</p>}
      </div>
      <p className="map-note">地点を選ぶと、産地の詳細を確認して +{APP_CONFIG.scorePerOrigin} pt 獲得できます。</p>
    </div>
  );
}

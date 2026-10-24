import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { APP_CONFIG, MAP_CONFIG } from "../lib/config.js";
import {
  formatProduction,
  getOriginCoordinates,
  getProductionRadius
} from "../lib/origins.js";

const MAP_COLORS = {
  light: { land: 0xcbbca9, border: 0x927d69, text: 0x3f342b },
  dark: { land: 0x774b1c, border: 0x858b80, text: 0xf1e6d8 }
};

function toAm5Color(value, fallback) {
  const hex = typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
    ? value.slice(1)
    : fallback;
  return am5.color(Number.parseInt(hex, 16));
}

export function OriginMap({ origins, theme, onOriginSelect }) {
  const surfaceElement = useRef(null);
  const chartElement = useRef(null);
  const onOriginSelectRef = useRef(onOriginSelect);
  const mapBackground = theme === "dark"
    ? "/images/maps/map-background-dark.png"
    : "/images/maps/map-background-light.png";

  useLayoutEffect(() => {
    onOriginSelectRef.current = onOriginSelect;
  }, [onOriginSelect]);

  useLayoutEffect(() => {
    if (!chartElement.current) return undefined;
    const colors = MAP_COLORS[theme] || MAP_COLORS.light;

    const root = am5.Root.new(chartElement.current);
    const chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: MAP_CONFIG.interaction.mapPan ? "translateX" : "none",
      panY: MAP_CONFIG.interaction.mapPan ? "translateY" : "none",
      projection: am5map.geoEquirectangular(),
      homeGeoPoint: {
        longitude: MAP_CONFIG.initialView.centerLongitude,
        latitude: MAP_CONFIG.initialView.centerLatitude
      },
      homeZoomLevel: MAP_CONFIG.initialView.zoomLevel,
      zoomLevel: MAP_CONFIG.initialView.zoomLevel,
      minZoomLevel: MAP_CONFIG.zoom.minLevel,
      maxZoomLevel: MAP_CONFIG.zoom.maxLevel,
      maxPanOut: MAP_CONFIG.zoom.maxPanOut,
      pinchZoom: MAP_CONFIG.interaction.mapZoom,
      wheelX: MAP_CONFIG.interaction.mapZoom ? "zoom" : "none",
      wheelY: MAP_CONFIG.interaction.mapZoom ? "zoom" : "none",
      doubleClickZoom: MAP_CONFIG.interaction.mapZoom,
      boxZoom: "none"
    }));
    chart.series.push(am5map.MapRasterSeries.new(root, {
      // src: mapBackground,
      affectsBounds: true
    }));

    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: MAP_CONFIG.geography.excludeAntarctica ? ["AQ"] : []
    }));

    polygonSeries.mapPolygons.template.setAll({
      templateField: "polygonSettings",
      interactive: MAP_CONFIG.interaction.countryClickable,
      fill: toAm5Color(MAP_CONFIG.countryStyle.defaultFill, colors.land.toString(16)),
      fillOpacity: 1,
      stroke: toAm5Color(MAP_CONFIG.countryStyle.defaultStroke, colors.border.toString(16)),
      strokeWidth: MAP_CONFIG.countryStyle.defaultStrokeWidth,
      tooltipText: ""
    });
    polygonSeries.data.setAll(origins.map((origin) => ({
      id: origin.id,
      polygonSettings: {
        fill: toAm5Color(origin.countryColor, colors.land.toString(16)),
        fillOpacity: 1,
        stroke: toAm5Color(
          MAP_CONFIG.countryStyle.defaultStroke,
          colors.border.toString(16)
        ),
        strokeWidth: MAP_CONFIG.countryStyle.defaultStrokeWidth
      }
    })));

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
        cursorOverStyle: MAP_CONFIG.interaction.dotClickable ? "pointer" : undefined,
        interactive: MAP_CONFIG.interaction.dotClickable,
        focusable: MAP_CONFIG.interaction.dotClickable,
        role: "button",
        ariaLabel: `${origin.name}の詳細を開く。${formatProduction(origin, MAP_CONFIG.production)}`
      });
      const dot = marker.children.push(am5.Circle.new(bulletRoot, {
        radius: getProductionRadius(
          origin.productionTonnes,
          origins,
          MAP_CONFIG.dotScale
        ),
        fill: toAm5Color(origin.dotColor, MAP_CONFIG.dotStyle.color.slice(1)),
        stroke: toAm5Color(
          MAP_CONFIG.dotStyle.strokeColor,
          "FFFFFF"
        ),
        strokeWidth: MAP_CONFIG.dotStyle.strokeWidth,
        interactive: false
      }));
      marker.children.push(am5.Label.new(bulletRoot, {
        text: origin.name,
        fill: am5.color(colors.text),
        centerX: am5.p50,
        fontSize: 11,
        interactive: false
      }));

      if (MAP_CONFIG.interaction.dotClickable) {
        marker.events.on("click", () => onOriginSelectRef.current(origin));
      }

      return am5.Bullet.new(bulletRoot, { sprite: marker });
    });
    pointSeries.data.setAll(origins.flatMap((origin) => {
      const coordinates = getOriginCoordinates(origin.id);
      return coordinates ? [{ ...coordinates, origin }] : [];
    }));

    chart.appear(500, 50);
    return () => {
      root.dispose();
    };
  }, [origins, theme]);

  return (
    <div className="map-card">
      <div className="section-label"><span>COFFEE ORIGINS</span><span>{origins.length} ORIGINS</span></div>
      <div
        ref={surfaceElement}
        className="map-surface"
        aria-label="コーヒー産地マップ"
      >
        <div ref={chartElement} className="world-map-chart" />
        {origins.length === 0 && <p className="empty-state">表示できる産地データがありません。</p>}
      </div>
      <p className="map-note">地点を選ぶと、産地の詳細を確認して +{APP_CONFIG.score.awardAmount} pt 獲得できます。</p>
    </div>
  );
}

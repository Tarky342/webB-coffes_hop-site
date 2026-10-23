import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import scenes from "./shapes.json";
import { DARK_MORPH_PALETTE, DarkBeanTransition } from "./DarkBeanTransition.jsx";
import { LIGHT_MORPH_PALETTE, LightBeanTransition } from "./LightBeanTransition.jsx";

gsap.registerPlugin(MorphSVGPlugin);

const sceneA = scenes.slice(0, 2);
const sceneB = scenes.slice(2, 7);
const sceneC = scenes[7];
const getSlots = (group) => [...new Set(group.flatMap((scene) => scene.shapes.map((shape) => shape.key)))];
const slotsA = getSlots(sceneA);
const slotsB = getSlots(sceneB);
const slotsC = getSlots([sceneC]);

function byKey(scene) {
  return new Map(scene.shapes.map((shape) => [shape.key, shape]));
}

function mapFill(fill, palette) {
  return palette[fill.toLowerCase()] || fill;
}

function SvgLayer({ scene, slots, palette, layerRef }) {
  const shapes = byKey(scene);
  return (
    <svg
      ref={layerRef}
      className="morph-scene"
      viewBox={scene.viewBox}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {slots.map((key) => {
        const shape = shapes.get(key);
        return (
          <path
            key={key}
            data-slot={key}
            d={shape?.d || "M0,0Z"}
            fill={shape ? mapFill(shape.fill, palette) : "none"}
            opacity={shape ? 1 : 0}
          />
        );
      })}
    </svg>
  );
}

function getPaths(svg) {
  return new Map([...svg.querySelectorAll("[data-slot]")].map((element) => [
    element.dataset.slot,
    element
  ]));
}

function buildMorphTimeline({ svgA, svgB, svgC, palette, onComplete }) {
  const pathsA = getPaths(svgA);
  const pathsB = getPaths(svgB);
  const timeline = gsap.timeline({ paused: true, onComplete });
  const ease = "power2.inOut";

  function morph(groupPaths, fromScene, toScene, duration = 1.55) {
    const from = byKey(fromScene);
    const to = byKey(toScene);
    const position = timeline.duration();

    for (const [key, element] of groupPaths) {
      const source = from.get(key);
      const target = to.get(key);
      if (source && target) {
        timeline.to(element, {
          morphSVG: { shape: target.d, map: "position", type: "linear" },
          fill: mapFill(target.fill, palette),
          opacity: 1,
          duration,
          ease
        }, position);
      } else if (source && !target) {
        timeline.to(element, { opacity: 0, duration: duration * 0.45, ease: "power1.inOut" }, position);
      } else if (!source && target) {
        timeline.set(element, {
          attr: { d: target.d },
          fill: mapFill(target.fill, palette),
          opacity: 0
        }, position);
        timeline.to(element, { opacity: 1, duration: duration * 0.55, ease: "power1.out" }, position + duration * 0.4);
      }
    }
    timeline.to({}, { duration }, position);
  }

  gsap.set([svgA, svgB, svgC], { autoAlpha: 0 });
  gsap.set(svgA, { autoAlpha: 1, scale: 1 });
  gsap.set([svgB, svgC], { scale: 0.96 });
  timeline.to({}, { duration: 0.45 });
  morph(pathsA, sceneA[0], sceneA[1], 1.25);

  const bridgeAB = timeline.duration();
  for (const [key, element] of pathsB) {
    const shape = byKey(sceneB[0]).get(key);
    timeline.set(element, shape
      ? { attr: { d: shape.d }, fill: mapFill(shape.fill, palette), opacity: 1 }
      : { opacity: 0 }, bridgeAB);
  }
  timeline.to(svgA, { autoAlpha: 0, scale: 1.045, duration: 0.85, ease }, bridgeAB);
  timeline.to(svgB, { autoAlpha: 1, scale: 1, duration: 0.85, ease }, bridgeAB);

  for (let index = 0; index < 4; index += 1) {
    morph(pathsB, sceneB[index], sceneB[index + 1]);
  }

  const bridgeBC = timeline.duration();
  timeline.to(svgB, { autoAlpha: 0, scale: 1.045, duration: 0.85, ease }, bridgeBC);
  timeline.to(svgC, { autoAlpha: 1, scale: 1, duration: 0.85, ease }, bridgeBC);
  timeline.to({}, { duration: 0.9 });
  timeline.to(svgC, { autoAlpha: 0, scale: 0.96, duration: 0.85, ease });
  timeline.set(svgA, { scale: 0.96 });
  for (const [key, element] of pathsA) {
    const shape = byKey(sceneA[0]).get(key);
    timeline.set(element, { attr: { d: shape.d }, fill: mapFill(shape.fill, palette), opacity: 1 });
  }
  timeline.to(svgA, { autoAlpha: 1, scale: 1, duration: 0.85, ease });
  return timeline;
}

export function BeanTransition({ theme, onComplete }) {
  const stageRef = useRef(null);
  const timelineRef = useRef(null);
  const completeRef = useRef(onComplete);
  const themeTransition = theme === "dark" ? DarkBeanTransition() : LightBeanTransition();
  const palette = theme === "dark" ? DARK_MORPH_PALETTE : LIGHT_MORPH_PALETTE;

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const stage = stageRef.current;
    const layers = stage?.querySelectorAll(".morph-scene");
    if (!stage || !layers || layers.length !== 3) return undefined;

    const [svgA, svgB, svgC] = layers;
    const timeline = buildMorphTimeline({
      svgA,
      svgB,
      svgC,
      palette,
      onComplete: () => completeRef.current()
    });
    timelineRef.current = timeline;
    timeline.timeScale(timeline.duration() / 1.7).play(0);

    return () => {
      timeline.kill();
      timelineRef.current = null;
    };
  }, [theme, palette]);

  return (
    <div ref={stageRef} className={`transition-screen ${theme}`} role="status" aria-live="polite">
      <div className="morph-artboard">
        <SvgLayer scene={sceneA[0]} slots={slotsA} palette={themeTransition.palette} layerRef={null} />
        <SvgLayer scene={sceneB[0]} slots={slotsB} palette={themeTransition.palette} layerRef={null} />
        <SvgLayer scene={sceneC} slots={slotsC} palette={themeTransition.palette} layerRef={null} />
      </div>
      <p>{themeTransition.message}</p>
    </div>
  );
}

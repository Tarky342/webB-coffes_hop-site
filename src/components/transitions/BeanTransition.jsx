import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import scenes from "./shapes.json";
import {
  DARK_MORPH_PALETTE,
  DarkBeanTransition,
} from "./DarkBeanTransition.jsx";
import {
  LIGHT_MORPH_PALETTE,
  LightBeanTransition,
} from "./LightBeanTransition.jsx";
import "./BeanTransition.css";

gsap.registerPlugin(MorphSVGPlugin);

/**
 * One SVG world; the eight source SVGs are reference POSES, not eight slides.
 *
 * #1 -> #2: the nine metal parts only translate by -9.46 in local Y.
 * #2 -> #3: the whole filter is located +180.21 in the machine's SVG world.
 * #3 -> #7: machine path geometry does not change.
 * #7 -> #8: the cup is the SAME cup; the camera pushes in ~2x.
 *
 * The artwork's master viewBox is 0 0 411.2 487.9.
 */
const [asset1, asset2, asset3, asset4, asset5, asset6, asset7] = scenes;
const pick = (scene, key) => {
  const item = scene.shapes.find((shape) => shape.key === key);
  if (!item) throw new Error(`Missing original SVG path ${scene.name}:${key}`);
  return item;
};
const machinePaths = asset3.shapes.filter((shape) => {
  const n = Number(shape.key);
  return Number.isInteger(n) && n >= 1 && n <= 11;
});
const filterHardwarePaths = asset1.shapes.filter((shape) => shape.key !== "0");

const FILTER_IN_WORLD_Y = 180.21;
const TAMP_Y = -9.46;
const CENTER = { x: 205.6, y: 243.95 };
const INTRO_VIEW = cameraFor(1.62, 95, 258);
const HERO_VIEW = cameraFor(2.04, 185, 331);
const LIGHT_PALETTE = {
  ...LIGHT_MORPH_PALETTE,
  "#c87e4c": "#c87e4c",
};
const DARK_PALETTE = {
  ...DARK_MORPH_PALETTE,
  "#c87e4c": "#b97951",
};
const DEFAULT_DURATION_MS = 7200;

function cameraFor(scale, focusX, focusY) {
  return {
    x: CENTER.x - focusX * scale,
    y: CENTER.y - focusY * scale,
    scale,
  };
}

function Shape({ shape, palette, ...rest }) {
  return (
    <path
      d={shape.d}
      fill={palette[shape.fill.toLowerCase()] ?? shape.fill}
      {...rest}
    />
  );
}

function buildBeanTimeline(svg, palette, { onComplete, onPhaseChange, reduced }) {
  const el = (name) => {
    const node = svg.querySelector(`[data-piece="${name}"]`);
    if (!node) throw new Error(`BeanTransition: data-piece=${name} missing`);
    return node;
  };
  const camera = el("camera");
  const machineRig = el("machine-rig");
  const machine = el("machine");
  const portafilter = el("portafilter");
  const hardware = el("filter-hardware");
  const grounds = el("coffee-grounds");
  const cup = el("cup");
  const cupShadow = el("cup-shadow");
  const coffee = el("coffee-surface");
  const streamLeft = el("stream-left");
  const streamRight = el("stream-right");
  const streams = [streamLeft, streamRight];

  // Establish first frame explicitly. GSAP's context reverts everything on unmount,
  // including React StrictMode remounts and theme changes.
  gsap.set(camera, { ...INTRO_VIEW, transformOrigin: "0 0" });
  gsap.set(machineRig, { opacity: 1, y: 0 });
  gsap.set(machine, { opacity: 0 });
  gsap.set(portafilter, {
    x: -32,
    y: 34,
    rotation: -9,
    transformOrigin: "62% 55%",
  });
  gsap.set(hardware, { y: 0 });
  gsap.set(cupShadow, { opacity: 0 });
  gsap.set(cup, {
    opacity: 0,
    y: 27,
    scale: 0.94,
    transformOrigin: "50% 35%",
  });
  gsap.set(streams, {
    opacity: 0,
    scaleY: 0.03,
    transformOrigin: "50% 0%",
  });
  gsap.set(coffee, { opacity: 0, scaleY: 0.65, transformOrigin: "50% 100%" });

  // Accessibility: no zoom, movement or oscillation if OS requests reduced motion.
  // The final pose displays the same cup; completion still fires for the host app.
  if (reduced) {
    gsap.set(camera, HERO_VIEW);
    gsap.set(machineRig, { opacity: 0 });
    gsap.set(cupShadow, { opacity: 1 });
    gsap.set(cup, { opacity: 1, y: 0, scale: 1 });
    gsap.set(coffee, {
      attr: { d: pick(asset7, "detail-6-24").d },
      opacity: 1,
      scaleY: 1,
    });
    return gsap.delayedCall(0.06, onComplete);
  }

  const tl = gsap.timeline({ paused: true, onComplete });
  const cue = (name, at) => {
    tl.addLabel(name, at);
    if (onPhaseChange) tl.call(() => onPhaseChange(name), null, at);
  };

  // ACT I: tamp. The geometry in artwork #1 and #2 has a shared coordinate
  // system; metal parts move rigidly while ONLY the mound is morphed flat.
  cue("tamp", 0);
  tl.to(hardware, {
    y: TAMP_Y,
    duration: 0.85,
    ease: "power2.inOut",
  }, 0.20);
  tl.to(grounds, {
    morphSVG: {
      shape: pick(asset2, "0").d,
      map: "position",
      type: "linear",
    },
    duration: 0.85,
    ease: "power2.inOut",
  }, 0.20);
  // Small release after compression: this precedes the insertion movement.
  tl.to(portafilter, { y: 41, duration: 0.24, ease: "sine.out" }, 1.04);

  // ACT II: the world is revealed by the camera, then the SAME portafilter
  // travels to the socket and twists into its exact source-artwork position.
  cue("lock", 1.20);
  tl.to(camera, {
    x: 0, y: 0, scale: 1,
    duration: 1.57,
    ease: "power2.inOut",
  }, 1.18);
  tl.to(machine, {
    opacity: 1,
    duration: 1.10,
    ease: "sine.inOut",
  }, 1.28);
  tl.to(portafilter, {
    x: -8,
    y: 5,
    rotation: -8,
    duration: 0.77,
    ease: "power2.inOut",
  }, 1.65);
  tl.to(portafilter, {
    x: 0,
    y: 0,
    rotation: 0,
    duration: 0.39,
    ease: "power2.out",
  }, 2.42);
  // Brown puck changes to the metal-toned head hidden inside the socket.
  tl.to(grounds, {
    fill: palette["#ddd"] ?? "#ddd",
    duration: 0.38,
    ease: "sine.inOut",
  }, 2.32);

  // ACT III: the cup has its own independent Z layer, so it remains onscreen
  // even when the machine rig leaves at the end.
  cue("cup", 2.70);
  tl.to(cupShadow, {
    opacity: 1,
    duration: 0.42,
    ease: "sine.out",
  }, 2.78);
  tl.to(cup, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.78,
    ease: "power3.out",
  }, 2.77);

  // ACT IV: start two separate espresso streams slightly out of phase.
  // The cup doesn't swap SVGs. The surface evolves from source #6 to #7.
  cue("extract", 3.72);
  tl.to(streamLeft, {
    opacity: 1,
    scaleY: 1,
    duration: 0.37,
    ease: "power2.in",
  }, 3.76);
  tl.to(streamRight, {
    opacity: 1,
    scaleY: 1,
    duration: 0.39,
    ease: "power2.in",
  }, 3.88);
  tl.to(coffee, {
    opacity: 1,
    scaleY: 1,
    duration: 0.64,
    ease: "sine.out",
  }, 4.05);
  tl.to(coffee, {
    morphSVG: {
      shape: pick(asset7, "detail-6-24").d,
      map: "position",
      type: "linear",
    },
    duration: 0.78,
    ease: "sine.inOut",
  }, 4.54);
  tl.to(streamLeft, {
    morphSVG: {
      shape: pick(asset6, "detail-5-24").d,
      map: "position",
      type: "linear",
    },
    duration: 0.46,
    ease: "sine.inOut",
  }, 4.88);
  tl.to(streamRight, {
    morphSVG: {
      shape: pick(asset6, "detail-5-25").d,
      map: "position",
      type: "linear",
    },
    duration: 0.46,
    ease: "sine.inOut",
  }, 4.88);
  tl.to(streams, {
    opacity: 0,
    scaleY: 0.16,
    duration: 0.41,
    ease: "power2.inOut",
  }, 5.28);

  // ACT V: camera maintains continuity of the cup. The upper assembly
  // gently retreats (not a new SVG or a hard cut), leaving just the cup.
  cue("hero", 5.70);
  tl.to(camera, {
    ...HERO_VIEW,
    duration: 1.34,
    ease: "power3.inOut",
  }, 5.73);
  tl.to(machineRig, {
    y: -53,
    opacity: 0,
    duration: 1.17,
    ease: "power2.inOut",
  }, 5.76);
  tl.to({}, { duration: 0.19 }, 7.07); // The last frame is held on purpose.

  return tl;
}

/**
 * @param {Object} props
 * @param {"light"|"dark"} [props.theme="light"]
 * @param {() => void} [props.onComplete]
 * @param {(phase: "tamp"|"lock"|"cup"|"extract"|"hero") => void} [props.onPhaseChange]
 * @param {number} [props.duration=7200] Full duration in milliseconds
 */
export function BeanTransition({
  theme = "light",
  onComplete,
  onPhaseChange,
  duration = DEFAULT_DURATION_MS,
}) {
  const artboardRef = useRef(null);
  const callbacksRef = useRef({ onComplete, onPhaseChange });
  callbacksRef.current = { onComplete, onPhaseChange };
  const dark = theme === "dark";
  const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;
  const message = dark ? DarkBeanTransition().message : LightBeanTransition().message;

  useLayoutEffect(() => {
    const svg = artboardRef.current;
    if (!svg) return undefined;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const seconds = Number.isFinite(duration) && duration > 0
      ? Math.max(0.1, duration / 1000)
      : DEFAULT_DURATION_MS / 1000;

    const ctx = gsap.context(() => {
      const tween = buildBeanTimeline(svg, palette, {
        reduced,
        onComplete: () => callbacksRef.current.onComplete?.(),
        onPhaseChange: (phase) => callbacksRef.current.onPhaseChange?.(phase),
      });
      if (!reduced) {
        tween.timeScale(tween.duration() / seconds).play(0);
      }
    }, svg);

    return () => ctx.revert();
  }, [theme, palette, duration]);

  return (
    <div className={`transition-screen ${dark ? "dark" : "light"}`} role="status" aria-live="polite">
      <div className="morph-artboard">
        <svg
          className="morph-scene"
          ref={artboardRef}
          viewBox={asset3.viewBox}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
          <g data-piece="camera">
            <Shape shape={pick(asset3, "0")} palette={palette} data-piece="cup-shadow" />

            <g data-piece="machine-rig">
              <g data-piece="machine">
                {machinePaths.map((shape) => (
                  <Shape key={shape.key} shape={shape} palette={palette} />
                ))}
              </g>

              <g transform={`translate(0 ${FILTER_IN_WORLD_Y})`}>
                <g data-piece="portafilter">
                  <Shape shape={pick(asset1, "0")} palette={palette} data-piece="coffee-grounds" />
                  <g data-piece="filter-hardware">
                    {filterHardwarePaths.map((shape) => (
                      <Shape key={shape.key} shape={shape} palette={palette} />
                    ))}
                  </g>
                </g>
              </g>

              <Shape
                shape={pick(asset5, "detail-4-24")}
                palette={palette}
                data-piece="stream-left"
              />
              <Shape
                shape={pick(asset5, "detail-4-25")}
                palette={palette}
                data-piece="stream-right"
              />
            </g>

            <g data-piece="cup">
              <Shape shape={pick(asset4, "22")} palette={palette} />
              <Shape shape={pick(asset4, "23")} palette={palette} />
              <Shape
                shape={pick(asset6, "detail-5-26")}
                palette={palette}
                data-piece="coffee-surface"
              />
              <Shape shape={pick(asset4, "base")} palette={palette} />
            </g>
          </g>
        </svg>
      </div>
      <p>{message}</p>
    </div>
  );
}

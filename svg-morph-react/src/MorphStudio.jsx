import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { useGSAP } from '@gsap/react';
import scenes from './shapes.json';

gsap.registerPlugin(MorphSVGPlugin, useGSAP);

const BEATS = [0, 1, 2, 3, 4, 5, 6, 7];
const sceneA = scenes.slice(0, 2);
const sceneB = scenes.slice(2, 7);
const sceneC = scenes[7];
const getSlots = (group) => [...new Set(group.flatMap(s => s.shapes.map(p => p.key)))];
const slotsA = getSlots(sceneA);
const slotsB = getSlots(sceneB);
const slotsC = getSlots([sceneC]);
const byKey = (scene) => new Map(scene.shapes.map(p => [p.key, p]));

function SvgLayer({ scene, slots, layerRef }) {
  const shapes = byKey(scene);
  return (
    <svg ref={layerRef} className="scene" viewBox={scene.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {slots.map(key => {
        const p = shapes.get(key);
        return <path key={key} data-slot={key} d={p?.d ?? 'M0,0Z'} fill={p?.fill ?? '#888'} opacity={p ? 1 : 0} />;
      })}
    </svg>
  );
}

export default function MorphStudio() {
  const stage = useRef(null);
  const aRef = useRef(null);
  const bRef = useRef(null);
  const cRef = useRef(null);
  const timeline = useRef(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  useGSAP(() => {
    const svgA = aRef.current, svgB = bRef.current, svgC = cRef.current;
    const getPaths = (svg) => new Map([...svg.querySelectorAll('[data-slot]')].map(el => [el.dataset.slot, el]));
    const pathsA = getPaths(svgA), pathsB = getPaths(svgB);
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, paused: true,
      onUpdate() { setProgress(tl.progress()); },
      onRepeat() { setActive(0); }
    });
    const ease = 'power2.inOut';
    // Existing paths stay in place; new details fade in from zero opacity.
    function morph(groupPaths, fromScene, toScene, duration = 1.55) {
      const from = byKey(fromScene), to = byKey(toScene);
      const position = tl.duration();
      for (const [key, el] of groupPaths) {
        const source = from.get(key), target = to.get(key);
        if (source && target) {
          tl.to(el, {
            morphSVG: { shape: target.d, map: 'position', type: 'linear' },
            fill: target.fill, opacity: 1, duration, ease
          }, position);
        } else if (source && !target) {
          tl.to(el, { opacity: 0, duration: duration * 0.45, ease: 'power1.inOut' }, position);
        } else if (!source && target) {
          // Insert target path while hidden, then reveal it. Avoid shape explosions.
          tl.set(el, { attr: { d: target.d }, fill: target.fill, opacity: 0 }, position);
          tl.to(el, { opacity: 1, duration: duration * 0.55, ease: 'power1.out' }, position + duration * 0.4);
        }
      }
      tl.to({}, { duration }, position); // Ensure stage duration even if paths don't change.
    }
    function mark(index) { tl.call(() => setActive(index)); }
    // Initial visible scene (important for StrictMode re-mounts).
    gsap.set([svgA, svgB, svgC], { autoAlpha: 0 });
    gsap.set(svgA, { autoAlpha: 1, scale: 1 });
    gsap.set([svgB, svgC], { scale: 0.96 });
    tl.addLabel('stage0');
    tl.to({}, { duration: 0.45 });
    morph(pathsA, sceneA[0], sceneA[1], 1.25);
    mark(1);tl.addLabel('stage1');
    tl.to({}, { duration: 0.35 });
    // Different aspect ratio and topology: crossfade, not a destructive path morph.
    // Restore the B layer while hidden before each repeated loop.
    for (const [key, el] of pathsB) {
      const p = byKey(sceneB[0]).get(key);
      tl.set(el, p
        ? { attr: { d: p.d }, fill: p.fill, opacity: 1 }
        : { opacity: 0 }, 'bridgeAB');
    }
    tl.to(svgA, { autoAlpha: 0, scale: 1.045, duration: 0.85, ease }, 'bridgeAB');
    tl.to(svgB, { autoAlpha: 1, scale: 1, duration: 0.85, ease }, 'bridgeAB');
    mark(2);tl.addLabel('stage2');
    tl.to({}, { duration: 0.3 });
    for (let i = 0; i < 4; i++) {
      morph(pathsB, sceneB[i], sceneB[i + 1]);
      mark(i + 3);tl.addLabel('stage' + (i + 3));
      tl.to({}, { duration: 0.35 });
    }
    tl.to(svgB, { autoAlpha: 0, scale: 1.045, duration: 0.85, ease }, 'bridgeBC');
    tl.to(svgC, { autoAlpha: 1, scale: 1, duration: 0.85, ease }, 'bridgeBC');
    mark(7);tl.addLabel('stage7');
    tl.to({}, { duration: 0.9 });
    tl.to(svgC, { autoAlpha: 0, scale: 0.96, duration: 0.85, ease }, 'return');
    // Reset layer A to first shape while invisible, before returning.
    tl.set(svgA, { scale: 0.96 }, 'return');
    for (const [key, el] of pathsA) {
      const p = byKey(sceneA[0]).get(key);
      tl.set(el, { attr: { d: p.d }, fill: p.fill, opacity: 1 }, 'return');
    }
    tl.to(svgA, { autoAlpha: 1, scale: 1, duration: 0.85, ease }, 'return');
    timeline.current = tl;
    tl.timeScale(speed).play(0);
    return () => { tl.kill(); timeline.current = null; };
  }, { scope: stage });

  const jump = (i) => {
    const tl = timeline.current;
    if (!tl) return;
    tl.pause();
    tl.seek('stage' + i, false);
    setActive(i);
    setPlaying(false);
  };
  const toggle = () => {
    const tl = timeline.current;
    if (!tl) return;
    if (tl.paused()) { tl.play(); setPlaying(true); }
    else { tl.pause(); setPlaying(false); }
  };
  const changeSpeed = (v) => { setSpeed(v); timeline.current?.timeScale(v); };

  return (
    <main className="app">
      <header><span className="eyebrow">VECTOR MOTION / GSAP</span><h1>SVG Morph Studio</h1><p>8つのSVGを、形状変形と自然なシーン遷移で接続</p></header>
      <section ref={stage} className="stage" aria-label="SVGモーフィングプレビュー">
        <div className="artboard"><SvgLayer scene={sceneA[0]} slots={slotsA} layerRef={aRef}/><SvgLayer scene={sceneB[0]} slots={slotsB} layerRef={bRef}/><SvgLayer scene={sceneC} slots={slotsC} layerRef={cRef}/></div>
        <div className="scene-counter">FRAME {String(active+1).padStart(2,'0')} / 08</div>
      </section>
      <div className="controls">
        <div className="button-row"><button onClick={() => jump((active+7)%8)}>← 前へ</button><button className="primary" onClick={toggle}>{playing ? '一時停止' : '再生'}</button><button onClick={() => jump((active+1)%8)}>次へ →</button></div>
        <label className="progress-label">タイムライン <span>{Math.round(progress*100)}%</span></label>
        <input aria-label="タイムライン位置" type="range" min="0" max="1" step="0.001" value={progress} onChange={e => { const tl=timeline.current; if(!tl)return;tl.pause();tl.progress(Number(e.target.value));setPlaying(false); }} />
        <label className="speed">再生速度 <select value={speed} onChange={e=>changeSpeed(Number(e.target.value))}><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label>
        <div className="frames">{BEATS.map(i=><button key={i} className={i===active?'selected':''} onClick={()=>jump(i)}>{i+1}</button>)}</div>
      </div>
      <footer>Frame 1–2 / 3–7: パス単位のモーフィング　・　2→3 / 7→8 / 8→1: アスペクト比を保ったシーン遷移</footer>
    </main>
  );
}

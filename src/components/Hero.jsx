import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroScene from '../three/HeroScene';
import { useReducedMotion, useViewportActive } from '../hooks';
import { RESUME, SOCIALS } from '../data/content';

export default function Hero() {
  const reduced = useReducedMotion();
  const [sectionRef, active] = useViewportActive('200px');
  const stateRef = useRef(null);
  const ptsRef = useRef(null);

  return (
    <section className="hero" aria-label="Intro" ref={sectionRef} id="top">
      <Canvas
        className="hero-canvas"
        shadows
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 40, near: 0.1, far: 200, position: [6, 3.4, 9] }}
      >
        <HeroScene reduced={reduced} hud={{ state: stateRef, pts: ptsRef }} />
      </Canvas>

      <div className="hero__status fade-in" aria-hidden="true">
        <div><b>CELL</b> EVA-2.0 · <span className="ok">ONLINE</span></div>
        <div><b>MODE</b> AUTO · <b>TOL</b> &lt;1.0 MM</div>
        <div><b>SCAN</b> <span ref={stateRef}>READY</span> · <span ref={ptsRef}>0</span> PTS</div>
        <div><b>OPERATOR</b> DINMUKHAMET MURAT</div>
      </div>

      <p className="hero__eyebrow fade-in">Robotics · 3D Perception · Motion Planning · Real Steel</p>

      <h1 className="hero__name" aria-label="Dinmukhamet Murat">
        <span className="row rise"><span>DINMUKHAMET</span></span>
        <span className="row row--ghost rise"><span>MURAT</span></span>
      </h1>

      <div className="hero__sub">
        <p className="hero__role fade-in">
          I turn noisy real-world 3D scans into <em>sub-millimetre, decision-ready geometry</em> — and
          into robot motion that ships on production welding cells.
        </p>
        <div className="hero__actions fade-in">
          <a className="btn btn--solid" href="#work">View work ↓</a>
          <a className="btn" href={RESUME} target="_blank" rel="noopener">Résumé PDF</a>
        </div>
      </div>

      <div className="hero__deck fade-in">
        <span>43.2384° N · 76.8897° E — ALMATY, KZ · OPEN TO RELOCATION</span>
        <span className="links">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
              {s.label}
            </a>
          ))}
        </span>
      </div>
    </section>
  );
}

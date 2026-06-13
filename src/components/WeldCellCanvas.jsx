import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import WeldCellScene from '../three/WeldCellScene';
import { useReducedMotion, useViewportActive, isShot } from '../hooks';

function Loading() {
  return <Html center><span className="cell__loading">ACQUIRING SCAN…</span></Html>;
}

/* The ABB weld-cell as a self-contained WebGL layer. Used full-bleed behind the
   contact CTA. Pauses its render loop when off-screen; one static freeze frame
   under reduced-motion / ?shot. */
export default function WeldCellCanvas({ className = '', framing = 'background', hud }) {
  const reduced = useReducedMotion();
  const [ref, active] = useViewportActive('300px');
  const staticMode = reduced || isShot();
  const mode = staticMode ? 'static' : 'live';
  const frameloop = staticMode ? 'demand' : active ? 'always' : 'never';

  return (
    <div className={className} ref={ref} aria-hidden="true">
      <Canvas
        shadows
        frameloop={frameloop}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 38, near: 0.1, far: 60, position: [-1.6, 2.05, 6.2] }}
      >
        <fog attach="fog" args={[0x0e0e11, 10, 22]} />
        <Suspense fallback={<Loading />}>
          <WeldCellScene mode={mode} framing={framing} hud={hud} />
        </Suspense>
      </Canvas>
    </div>
  );
}

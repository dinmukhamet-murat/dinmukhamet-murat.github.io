import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildWeldment, scanMaterial } from './weldment';
import { usePointerParallax } from '../hooks';

const SWEEP = 5.2, HOLD = 1.9, CYCLE = SWEEP + HOLD;

// scratch vectors reused every frame (no per-frame allocation)
const _eye = new THREE.Vector3(), _tgt = new THREE.Vector3();
const _fwd = new THREE.Vector3(), _right = new THREE.Vector3(), _up = new THREE.Vector3();
const _UP = new THREE.Vector3(0, 1, 0);

function frameFor(w) {
  // Fixed 3/4 camera; the part fills the full-height canvas. Dials:
  //   dist → SIZE (smaller = bigger) · offX → right(+)/left(−) ·
  //   aimY → VERTICAL: camera looks higher ⇒ part sits LOWER on screen, with NO
  //          size change (the part stays at the origin; only the camera re-aims).
  return w < 760
    ? { orbit: 0.62, dist: 9.5, hgt: 3.4, aimY: 0.35, offX: 0.4, offY: 0 }
    : { orbit: 0.60, dist: 9.5, hgt: 3.3, aimY: 0.4, offX: 2.6, offY: 0 };
}

export default function HeroScene({ reduced, hud }) {
  const { camera, gl } = useThree();
  const pointer = usePointerParallax(!reduced);
  const jit = useRef({ x: 0, y: 0 });
  const started = useRef(performance.now());
  const lastHud = useRef(0);
  const lastState = useRef(-1);
  const turntable = useRef(null);
  const laserRef = useRef(null);

  // palette from the live CSS tokens (azure accent + cyan laser)
  const C_LASER = useMemo(() => {
    const s = getComputedStyle(document.documentElement).getPropertyValue('--laser').trim();
    return new THREE.Color(s || '#6fd0ff');
  }, []);
  const C_BEAM = useMemo(() => {
    const s = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    return new THREE.Color(s || '#25a8ff');
  }, []);

  const W = useMemo(() => buildWeldment(), []);
  const mat = useMemo(() => scanMaterial({ dim: C_LASER.getHex(), hot: 0xbfe8ff, size: 0.62, baseA: 0.85 }), []);
  const laserMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: C_BEAM.clone() }, uA: { value: 0 } },
        vertexShader: 'varying vec2 vU; void main(){ vU=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        // a thin laser line, not a big glow
        fragmentShader:
          'precision mediump float; uniform vec3 uColor; uniform float uA; varying vec2 vU;' +
          'void main(){ float core=exp(-pow((vU.x-0.5)/0.022,2.0)); float amb=smoothstep(0.0,0.5,vU.x)*smoothstep(1.0,0.5,vU.x)*0.04; gl_FragColor=vec4(uColor,(core+amb)*uA);}',
      }),
    []
  );

  const setHud = (frontier) => {
    if (!hud) return;
    if (hud.pts.current) hud.pts.current.textContent = Math.round(W.total * Math.min(frontier, 1)).toLocaleString();
    if (hud.state.current) {
      const s = frontier >= 0.999 ? 2 : frontier > 0.001 ? 1 : 0;
      if (s !== lastState.current) { lastState.current = s; hud.state.current.textContent = ['READY', 'SWEEPING', 'REGISTERED'][s]; }
    }
  };

  const applyCam = (f, jx, jy) => {
    // 1) fixed 3/4 camera aimed at (0, aimY, 0)
    _eye.set(Math.cos(f.orbit) * f.dist, f.hgt, Math.sin(f.orbit) * f.dist);
    _tgt.set(0, f.aimY, 0);
    camera.position.copy(_eye);
    camera.lookAt(_tgt);
    // 2) screen-plane axes (right/up) in world space
    _fwd.copy(_tgt).sub(_eye).normalize();
    _right.copy(_fwd).cross(_UP).normalize();
    _up.copy(_right).cross(_fwd).normalize();
    // 3) slide the PART in the screen plane → constant size, exact placement.
    //    parallax adds a gentle nudge.
    if (turntable.current) {
      const ox = f.offX + jx * 0.12, oy = f.offY + jy * 0.1;
      turntable.current.position.copy(_right).multiplyScalar(ox).addScaledVector(_up, oy);
    }
  };

  useFrame(() => {
    const f = frameFor(window.innerWidth);
    if (reduced) {
      mat.uniforms.uFrontier.value = 1; laserMat.uniforms.uA.value = 0;
      if (turntable.current) turntable.current.rotation.y = 0.45;
      applyCam(f, 0, 0); setHud(1);
      return;
    }
    const t = (performance.now() - started.current) * 0.001;
    // fade out as the hero scrolls away
    const rect = gl.domElement.getBoundingClientRect();
    const vis = Math.min(Math.max(rect.bottom / (window.innerHeight * 0.55), 0), 1);
    gl.domElement.style.opacity = vis.toFixed(3);

    const p = t % CYCLE;
    const frontier = p < SWEEP ? p / SWEEP : 1;
    mat.uniforms.uFrontier.value = frontier;
    mat.uniforms.uTime.value = t;

    jit.current.x += (pointer.current.x - jit.current.x) * 0.05;
    jit.current.y += (pointer.current.y - jit.current.y) * 0.05;
    if (turntable.current) turntable.current.rotation.y = t * 0.16 + 0.3;

    // laser rides the sweep frontier in local X
    if (laserRef.current) laserRef.current.position.x = W.minX + frontier * W.spanX;
    const active = frontier > 0.001 && frontier < 0.999;
    laserMat.uniforms.uA.value = active ? 0.38 : 0.0;

    applyCam(f, jit.current.x, jit.current.y);
    if (t - lastHud.current > 0.12) { setHud(frontier); lastHud.current = t; }
  });

  return (
    <group rotation={[0, 0, 0]}>
      <hemisphereLight args={[0x9fb4d6, 0x07090d, 0.72]} />
      <directionalLight
        position={[6, 11, 7]} intensity={1.3} color={0xeaf0fb}
        castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-7, 4, -6]} intensity={0.6} color={0x2a4a6a} />

      {/* turntable: the shaded part + its captured point cloud + laser sheet */}
      <group ref={turntable}>
        <primitive object={W.group} />
        <points geometry={W.pointsGeo} material={mat} />
        <mesh ref={laserRef} rotation={[0, Math.PI / 2, 0]} position={[0, W.laserY, 0]} material={laserMat}>
          <planeGeometry args={[W.laserD, W.laserH]} />
        </mesh>
      </group>

      {/* shadow-catching floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, W.floorY, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
    </group>
  );
}

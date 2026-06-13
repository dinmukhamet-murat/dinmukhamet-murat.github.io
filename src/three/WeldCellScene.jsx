import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import {
  URDF67, URDF26, buildSkeleton, applyQ, computePoses, sceneAt, ease,
  BEAM, R67_BASE, R26_BASE, R26_ROTY, TABLE_POS, PLATE_TABLE, PLATE_BEAM, PLATE_H,
  SEAM_Y, SEAM_Z, SEAM_X1, SEAM_X2, MAGNET_TIP, TORCH_TIP, WELD_FREEZE,
} from './robot';
import { usePointerParallax } from '../hooks';

const FILES_67 = ['base_link', 'link_1', 'link_2', 'link_3', 'link_4', 'link_5', 'link_6', 'cylinder', 'piston'];
const FILES_26 = ['base_link', 'link_1', 'link_2', 'link_3', 'link_4', 'link_5', 'link_6'];
const URLS = [
  ...FILES_67.map((n) => `${URDF67.dir}${n}.stl`),
  ...FILES_26.map((n) => `${URDF26.dir}${n}.stl`),
];

function buildCell(geos) {
  const get67 = (n) => geos[FILES_67.indexOf(n)];
  const get26 = (n) => geos[FILES_67.length + FILES_26.indexOf(n)];

  const root = new THREE.Group();

  const M = {
    abbOrange: new THREE.MeshStandardMaterial({ color: 0xe35205, roughness: 0.52, metalness: 0.25 }),
    abbDark: new THREE.MeshStandardMaterial({ color: 0x232327, roughness: 0.6, metalness: 0.45 }),
    steel: new THREE.MeshStandardMaterial({ color: 0x6f7278, roughness: 0.45, metalness: 0.75 }),
    steelDark: new THREE.MeshStandardMaterial({ color: 0x3a3c41, roughness: 0.55, metalness: 0.6 }),
    plate: new THREE.MeshStandardMaterial({ color: 0x8a8d93, roughness: 0.4, metalness: 0.8 }),
    floor: new THREE.MeshStandardMaterial({ color: 0x121214, roughness: 0.95, metalness: 0.05 }),
    bead: new THREE.MeshStandardMaterial({ color: 0x3a3c41, roughness: 0.5, metalness: 0.5, emissive: 0xff6a00, emissiveIntensity: 0 }),
  };

  // lights
  root.add(new THREE.HemisphereLight(0x9aa3b5, 0x14110c, 0.62));
  const key = new THREE.DirectionalLight(0xfff1e0, 1.05);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -5; key.shadow.camera.right = 5; key.shadow.camera.top = 6; key.shadow.camera.bottom = -2;
  key.shadow.bias = -0.0004;
  root.add(key);
  const rim = new THREE.DirectionalLight(0x41b9ff, 0.35); rim.position.set(-6, 3, -4); root.add(rim);
  const arcLight = new THREE.PointLight(0x7fc4ff, 0, 4, 2); root.add(arcLight);

  // floor + grid
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 24), M.floor);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; root.add(floor);
  const grid = new THREE.GridHelper(24, 48, 0x2a2a2e, 0x1d1d21); grid.position.y = 0.001; root.add(grid);

  // H-beam on stands
  function hBeamGeo(len, h, w, tf, tw) {
    const s = new THREE.Shape();
    const hw = w / 2, hh = h / 2, hwb = tw / 2;
    s.moveTo(-hw, -hh); s.lineTo(hw, -hh); s.lineTo(hw, -hh + tf);
    s.lineTo(hwb, -hh + tf); s.lineTo(hwb, hh - tf); s.lineTo(hw, hh - tf);
    s.lineTo(hw, hh); s.lineTo(-hw, hh); s.lineTo(-hw, hh - tf);
    s.lineTo(-hwb, hh - tf); s.lineTo(-hwb, -hh + tf); s.lineTo(-hw, -hh + tf);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false });
    g.rotateY(Math.PI / 2); g.translate(-len / 2, 0, 0);
    return g;
  }
  const beamMesh = new THREE.Mesh(hBeamGeo(BEAM.len, BEAM.h, 0.4, 0.045, 0.04), M.steel);
  beamMesh.position.set(BEAM.x, BEAM.top - BEAM.h / 2, 0);
  beamMesh.castShadow = beamMesh.receiveShadow = true; root.add(beamMesh);
  [-1.95, 0.45].forEach((x) => {
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.22, BEAM.top - BEAM.h, 0.5), M.steelDark);
    stand.position.set(x, (BEAM.top - BEAM.h) / 2, 0); stand.castShadow = stand.receiveShadow = true; root.add(stand);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.7), M.steelDark);
    foot.position.set(x, 0.02, 0); foot.receiveShadow = true; root.add(foot);
  });

  // pickup table
  const table = new THREE.Group();
  const tTop = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.7), M.steelDark);
  tTop.position.y = 0.6; tTop.castShadow = tTop.receiveShadow = true; table.add(tTop);
  [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].forEach((p) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), M.steelDark);
    leg.position.set(p[0], 0.3, p[1]); leg.castShadow = true; table.add(leg);
  });
  table.position.copy(TABLE_POS); root.add(table);

  // the part + weld bead
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.5, PLATE_H, 0.3), M.plate);
  plate.castShadow = plate.receiveShadow = true; plate.position.copy(PLATE_TABLE); root.add(plate);
  const bead = new THREE.Mesh(new THREE.BoxGeometry(1, 0.03, 0.045), M.bead); bead.visible = false; root.add(bead);

  // robots: build the URDF skeleton, then hang the STL meshes on each joint group
  function buildRobot(def, getGeo, paint, base, rotY) {
    const rb = buildSkeleton(def, base, rotY);
    const baseMesh = new THREE.Mesh(getGeo('base_link'), M.abbDark);
    baseMesh.castShadow = baseMesh.receiveShadow = true; rb.rRoot.add(baseMesh);
    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(getGeo('link_' + (i + 1)), paint.includes(i + 1) ? M.abbOrange : M.abbDark);
      mesh.castShadow = mesh.receiveShadow = true; rb.j[i].add(mesh);
    }
    root.add(rb.holder);
    return rb;
  }
  const R67 = buildRobot(URDF67, get67, [1, 2, 3, 4], R67_BASE, 0);
  const R26 = buildRobot(URDF26, get26, [1, 2, 3, 4], R26_BASE, R26_ROTY);

  // balancer on link_1 of the 6700
  const balancer = new THREE.Group();
  balancer.position.set(-0.349, -0.194, -0.142);
  const cyl = new THREE.Mesh(get67('cylinder'), M.abbDark); cyl.castShadow = true; balancer.add(cyl);
  const pis = new THREE.Mesh(get67('piston'), M.steel); pis.castShadow = true; balancer.add(pis);
  R67.j[0].add(balancer);

  // tools
  function buildMagnet() {
    const g = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 20), M.abbDark);
    stem.rotation.x = Math.PI / 2; stem.position.z = 0.08; g.add(stem);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.1), M.abbOrange); body.position.z = 0.2; g.add(body);
    [-0.12, 0.12].forEach((x) => {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.06, 16), M.abbDark);
      pad.rotation.x = Math.PI / 2; pad.position.set(x, 0, 0.28); g.add(pad);
    });
    g.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    return g;
  }
  function buildTorch() {
    const g = new THREE.Group();
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.16, 14), M.abbDark);
    grip.rotation.x = Math.PI / 2; grip.position.z = 0.07; g.add(grip);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.2, 12), M.steel);
    neck.position.set(0, -0.045, 0.22); neck.rotation.x = Math.PI / 2 + 0.5; g.add(neck);
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.022, 0.07, 12),
      new THREE.MeshStandardMaterial({ color: 0xc8852c, roughness: 0.35, metalness: 0.9 }));
    nozzle.position.set(0, -0.115, 0.3); nozzle.rotation.x = Math.PI / 2 + 0.5; g.add(nozzle);
    g.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    return g;
  }
  const magnet = buildMagnet(); const torch = buildTorch();
  magnet.rotation.y = Math.PI / 2; torch.rotation.y = Math.PI / 2;
  R67.j[5].add(magnet); R26.j[5].add(torch);

  const torchTip = () => R26.j[5].localToWorld(TORCH_TIP.clone());
  const magnetFace = () => R67.j[5].localToWorld(MAGNET_TIP.clone());

  // sparks
  const SPARK_N = 240;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(SPARK_N * 3);
  const sparkVel = new Float32Array(SPARK_N * 3);
  const sparkLife = new Float32Array(SPARK_N);
  const sparkAlpha = new Float32Array(SPARK_N);
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  sparkGeo.setAttribute('aA', new THREE.BufferAttribute(sparkAlpha, 1));
  const sparkMat = new THREE.PointsMaterial({
    color: 0xffb066, size: 0.024, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: false,
  });
  // fade each spark by its remaining life via onBeforeCompile (alpha attribute)
  sparkMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('void main() {', 'attribute float aA; varying float vA; void main() { vA = aA;')
      ;
    sh.fragmentShader = sh.fragmentShader
      .replace('void main() {', 'varying float vA; void main() {')
      .replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a * vA );');
  };
  const sparks = new THREE.Points(sparkGeo, sparkMat); sparks.frustumCulled = false; root.add(sparks);
  let sparkIdx = 0;
  const emitSpark = (p) => {
    const i = sparkIdx = (sparkIdx + 1) % SPARK_N;
    sparkPos[i * 3] = p.x; sparkPos[i * 3 + 1] = p.y; sparkPos[i * 3 + 2] = p.z;
    sparkVel[i * 3] = (Math.random() - 0.5) * 1.6;
    sparkVel[i * 3 + 1] = Math.random() * 1.4 + 0.2;
    sparkVel[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    sparkLife[i] = 0.7 + Math.random() * 0.5;
  };
  const stepSparks = (dt) => {
    for (let i = 0; i < SPARK_N; i++) {
      if (sparkLife[i] <= 0) { sparkAlpha[i] = 0; sparkPos[i * 3 + 1] = -10; continue; }
      sparkLife[i] -= dt;
      sparkAlpha[i] = Math.max(0, Math.min(1, sparkLife[i] / 0.5));
      sparkVel[i * 3 + 1] -= 4.5 * dt;
      sparkPos[i * 3] += sparkVel[i * 3] * dt;
      sparkPos[i * 3 + 1] += sparkVel[i * 3 + 1] * dt;
      sparkPos[i * 3 + 2] += sparkVel[i * 3 + 2] * dt;
      if (sparkPos[i * 3 + 1] < 0.01) { sparkPos[i * 3 + 1] = 0.01; sparkVel[i * 3 + 1] *= -0.3; }
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.aA.needsUpdate = true;
  };

  // socket correction packet
  const packet = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), new THREE.MeshBasicMaterial({ color: 0x9fd8ff }));
  const packetGlow = new THREE.PointLight(0x41b9ff, 0, 2.5, 2); packet.add(packetGlow); packet.visible = false; root.add(packet);
  const a = R67.holder.position, b = R26.holder.position;
  const packetCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(a.x, 0.9, a.z), new THREE.Vector3(a.x, 2.85, a.z - 0.4),
    new THREE.Vector3((a.x + b.x) / 2, 3.2, -0.8), new THREE.Vector3(b.x, 2.85, b.z - 0.4),
    new THREE.Vector3(b.x, 0.8, b.z),
  ]);
  const packetLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(packetCurve.getPoints(80)),
    new THREE.LineDashedMaterial({ color: 0x41b9ff, transparent: true, opacity: 0.18, dashSize: 0.08, gapSize: 0.07 })
  );
  packetLine.computeLineDistances(); root.add(packetLine);

  const { P67, P26 } = computePoses(R67, R26);

  function applyState(st) {
    applyQ(R67); applyQ(R26);
    R67.holder.updateMatrixWorld(true); R26.holder.updateMatrixWorld(true);
    if (st.plate === 'table') { plate.position.copy(PLATE_TABLE); plate.rotation.set(0, 0, 0); }
    else if (st.plate === 'beam') { plate.position.copy(PLATE_BEAM); plate.rotation.set(0, 0, 0); }
    else { const f = magnetFace(); plate.position.set(f.x, f.y - 0.04, f.z); plate.rotation.set(0, 0, 0); }

    if (st.beadK > 0) {
      bead.visible = true;
      const len = (SEAM_X2 - SEAM_X1) * st.beadK;
      bead.scale.set(Math.max(len, 0.001), 1, 1);
      bead.position.set(SEAM_X2 - len / 2, SEAM_Y, SEAM_Z);
      M.bead.emissiveIntensity = st.beadHeat * 1.6;
    } else bead.visible = false;

    if (st.arc) {
      const tip = torchTip();
      arcLight.position.copy(tip);
      arcLight.intensity = 2.2 + Math.random() * 2.6;
      if (Math.random() < 0.85) { emitSpark(tip); emitSpark(tip); }
    } else arcLight.intensity *= 0.8;

    if (st.packet !== null) {
      packet.visible = true; packetLine.material.opacity = 0.5;
      packet.position.copy(packetCurve.getPoint(ease(st.packet)));
      packetGlow.intensity = 1.4;
    } else { packet.visible = false; packetGlow.intensity = 0; packetLine.material.opacity = 0.18; }
  }

  return { root, R67, R26, P67, P26, applyState, stepSparks, emitSpark, torchTip };
}

const FRAMING = {
  // full-bleed background behind the contact CTA: robots large, action low-centre
  background: { camR: 5.7, camY: 2.0, lookX: -0.7, lookY: 0.95, drift: 0.05, par: 0.07 },
};

export default function WeldCellScene({ mode, framing = 'background', hud }) {
  const geos = useLoader(STLLoader, URLS);
  const { camera, invalidate } = useThree();
  const pointer = usePointerParallax(mode === 'live');
  const jit = useRef({ x: 0, y: 0 });
  const simT = useRef(0);
  const lastPhase = useRef('');
  const F = FRAMING[framing] || FRAMING.background;
  const cell = useMemo(() => buildCell(geos), [geos]);

  // static (reduced-motion / screenshot): one informative freeze frame
  useEffect(() => {
    if (mode !== 'static') return;
    const st = sceneAt(WELD_FREEZE, cell.R67, cell.R26, cell.P67, cell.P26);
    cell.applyState(st);
    const tip = cell.torchTip();
    for (let i = 0; i < 60; i++) cell.emitSpark(tip);
    cell.stepSparks(0.12);
    camera.position.set(Math.sin(-0.16) * F.camR - 0.4, F.camY, Math.cos(-0.16) * F.camR);
    camera.lookAt(F.lookX, F.lookY, 0);
    if (hud?.current) hud.current.textContent = 'PHASE // WELD · FREEZE';
    invalidate();
  }, [mode, cell, camera, invalidate, hud]);

  useFrame((_, dtRaw) => {
    if (mode !== 'live') return;
    const dt = Math.min(dtRaw, 0.05);
    simT.current += dt;
    const st = sceneAt(simT.current, cell.R67, cell.R26, cell.P67, cell.P26);
    cell.applyState(st);
    cell.stepSparks(dt);
    if (hud?.current && st.phase !== lastPhase.current) {
      lastPhase.current = st.phase;
      hud.current.textContent = 'PHASE // ' + st.phase.toUpperCase();
    }
    // camera: slow drift + damped mouse parallax (raw tracking feels artificial)
    jit.current.x += (pointer.current.x * 2 - jit.current.x) * 0.04;
    jit.current.y += (pointer.current.y * 2 - jit.current.y) * 0.04;
    const baseA = -0.16 + Math.sin(simT.current * 0.08) * F.drift + jit.current.x * F.par;
    const camY = F.camY + jit.current.y * -0.22;
    camera.position.set(Math.sin(baseA) * F.camR - 0.4, camY, Math.cos(baseA) * F.camR);
    camera.lookAt(F.lookX, F.lookY, 0);
  });

  return <primitive object={cell.root} />;
}

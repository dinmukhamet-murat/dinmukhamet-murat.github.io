/* robot.js — kinematics + cycle timeline for the ABB weld cell.
   URDF joint origins/axes (ROS-Industrial), forward kinematics, analytic IK for
   the wrist centre, and a fixed-point TOOL-TIP solver that drives the magnet
   face / torch nozzle onto a world target (so the robot actually picks the
   plate off the table and welds on the seam, instead of reaching past them).
   Pure; takes the THREE module. Geometry tuned so both arms can reach. */
import * as THREE from 'three';
import { asset } from '../lib/asset';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------- cell geometry (world space, metres, Y-up) ---------- */
export const BEAM = { len: 3.2, h: 0.42, top: 0.92, x: -0.7 };
export const R67_BASE = V(-2.35, 0, 0.15);
export const R26_BASE = V(0.5, 0, 0.2);
export const R26_ROTY = Math.PI;

export const TABLE_POS = V(-1.95, 0, 1.0);
export const PLATE_H = 0.06;
export const PLATE_TOP_TABLE = 0.66;            // top face of plate on the table
export const PLATE_TABLE = V(TABLE_POS.x, PLATE_TOP_TABLE - PLATE_H / 2, TABLE_POS.z);
export const PLATE_BEAM = V(-0.55, BEAM.top + PLATE_H / 2, 0);  // seated on the beam top

export const SEAM_Y = BEAM.top + PLATE_H + 0.005;   // weld runs on top of the placed plate
export const SEAM_Z = 0.14;                          // front edge of the plate
export const SEAM_X1 = -0.74;
export const SEAM_X2 = -0.36;

export const MAGNET_TIP = V(0.34, 0, 0);   // magnet face, in link_6 frame (after tool yaw)
export const TORCH_TIP = V(0.30, -0.13, 0); // torch nozzle, in link_6 frame

/* ---------- URDF (ROS Z-up, from the ROS-Industrial xacros) ---------- */
export const URDF67 = {
  dir: asset('/assets/robots/irb6700/'),
  joints: [
    { o: [0, 0, 0.78], a: 'z' }, { o: [0.32, 0, 0], a: 'y' }, { o: [0, 0, 1.135], a: 'y' },
    { o: [0, 0, 0.2], a: 'x' }, { o: [1.1825, 0, 0], a: 'y' }, { o: [0.2, 0, 0], a: 'x' },
  ],
  shoulder: { a1: 0.32, h: 0.78 }, L1: 1.135, wrist: [1.1825, 0.2],
};
export const URDF26 = {
  dir: asset('/assets/robots/irb2600/'),
  joints: [
    { o: [0, 0, 0.445], a: 'z' }, { o: [0.15, 0, 0], a: 'y' }, { o: [0, 0, 0.7], a: 'y' },
    { o: [0, 0, 0.115], a: 'x' }, { o: [0.795, 0, 0], a: 'y' }, { o: [0.085, 0, 0], a: 'x' },
  ],
  shoulder: { a1: 0.15, h: 0.445 }, L1: 0.7, wrist: [0.795, 0.115],
};

export const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const lerpQ = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);

/* build the joint-group hierarchy (no meshes) — shared by scene + verifier */
export function buildSkeleton(def, basePos, rotY = 0) {
  const holder = new THREE.Group();
  holder.position.copy(basePos);
  holder.rotation.y = rotY;
  const rRoot = new THREE.Group();
  rRoot.rotation.x = -Math.PI / 2; // ROS Z-up → three Y-up
  holder.add(rRoot);
  let parent = rRoot;
  const j = [];
  for (let i = 0; i < 6; i++) {
    const g = new THREE.Group();
    g.position.set(...def.joints[i].o);
    parent.add(g);
    j.push(g);
    parent = g;
  }
  holder.updateMatrixWorld(true);
  return { def, holder, rRoot, j, q: [0, 0, 0, 0, 0, 0] };
}

export function applyQ(rb) {
  for (let i = 0; i < 6; i++) {
    const ax = rb.def.joints[i].a, g = rb.j[i], q = rb.q[i];
    g.rotation.set(0, 0, 0);
    if (ax === 'z') g.rotation.z = q;
    else if (ax === 'y') g.rotation.y = q;
    else g.rotation.x = q;
  }
}

/* analytic IK for the wrist centre at a WORLD target; handles base pose/rotation
   via rRoot.worldToLocal (so the π-rotated 2600 just works). pitch tilts the
   tool: 0 = horizontal, π/2 = straight down. */
export function ik(rb, world, pitch) {
  rb.holder.updateMatrixWorld(true);
  const p = rb.rRoot.worldToLocal(world.clone()); // ROS Z-up local
  const lx = p.x, ly = p.y, lz = p.z;
  const d0 = rb.def;
  const q1 = Math.atan2(ly, lx);
  const r = Math.sqrt(lx * lx + ly * ly) - d0.shoulder.a1;
  const z = lz - d0.shoulder.h;
  const L1 = d0.L1;
  const L2 = Math.sqrt(d0.wrist[0] ** 2 + d0.wrist[1] ** 2);
  const beta = Math.atan2(d0.wrist[1], d0.wrist[0]);
  let d = Math.sqrt(r * r + z * z);
  const reach = (L1 + L2) * 0.999;
  const reachable = d <= reach;
  d = Math.min(d, reach);
  const psi = Math.atan2(r, z);
  const ca = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
  const alpha = Math.acos(Math.max(-1, Math.min(1, ca)));
  const q2 = psi - alpha;
  const cb = (L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2);
  const elbow = Math.acos(Math.max(-1, Math.min(1, cb)));
  const chi = q2 + (Math.PI - elbow);
  const q3 = chi - Math.PI / 2 + beta - q2;
  const q5 = pitch - (q2 + q3);
  return { q: [q1, q2, q3, 0, q5, 0], reachable };
}

/* fixed-point solve so the TOOL TIP (j6 frame offset) lands on `tipWorld` */
export function poseForTip(rb, tipWorld, pitch, tipLocal) {
  const tgt = tipWorld.clone();
  let err = 1, reachable = true;
  for (let i = 0; i < 12; i++) {
    const sol = ik(rb, tgt, pitch);
    rb.q = sol.q; reachable = sol.reachable;
    applyQ(rb);
    rb.holder.updateMatrixWorld(true);
    const tip = rb.j[5].localToWorld(tipLocal.clone());
    const e = tipWorld.clone().sub(tip);
    err = e.length();
    if (err < 4e-4) break;
    tgt.add(e); // correct the wrist target by the tip error
  }
  return { q: rb.q.slice(), err, reachable };
}

/* pose specs: [key, robot('67'|'26'), x, y, z, pitch] — tool tip world targets */
export function poseSpecs() {
  const down = Math.PI / 2;
  const seamMid = (SEAM_X1 + SEAM_X2) / 2;
  return {
    P67: [
      ['home', -1.45, 1.55, 0.45, 0.7],
      ['pick', PLATE_TABLE.x, PLATE_TOP_TABLE + 0.20, PLATE_TABLE.z, down],
      ['pickLow', PLATE_TABLE.x, PLATE_TOP_TABLE + 0.005, PLATE_TABLE.z, down],
      ['lift', -1.35, 1.55, 0.55, down],
      ['place', PLATE_BEAM.x, BEAM.top + 0.42, PLATE_BEAM.z, down],
      ['placeLow', PLATE_BEAM.x, BEAM.top + PLATE_H + 0.085, PLATE_BEAM.z, down],
      ['back', -1.55, 1.6, -0.45, 0.7],
    ],
    P26: [
      ['home', -0.05, 1.35, 0.5, 0.95],
      ['appr', seamMid, SEAM_Y + 0.22, SEAM_Z + 0.04, 1.2],
      ['weldB', SEAM_X2, SEAM_Y + 0.03, SEAM_Z, 1.32],
      ['weldA', SEAM_X1, SEAM_Y + 0.03, SEAM_Z, 1.32],
      ['back', -0.15, 1.5, 0.45, 1.0],
    ],
  };
}

/* all cycle poses, solved against the real rig (after tools are attached).
   Returns the pose tables + a per-pose report (tip error / reachability). */
export function computePoses(R67, R26) {
  const specs = poseSpecs();
  const report = [];
  const solve = (rb, tip, list) => {
    const out = {};
    for (const [key, x, y, z, pitch] of list) {
      const sol = poseForTip(rb, V(x, y, z), pitch, tip);
      out[key] = sol.q;
      report.push({ robot: rb === R67 ? '67' : '26', key, err: sol.err, reachable: sol.reachable });
    }
    return out;
  };
  const P67 = solve(R67, MAGNET_TIP, specs.P67);
  const P26 = solve(R26, TORCH_TIP, specs.P26);
  return { P67, P26, report };
}

/* ---------- cycle timeline ---------- */
export const PH = [
  ['idle', 0.9], ['pick', 1.6], ['grab', 0.7], ['carry', 2.4], ['release', 0.9],
  ['packet', 1.5], ['approach', 1.5], ['weld', 3.2], ['retreat', 1.4], ['cool', 1.5],
];
export const TOTAL = PH.reduce((s, p) => s + p[1], 0);
export const WELD_FREEZE = 0.9 + 1.6 + 0.7 + 2.4 + 0.9 + 1.5 + 1.5 + 1.6; // mid-weld

export function sceneAt(t, R67, R26, P67, P26) {
  t = ((t % TOTAL) + TOTAL) % TOTAL;
  let acc = 0, name = 'idle', k = 0;
  for (let i = 0; i < PH.length; i++) {
    if (t < acc + PH[i][1]) { name = PH[i][0]; k = (t - acc) / PH[i][1]; break; }
    acc += PH[i][1];
  }
  const e = ease(k);
  const st = { phase: name, arc: false, packet: null, beadK: 0, beadHeat: 0, plate: 'table' };

  switch (name) {
    case 'idle': R67.q = P67.home; R26.q = P26.home; break;
    case 'pick': R67.q = lerpQ(P67.home, P67.pick, e); R26.q = P26.home; break;
    case 'grab': // dip onto the plate, magnetise, lift back to hover
      R67.q = k < 0.5 ? lerpQ(P67.pick, P67.pickLow, ease(k * 2)) : lerpQ(P67.pickLow, P67.pick, ease((k - 0.5) * 2));
      st.plate = k > 0.5 ? 'magnet' : 'table'; R26.q = P26.home; break;
    case 'carry':
      st.plate = 'magnet';
      R67.q = k < 0.45 ? lerpQ(P67.pick, P67.lift, ease(k / 0.45)) : lerpQ(P67.lift, P67.place, ease((k - 0.45) / 0.55));
      R26.q = P26.home; break;
    case 'release': // lower onto the beam, release
      R67.q = k < 0.5 ? lerpQ(P67.place, P67.placeLow, ease(k / 0.5)) : P67.placeLow;
      st.plate = k < 0.5 ? 'magnet' : 'beam'; R26.q = P26.home; break;
    case 'packet':
      st.plate = 'beam'; R67.q = lerpQ(P67.placeLow, P67.back, e); R26.q = lerpQ(P26.home, P26.appr, e); st.packet = e; break;
    case 'approach':
      st.plate = 'beam'; R67.q = P67.back; R26.q = lerpQ(P26.appr, P26.weldB, e); break;
    case 'weld':
      st.plate = 'beam'; st.arc = true; R67.q = P67.back; R26.q = lerpQ(P26.weldB, P26.weldA, e);
      st.beadK = e; st.beadHeat = 1; break;
    case 'retreat':
      st.plate = 'beam'; R67.q = P67.back; R26.q = lerpQ(P26.weldA, P26.appr, e);
      st.beadK = 1; st.beadHeat = 1 - e * 0.7; break;
    case 'cool':
      st.plate = 'beam'; R67.q = lerpQ(P67.back, P67.home, e); R26.q = lerpQ(P26.appr, P26.home, e);
      st.beadK = 1; st.beadHeat = 0.3 * (1 - e); break;
    default: break;
  }
  return st;
}

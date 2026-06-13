/* Numeric check: can both arms actually reach every cycle pose, and does the
   tool tip land on its world target? Run with: node verify_kinematics.mjs */
import {
  URDF67, URDF26, R67_BASE, R26_BASE, R26_ROTY,
  buildSkeleton, computePoses, PLATE_TABLE, PLATE_BEAM, SEAM_X1, SEAM_X2, SEAM_Y, SEAM_Z,
} from './src/three/robot.js';

const R67 = buildSkeleton(URDF67, R67_BASE, 0);
const R26 = buildSkeleton(URDF26, R26_BASE, R26_ROTY);
const { report } = computePoses(R67, R26);

let bad = 0;
console.log('robot  pose       reach   tipErr(mm)');
for (const r of report) {
  const mm = (r.err * 1000).toFixed(1).padStart(7);
  const ok = r.reachable && r.err < 0.01;
  if (!ok) bad++;
  console.log(`${r.robot}    ${r.key.padEnd(9)} ${r.reachable ? 'OK ' : 'OUT'}    ${mm}   ${ok ? '' : '  <-- CHECK'}`);
}
console.log(`\nbase67=${R67_BASE.toArray()}  base26=${R26_BASE.toArray()}`);
console.log(`plateTable=${PLATE_TABLE.toArray()}  plateBeam=${PLATE_BEAM.toArray()}`);
console.log(`seam x[${SEAM_X1}, ${SEAM_X2}] y=${SEAM_Y} z=${SEAM_Z}`);
console.log(bad === 0 ? '\nALL POSES REACHABLE & ON-TARGET ✓' : `\n${bad} pose(s) need attention`);
process.exit(bad === 0 ? 0 : 1);

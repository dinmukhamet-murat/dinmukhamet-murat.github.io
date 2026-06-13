/* weldment.js — builds the steel weldment used by the hero scan:
   a shaded mesh group (the physical part) + a dense surface point set
   (what a scanner captures), plus the progressive-reveal point shader.
   Ported from the v3 vanilla PartKit; pure, takes the THREE module. */
import * as THREE from 'three';

function sampleBox(mat, sx, sy, sz, n, out) {
  const areas = [sy * sz, sy * sz, sx * sz, sx * sz, sx * sy, sx * sy];
  const tot = areas.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) {
    let r = Math.random() * tot, f = 0;
    while (r > areas[f]) { r -= areas[f]; f++; }
    const u = Math.random() - 0.5, v = Math.random() - 0.5;
    let x, y, z;
    if (f === 0) { x = sx / 2; y = u * sy; z = v * sz; }
    else if (f === 1) { x = -sx / 2; y = u * sy; z = v * sz; }
    else if (f === 2) { y = sy / 2; x = u * sx; z = v * sz; }
    else if (f === 3) { y = -sy / 2; x = u * sx; z = v * sz; }
    else if (f === 4) { z = sz / 2; x = u * sx; y = v * sy; }
    else { z = -sz / 2; x = u * sx; y = v * sy; }
    out.push(new THREE.Vector3(x, y, z).applyMatrix4(mat));
  }
}

function sampleCyl(mat, rad, h, n, out) {
  for (let i = 0; i < n; i++) {
    const th = Math.random() * Math.PI * 2;
    let x, y, z;
    if (Math.random() < 0.9) {
      y = (Math.random() - 0.5) * h; x = Math.cos(th) * rad; z = Math.sin(th) * rad;
    } else {
      const rr = Math.sqrt(Math.random()) * rad;
      y = (Math.random() < 0.5 ? 1 : -1) * h / 2; x = Math.cos(th) * rr; z = Math.sin(th) * rr;
    }
    out.push(new THREE.Vector3(x, y, z).applyMatrix4(mat));
  }
}

const mat4 = (pos, euler) =>
  new THREE.Matrix4().compose(pos, new THREE.Quaternion().setFromEuler(euler || new THREE.Euler()), new THREE.Vector3(1, 1, 1));

export function buildWeldment() {
  const group = new THREE.Group();
  const pts = [];
  // global point-density scale — keep the cloud readable as discrete points
  // (sweeping over the part) instead of a solid silhouette.
  const PT = 1.15;
  // visible mid-graphite steel so the physical part reads under the point cloud.
  // low metalness: with no environment map a metallic surface reflects black and
  // reads as a dark silhouette — diffuse shading lets the 3D form catch the light.
  const steel = new THREE.MeshStandardMaterial({ color: 0x5b626e, metalness: 0.18, roughness: 0.62 });

  const box = (cx, cy, cz, sx, sy, sz, ry, density) => {
    const g = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), steel);
    g.position.set(cx, cy, cz); g.rotation.y = ry || 0;
    g.castShadow = true; g.receiveShadow = true; group.add(g);
    sampleBox(mat4(new THREE.Vector3(cx, cy, cz), new THREE.Euler(0, ry || 0, 0)), sx, sy, sz, Math.round(density * PT), pts);
  };
  const boxRZ = (cx, cy, cz, sx, sy, sz, rz, density) => {
    const g = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), steel);
    g.position.set(cx, cy, cz); g.rotation.z = rz;
    g.castShadow = true; g.receiveShadow = true; group.add(g);
    sampleBox(mat4(new THREE.Vector3(cx, cy, cz), new THREE.Euler(0, 0, rz)), sx, sy, sz, Math.round(density * PT), pts);
  };
  const cyl = (cx, cy, cz, rad, h, axis, density) => {
    const g = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, h, 28), steel);
    g.position.set(cx, cy, cz);
    const e = new THREE.Euler();
    if (axis === 'x') { g.rotation.z = Math.PI / 2; e.z = Math.PI / 2; }
    else if (axis === 'z') { g.rotation.x = Math.PI / 2; e.x = Math.PI / 2; }
    g.castShadow = true; g.receiveShadow = true; group.add(g);
    sampleCyl(mat4(new THREE.Vector3(cx, cy, cz), e), rad, h, Math.round(density * PT), pts);
  };

  box(0, 0.15, 0, 4.0, 0.3, 2.6, 0, 2600);            // base plate
  box(-1.55, 1.5, 0, 0.32, 2.7, 2.2, 0, 2000);        // tall upright plate
  boxRZ(-0.55, 1.0, 0, 0.28, 2.4, 1.7, -0.92, 1500);  // diagonal gusset
  cyl(0.6, 2.05, 0, 0.34, 4.0, 'z', 2200);            // cross tube
  cyl(0.6, 2.05, 1.4, 0.5, 0.18, 'z', 420);           // tube flange near
  cyl(0.6, 2.05, -1.4, 0.5, 0.18, 'z', 420);          // tube flange far
  box(-1.55, 2.95, 0, 0.7, 0.3, 2.2, 0, 700);         // top cap

  const bb = new THREE.Box3();
  pts.forEach((p) => bb.expandByPoint(p));
  const c = bb.getCenter(new THREE.Vector3());
  group.position.sub(c);

  // centred points + scan order along local X
  const centered = pts.map((p) => p.clone().sub(c));
  const minX = bb.min.x - c.x, maxX = bb.max.x - c.x, spanX = (maxX - minX) || 1;
  const n = centered.length;
  const pos = new Float32Array(n * 3), ord = new Float32Array(n), rnd = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = centered[i];
    pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
    ord[i] = Math.min(Math.max((p.x - minX) / spanX, 0), 1);
    rnd[i] = Math.random();
  }
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pointsGeo.setAttribute('aOrder', new THREE.BufferAttribute(ord, 1));
  pointsGeo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
  pointsGeo.computeBoundingSphere();

  const laserY = (bb.min.y + bb.max.y) / 2 - c.y;
  const laserH = (bb.max.y - bb.min.y) + 1.6, laserD = (bb.max.z - bb.min.z) + 1.6;
  const floorY = bb.min.y - c.y;

  return { group, pointsGeo, minX, spanX, total: n, laserY, laserH, laserD, floorY };
}

export function scanMaterial({ width = 0.035, size = 2.3, dim = 0x6fd0ff, hot = 0xffffff, baseA = 0.92 } = {}) {
  return new THREE.ShaderMaterial({
    // NormalBlending + crisp discs → reads as an actual point cloud sitting on
    // the surface, not an additive glow. depthTest against the mesh occludes
    // back-face points so the cloud stays "on top of the part".
    transparent: true, depthWrite: false, depthTest: true, blending: THREE.NormalBlending,
    uniforms: {
      uFrontier: { value: 0 }, uWidth: { value: width }, uSize: { value: size },
      uPixel: { value: Math.min(window.devicePixelRatio || 1, 2) },
      uDim: { value: new THREE.Color(dim) }, uHot: { value: new THREE.Color(hot) },
      uBaseA: { value: baseA }, uTime: { value: 0 },
    },
    vertexShader: `
      uniform float uFrontier,uWidth,uSize,uPixel,uTime;
      attribute float aOrder; attribute float aRand;
      varying float vHot; varying float vA;
      void main(){
        float captured = step(aOrder,uFrontier);
        float band = exp(-pow((aOrder-uFrontier)/uWidth,2.0)); // brief flash at the beam
        vHot = clamp(band, 0.0, 1.0);
        vA = captured;
        vec4 mv = modelViewMatrix*vec4(position,1.0);
        mv.z += 0.03; // sit just in front of the steel surface (front-facing cloud on top)
        gl_Position = projectionMatrix*mv;
        float jit = 1.0 + sin(uTime*1.4 + aRand*6.28)*0.03;
        gl_PointSize = uSize*(1.0 + vHot*0.35)*(0.7+aRand*0.5)*jit*uPixel*(24.0/-mv.z);
      }`,
    fragmentShader: `
      precision mediump float;
      uniform vec3 uDim,uHot; uniform float uBaseA;
      varying float vHot; varying float vA;
      void main(){
        if (vA < 0.5) discard;                 // not scanned yet → no point
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c); if (d > 0.5) discard;
        float disc = 1.0 - smoothstep(0.36, 0.5, d); // crisp dot, tiny AA rim
        vec3 col = mix(uDim, uHot, vHot);
        float a = disc * (uBaseA + vHot * 0.08);
        gl_FragColor = vec4(col, a);
      }`,
  });
}

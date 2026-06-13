# portfolio_r3f — "WELD CELL" on React + React Three Fiber

The WELD CELL portfolio rebuilt as a **React + React Three Fiber** app (Vite).
Same content, design system, and aesthetic as `../portfolio_v3` (vanilla), now
component-based with the two WebGL scenes as real R3F.

> Sibling builds, all kept intact: `../portfolio` (v2, WebGL point-cloud base),
> `../portfolio_v3` (v3 vanilla, no-build). This folder is the React variant.

## Requires a build step

Unlike v2/v3 (open via `python http.server`), this one needs Node + a dev/build:

```bash
cd ~/quant_ws/portfolio_r3f
npm install          # once
npm run dev          # http://localhost:8092  (HMR)
npm run build        # → dist/
npm run preview      # serve the production build on :8092
```

## Deploy

**Live:** https://dinmukhamet-murat.github.io/

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages. Asset paths are base-aware via
`src/lib/asset.js`, so the site works from the domain root or a sub-path.

## Stack

- **Vite 5** + **React 18**
- **@react-three/fiber** (R3F) + **@react-three/drei** + **three** (npm, not vendored)

## The two 3D scenes (R3F)

| Scene | File | What it does |
|---|---|---|
| Hero point-cloud | `src/three/HeroScene.jsx` + `weldment.js` | A steel weldment scanned live: ABB-orange laser sweep → points settle to registered laser-blue. Auto-scan loop + turntable + damped pointer parallax, `useFrame`-driven. Framed large, upper-right; canvas masked at the bottom so the giant name stays legible. |
| Weld cell (Contact background) | `src/three/WeldCellScene.jsx` + `robot.js` + `components/WeldCellCanvas.jsx` | The real **ABB IRB 6700 + IRB 2600** meshes (`public/assets/robots/*.stl`) loaded with `useLoader(STLLoader)`, rigged with real **URDF** joint origins/axes. Runs the full production cycle with **FK + a fixed-point tool-tip IK** so the 6700 actually picks the plate off the table and the 2600's torch lands on the seam. Cubic ease-in-out (physically believable accel/decel, no bounce), arc light + sparks + socket correction-packet. Rendered **full-bleed behind the "Let's build robots that see & decide" CTA** (not a boxed section), with a readability scrim. |

`src/three/robot.js` holds the URDF, the analytic IK (handles the π-rotated 2600
via `rRoot.worldToLocal`), and `poseForTip()` — a fixed-point solver that drives
the magnet face / torch nozzle onto a world target. **`node verify_kinematics.mjs`**
checks every cycle pose for reachability + tool-tip error (all ≤ 0.4 mm) without a
browser. STL meshes are lazy-loaded behind `<Suspense>`.

## Performance & accessibility

- Each `<Canvas>` `frameloop` follows viewport visibility (`always` on-screen →
  `never` off-screen) so the two WebGL contexts never both render. `dpr` capped
  (hero `[1,2]`, cell `[1,1.75]`); shadow maps 1024².
- `prefers-reduced-motion` **and** `?shot` → both scenes render one static frame
  (hero: fully-registered cloud; cell: a freeze mid-weld) and stop the loop.
- WCAG AA carried over from v3: contrast, keyboard nav, skip-link, decorative
  canvases `aria-hidden`. Reveals enhance already-visible content (not gated).

## Structure

```
index.html               Vite entry (fonts, #root)
public/assets/           robots/ (STL) · work/ (media) · resume PDF
src/
  main.jsx  App.jsx
  styles/global.css       design system (ported from v3, class names reused)
  data/content.js         all copy + project media in one place
  hooks/index.js          reduced-motion, in-view reveal, viewport-active, count-up, parallax
  components/             Nav Hero Marquee Metrics Work Gallery About Log Stack Contact(+weld cell bg) WeldCellCanvas Chrome Reveal
  three/                  HeroScene · weldment · WeldCellScene · robot
verify_kinematics.mjs     node script: reachability + tool-tip error per pose
```

## Editing content

All copy and media live in `src/data/content.js` (projects, metrics, log, stack,
marquee). Add work media to `public/assets/work/` and reference it there.

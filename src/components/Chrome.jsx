import { useEffect, useRef } from 'react';
import { isShot } from '../hooks';

/* Fixed overlays: film grain, weld-seam scroll progress, CNC DRO cursor.
   Pointer/scroll handlers update DOM directly (no per-frame React state). */
export default function Chrome() {
  const seamFill = useRef(null);
  const droX = useRef(null);
  const droY = useRef(null);
  const reticle = useRef(null);

  // weld-seam scroll progress
  useEffect(() => {
    const el = seamFill.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.height = p * 100 + '%';
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // DRO cursor readout + reticle (fine pointers only, not in shot mode)
  useEffect(() => {
    if (isShot()) return;
    if (!matchMedia('(pointer: fine)').matches) return;
    const ret = reticle.current, dx = droX.current, dy = droY.current;
    if (!ret) return;
    let rx = 0, ry = 0, tx = 0, ty = 0, live = false, raf;
    ret.style.left = '0'; ret.style.top = '0';
    const loop = () => {
      rx += (tx - rx) * 0.22; ry += (ty - ry) * 0.22;
      ret.style.transform = `translate(${rx}px,${ry}px)`;
      if (dx) dx.textContent = (tx * 0.1).toFixed(2).padStart(7, '0');
      if (dy) dy.textContent = (ty * 0.1).toFixed(2).padStart(7, '0');
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!live) { live = true; document.body.classList.add('has-pointer'); loop(); }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <a className="skip-link" href="#work">Skip to work</a>
      <div className="grain" aria-hidden="true" />
      <div className="seam" aria-hidden="true">
        <div className="seam__fill" ref={seamFill}><span className="seam__tip" /></div>
      </div>
      <div className="dro" aria-hidden="true">
        <div><b>X</b> <span ref={droX}>0000.00</span> mm</div>
        <div><b>Y</b> <span ref={droY}>0000.00</span> mm</div>
      </div>
      <div className="reticle" ref={reticle} aria-hidden="true" />
    </>
  );
}

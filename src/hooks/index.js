import { useEffect, useRef, useState } from 'react';

const SHOT = typeof location !== 'undefined' && location.search.indexOf('shot') !== -1;
export const isShot = () => SHOT;

/* prefers-reduced-motion, live-updating */
export function useReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

/* one-shot reveal when an element scrolls into view (or immediately in shot/reduced) */
export function useInView({ threshold = 0.16, rootMargin = '0px 0px -7% 0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (SHOT || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(e.target);
          } else if (!once) setInView(false);
        });
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);
  return [ref, inView];
}

/* whether an element is on screen — used to pause R3F render loops off-screen */
export function useViewportActive(margin = '120px') {
  const ref = useRef(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => setActive(entries[0].isIntersecting),
      { rootMargin: margin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, active];
}

/* count-up that settles like a registration residual (ease-out quart) */
export function useCountUp(target, run, { duration = 900 } = {}) {
  const [val, setVal] = useState(target);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!run) return;
    if (reduce || SHOT) { setVal(target); return; }
    const from = target * 7 + 8;
    let raf, t0 = null;
    const tick = (t) => {
      if (t0 == null) t0 = t;
      const k = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - k, 4);
      setVal(Math.round(from + (target - from) * e));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration, reduce]);
  return val;
}

/* shared smoothed pointer (−0.5..0.5), one window listener for parallax */
export function usePointerParallax(enabled = true) {
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const on = (e) => {
      target.current.x = e.clientX / window.innerWidth - 0.5;
      target.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [enabled]);
  return target;
}

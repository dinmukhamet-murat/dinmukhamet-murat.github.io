import { useEffect, useRef } from 'react';
import { NAV_LINKS, RESUME } from '../data/content';

export default function Nav() {
  const nav = useRef(null);
  useEffect(() => {
    const el = nav.current;
    const onScroll = () => el.classList.toggle('is-scrolled', window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className="nav" ref={nav}>
      <a className="nav__brand" href="#top">
        <svg className="nav__bot" width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M6.5 29h11" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M9.5 29v-3.6h5V29" strokeWidth="2" />
          <path d="M12 25.4V19" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M12 19 23 11.5" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M23 11.5 27.5 18" strokeWidth="2.6" strokeLinecap="round" />
          <circle className="j" cx="12" cy="19" r="2.4" />
          <circle className="j" cx="23" cy="11.5" r="2.1" />
          <circle className="j" cx="27.8" cy="18.6" r="1.4" />
        </svg>
        D.MURAT // WELD CELL
      </a>
      <nav className="nav__links" aria-label="Primary">
        {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
      </nav>
      <a className="nav__cta" href={RESUME} target="_blank" rel="noopener">Résumé&nbsp;↗</a>
    </header>
  );
}

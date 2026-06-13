import Reveal from './Reveal';
import WeldCellCanvas from './WeldCellCanvas';
import { useInView } from '../hooks';
import { RESUME } from '../data/content';

export default function Contact() {
  // defer the 5.8 MB of robot STLs until the visitor scrolls near the section
  // (useInView starts false, latches true within 700px; true immediately in ?shot)
  const [nearRef, mounted] = useInView({ rootMargin: '700px 0px 700px 0px', threshold: 0 });

  return (
    <section className="section contact contact--cell" id="contact" aria-label="Contact" ref={nearRef}>
      {/* the ABB cell builds, scans and welds behind the call to action */}
      {mounted && <WeldCellCanvas className="contact__cell" framing="background" />}
      <div className="contact__scrim" aria-hidden="true" />

      <Reveal className="contact__inner">
        <p className="section__no">// 05 — NEXT JOB</p>
        <h2 className="contact__title" style={{ marginTop: '14px' }}>
          Let&#39;s build robots<br />
          that <a href="mailto:dinmukhamet.murat@gmail.com">see&nbsp;&amp;&nbsp;decide</a>.
        </h2>
        <a className="contact__mail" href="mailto:dinmukhamet.murat@gmail.com">
          dinmukhamet.murat@gmail.com
        </a>
        <div className="contact__links">
          <a href="https://github.com/dinmukhamet-murat" target="_blank" rel="noopener">GitHub</a>
          <a href="https://gitlab.com/dinmukhamet.murat" target="_blank" rel="noopener">GitLab</a>
          <a href="https://linkedin.com/in/muratdinmukhamet" target="_blank" rel="noopener">LinkedIn</a>
          <a href={RESUME} target="_blank" rel="noopener">Résumé</a>
        </div>
      </Reveal>

      <p className="contact__cellcap">
        LIVE CELL · IRB 6700 places the part → measured correction streams to the IRB 2600 over a
        socket → IRB 2600 welds to the corrected target
      </p>
      <footer className="footer">
        <span>© 2026 DINMUKHAMET MURAT</span>
        <span>BUILT LIKE A WELD — FAST, PRECISE, HOLDS UNDER LOAD</span>
        <span>ALMATY, KZ</span>
      </footer>
    </section>
  );
}

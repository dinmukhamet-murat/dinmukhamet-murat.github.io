import Reveal from './Reveal';
import { STACK } from '../data/content';

export default function Stack() {
  return (
    <section className="section stack" id="stack" aria-label="Stack">
      <Reveal className="section__head">
        <p className="section__no">// 04 — EQUIPMENT LIST</p>
        <h2 className="section__title">Tools of<br /><span className="stroke">the trade</span></h2>
      </Reveal>
      <div className="stack__grid">
        {STACK.map((c) => (
          <Reveal className="stack__cell" data-idx={c.idx} key={c.idx}>
            <h3>{c.h}</h3>
            <p>{c.p}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

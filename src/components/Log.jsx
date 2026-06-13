import Reveal from './Reveal';
import { LOG } from '../data/content';

export default function Log() {
  return (
    <section className="section" id="log" aria-label="Experience">
      <Reveal className="section__head">
        <p className="section__no">// 03 — COMMISSIONING LOG</p>
        <h2 className="section__title">Where I&#39;ve<br /><span className="stroke">been deployed</span></h2>
      </Reveal>
      <div className="log">
        {LOG.map((row, i) => (
          <Reveal className="log__row" key={i}>
            <div className="log__when">{row.when}<small>{row.where}</small></div>
            <div>
              <div className="log__role">{row.role}</div>
              <div className="log__org">{row.org}</div>
              {row.points.length > 0 && (
                <ul className="log__pts">
                  {row.points.map((pt, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: pt }} />
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

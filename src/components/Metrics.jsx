import { useInView, useCountUp } from '../hooks';
import { METRICS } from '../data/content';

function Metric({ m }) {
  const [ref, inView] = useInView();
  const n = useCountUp(m.count, inView);
  return (
    <div ref={ref} className={`metric reveal ${inView ? 'is-visible' : ''}`}>
      <div className="metric__was">{m.was}</div>
      <div className="metric__num">
        {m.pre}
        <span>{n}</span>{m.post}
        <small>&nbsp;{m.unit}</small>
      </div>
      <div className="metric__label">{m.label}</div>
    </div>
  );
}

export default function Metrics() {
  return (
    <section className="metrics" aria-label="Key results">
      {METRICS.map((m, i) => <Metric key={i} m={m} />)}
    </section>
  );
}

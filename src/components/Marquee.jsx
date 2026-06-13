import { MARQUEE } from '../data/content';

function Chunk() {
  return (
    <div className="marquee__chunk">
      {MARQUEE.map(([label, val], i) => (
        <span key={i}>
          {label} {val && <b>{val}</b>}
          <span aria-hidden="true" style={{ marginLeft: '38px' }}>·</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      {/* two chunks so the linear scroll wraps seamlessly */}
      <div className="marquee__track">
        <Chunk />
        <Chunk />
      </div>
    </div>
  );
}

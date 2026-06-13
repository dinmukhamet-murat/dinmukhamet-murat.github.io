import Reveal from './Reveal';
import { useGallery, isVideo, thumbUrl } from './Gallery';
import { PROJECTS } from '../data/content';

function DimLine({ label }) {
  return (
    <div className="dim" aria-hidden="true">
      <svg preserveAspectRatio="none" viewBox="0 0 600 22">
        <line x1="0" y1="11" x2="600" y2="11" />
        <line x1="0" y1="2" x2="0" y2="20" />
        <line x1="600" y1="2" x2="600" y2="20" />
      </svg>
      <span className="lab">{label}</span>
    </div>
  );
}

function ProjectSheet({ p }) {
  const { open } = useGallery();
  const hero = p.media?.[0];
  const openAt = (i) => open(p.media, i, p.title);

  return (
    <Reveal as="article" className={`sheet ${p.flip ? 'sheet--flip' : ''}`} data-project={p.id}>
      <div className="sheet__media">
        <DimLine label={p.dimLabel} />
        <div
          className="sheet__viewport"
          role="button"
          tabIndex={0}
          aria-label={`Open ${p.title} gallery`}
          onClick={() => hero && openAt(0)}
          onKeyDown={(e) => { if (hero && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openAt(0); } }}
        >
          {hero && <img src={thumbUrl(hero)} alt={hero.alt} loading="lazy" />}
          {hero && isVideo(hero) && <div className="play" aria-hidden="true">▶</div>}
        </div>
        {p.media && p.media.length > 1 && (
          <div className="sheet__strip" aria-label="More media">
            {p.media.map((it, i) => (
              <button
                key={i}
                type="button"
                className={isVideo(it) ? 'vid' : undefined}
                aria-label={it.alt}
                onClick={() => openAt(i)}
              >
                <img src={thumbUrl(it)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sheet__body">
        <div className="sheet__meta"><span>DWG NO. <b>{p.dwg}</b></span><span>{p.org}</span></div>
        <h3 className="sheet__title">{p.title}</h3>
        <p className="sheet__desc" dangerouslySetInnerHTML={{ __html: p.desc }} />
        <ul className="sheet__tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        {p.link && (
          <a className="sheet__link" href={p.link.href} target="_blank" rel="noopener">{p.link.label}</a>
        )}
        <div className="sheet__block">
          <table><tbody><tr>
            <td><b>SCALE</b>{p.block.scale}</td>
            <td><b>REV</b>{p.block.rev}</td>
            <td><b>DRAWN</b>{p.block.drawn}</td>
            <td className="stamp"><b>STATUS</b>{p.block.status}</td>
          </tr></tbody></table>
        </div>
      </div>
    </Reveal>
  );
}

export default function Work() {
  return (
    <section className="section" id="work" aria-label="Selected work">
      <Reveal className="section__head">
        <p className="section__no">// 01 — DRAWING SET</p>
        <h2 className="section__title">Shipped on<br /><span className="stroke">real steel</span></h2>
      </Reveal>
      <div className="sheets">
        {PROJECTS.map((p) => <ProjectSheet key={p.id} p={p} />)}
      </div>
    </section>
  );
}

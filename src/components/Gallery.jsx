import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { asset } from '../lib/asset';

const GalleryCtx = createContext(null);
export const useGallery = () => useContext(GalleryCtx);

export const isVideo = (it) => it.type === 'video' || it.type === 'youtube' || it.type === 'vimeo';
export function thumbUrl(it) {
  if (it.type === 'image') return asset(it.src);
  if (it.type === 'video') return asset(it.poster);
  if (it.type === 'youtube') return `https://img.youtube.com/vi/${it.id}/hqdefault.jpg`;
  if (it.type === 'vimeo') return asset(it.poster);
  return '';
}

function MediaEl({ item }) {
  if (!item) return null;
  if (item.type === 'image') return <img src={asset(item.src)} alt={item.alt} />;
  if (item.type === 'video')
    return <video src={asset(item.src)} poster={asset(item.poster)} controls autoPlay playsInline />;
  if (item.type === 'youtube')
    return (
      <iframe
        src={`https://www.youtube.com/embed/${item.id}?autoplay=1&rel=0`}
        title={item.alt} allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    );
  if (item.type === 'vimeo')
    return (
      <iframe src={`https://player.vimeo.com/video/${item.id}?autoplay=1`} title={item.alt} allowFullScreen />
    );
  return null;
}

export function GalleryProvider({ children }) {
  const [state, setState] = useState(null); // { items, title, index }
  const closeBtn = useRef(null);

  const open = useCallback((items, index = 0, title = '') => setState({ items, index, title }), []);
  const close = useCallback(() => setState(null), []);
  const go = useCallback(
    (dir) =>
      setState((s) => (s ? { ...s, index: (s.index + dir + s.items.length) % s.items.length } : s)),
    []
  );

  useEffect(() => {
    if (!state) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [state, close, go]);

  const cur = state ? state.items[state.index] : null;

  return (
    <GalleryCtx.Provider value={{ open }}>
      {children}
      <div
        className={state ? 'lb is-open' : 'lb'}
        role="dialog"
        aria-modal="true"
        aria-label="Media viewer"
        hidden={!state}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        {state && (
          <>
            <div className="lb__bar">
              <span>{state.title}</span>
              <button className="lb__close" ref={closeBtn} type="button" onClick={close}>
                ESC / Close ✕
              </button>
            </div>
            <div className="lb__stage" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
              {state.items.length > 1 && (
                <button className="lb__nav lb__nav--prev" type="button" aria-label="Previous" onClick={() => go(-1)}>←</button>
              )}
              <MediaEl key={state.index} item={cur} />
              {state.items.length > 1 && (
                <button className="lb__nav lb__nav--next" type="button" aria-label="Next" onClick={() => go(1)}>→</button>
              )}
            </div>
            <div className="lb__cap">
              <span>{cur?.alt || '—'}</span>
              <span className="lb__count">{state.index + 1} / {state.items.length}</span>
            </div>
          </>
        )}
      </div>
    </GalleryCtx.Provider>
  );
}

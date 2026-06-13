import { useEffect } from 'react';
import { GalleryProvider } from './components/Gallery';
import Chrome from './components/Chrome';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Metrics from './components/Metrics';
import Work from './components/Work';
import About from './components/About';
import Log from './components/Log';
import Stack from './components/Stack';
import Contact from './components/Contact';
import { isShot } from './hooks';

export default function App() {
  useEffect(() => {
    if (isShot()) {
      document.documentElement.classList.add('shot');
      document.body.classList.add('is-loaded');
      return;
    }
    // double-rAF so initial styles commit before the hero rise transitions start
    let r2;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => document.body.classList.add('is-loaded'));
    });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);

  return (
    <GalleryProvider>
      <Chrome />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Metrics />
        <Work />
        <About />
        <Log />
        <Stack />
        <Contact />
      </main>
    </GalleryProvider>
  );
}

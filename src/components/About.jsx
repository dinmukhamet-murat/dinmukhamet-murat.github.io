import Reveal from './Reveal';
import { asset } from '../lib/asset';

export default function About() {
  return (
    <section className="section about" id="about" aria-label="About">
      <div className="about__grid">
        <Reveal as="figure" className="about__photo">
          <img
            src={asset('/assets/work/me-abb-pendant.jpg')}
            alt="Dinmukhamet Murat on the shop floor with the ABB teach pendant and beam positioner"
            loading="lazy"
          />
        </Reveal>
        <Reveal>
          <p className="section__no">// 02 — OPERATOR FILE</p>
          <p className="about__lead" style={{ marginTop: '14px' }}>
            Robotics software engineer focused on <em>industrial 3D perception</em> and{' '}
            <em>motion planning</em>. At Quant Robotics I own the production perception stack for ABB
            welding cells — laser-scanner capture, sub-millimetre scan-to-CAD registration,
            inspection, and assembly planning.
          </p>
          <p className="about__body">
            My background bridges classical point-cloud geometry (Open3D, ICP, RANSAC, raycasting)
            with pragmatic systems engineering (Docker, MongoDB, calibration automation),
            controller-level robot programming in ABB RAPID, and a research base in NMPC motion
            control. I like problems where noisy real-world data has to become a precise,
            time-bounded decision on real hardware.
          </p>
          <div className="about__facts">
            <span><b>BASE</b> ALMATY, KZ</span>
            <span><b>STATUS</b> OPEN TO RELOCATION</span>
            <span><b>DEGREE</b> B.S. ROBOTICS, NU '25</span>
            <span><b>LANGS</b> EN / RU / KZ</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

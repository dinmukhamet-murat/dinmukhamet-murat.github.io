"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type Media = {
  src: string;
  alt: string;
  label?: string;
};

type Video = {
  id: string;
  title: string;
  duration: string;
};

const pipelineStages = [
  {
    index: "01",
    short: "Scan",
    eyebrow: "Raw measured geometry",
    title: "Capture the physical part.",
    body: "The cell starts with a real scan: occlusion, surface noise and steel that never arrives exactly where the model expects it.",
    image: "/images/work/pointcloud-unaligned-beam.jpg",
  },
  {
    index: "02",
    short: "Identify",
    eyebrow: "Part identification",
    title: "Find the right component.",
    body: "I isolate the candidate geometry, reject outliers and match the measured cluster to the correct production CAD.",
    image: "/images/work/beam-matching.jpg",
  },
  {
    index: "03",
    short: "Register",
    eyebrow: "Staged registration",
    title: "Bring scan and CAD together.",
    body: "Raycast-visible CAD, coarse alignment and staged ICP turn noisy measurements into a pose the robot can actually use.",
    image: "/images/work/scan-to-cad-beam-match.png",
  },
  {
    index: "04",
    short: "Inspect",
    eyebrow: "Fit verification",
    title: "Measure what changed.",
    body: "The pipeline checks fit, deviations and placement before any correction reaches the production cell.",
    image: "/images/work/fit-inspection.png",
  },
  {
    index: "05",
    short: "Execute",
    eyebrow: "ABB correction",
    title: "Send verified motion to the cell.",
    body: "Measured correction becomes collision-aware assembly and welding motion on real ABB hardware.",
    image: "/images/work/robot-welding.jpg",
  },
];

const projectMedia: Record<string, Media[]> = {
  assembly: [
    {
      src: "/images/work/assembly-visualizer.png",
      alt: "Geometry-aware assembly visualizer",
      label: "Assembly planning",
    },
    {
      src: "/images/work/me-abb-pendant.jpg",
      alt: "Dinmukhamet programming an ABB industrial robot",
      label: "Real hardware",
    },
    {
      src: "/images/work/robot-welding.jpg",
      alt: "ABB robot welding a steel assembly",
      label: "Execution",
    },
  ],
  scanner: [
    {
      src: "/images/work/virtual-scanner-raycast.png",
      alt: "Virtual point-cloud scanner raycasting an STL model",
      label: "36 viewpoints",
    },
    {
      src: "/images/work/open3d-eiffel-pointcloud.png",
      alt: "Eiffel Tower point cloud rendered in Open3D",
      label: "Occlusion-aware output",
    },
    {
      src: "/images/work/scanner-stl-select.png",
      alt: "STL selection interface for the virtual scanner",
      label: "Open-source tool",
    },
  ],
  edge: [
    {
      src: "/images/work/openvino-benchmark.png",
      alt: "OpenVINO model performance benchmark",
      label: "20 → 37 FPS",
    },
    {
      src: "/images/work/experimental-setups.jpg",
      alt: "Robotics and computer-vision experimental setup",
      label: "Edge experiments",
    },
  ],
};

const videos: Video[] = [
  {
    id: "JUHFF74MCJs",
    title: "Jackal UGV — dynamic obstacle avoidance with NMPC",
    duration: "01:03",
  },
  {
    id: "xvdzt8DPEdo",
    title: "3D human detection with YOLO and an RGB-D camera",
    duration: "00:07",
  },
  {
    id: "l8Rhfs3ggD8",
    title: "Human-following NMPC controller",
    duration: "01:01",
  },
];

const experience = [
  {
    period: "2025 — NOW",
    company: "Quant Robotics",
    role: "Robotics Software Engineer",
    detail:
      "Production 3D scanning, registration, inspection and assembly planning for ABB robotic welding cells.",
  },
  {
    period: "2024 — 2025",
    company: "Nazarbayev University",
    role: "Research Assistant",
    detail:
      "Real-time NMPC navigation with skid-steer dynamics and human-aware velocity adaptation in ROS 2.",
  },
  {
    period: "2025",
    company: "FOQUS",
    role: "Edge Video Systems Engineer",
    detail:
      "Object-detection inference optimization across ONNX and OpenVINO for edge deployment.",
  },
];

function FrameHeader({
  center,
  index,
  inverse = false,
}: {
  center: string;
  index: string;
  inverse?: boolean;
}) {
  return (
    <div className={`frame-header${inverse ? " is-inverse" : ""}`}>
      <a href="#top">DM / ROBOTICS SOFTWARE ENGINEER</a>
      <span>{center}</span>
      <span>{index} / 07</span>
    </div>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function MediaButton({
  item,
  collection,
  index,
  className = "",
  onOpen,
}: {
  item: Media;
  collection: Media[];
  index: number;
  className?: string;
  onOpen: (media: Media[], index: number) => void;
}) {
  return (
    <button
      className={`media-button ${className}`}
      type="button"
      onClick={() => onOpen(collection, index)}
      aria-label={`Open image: ${item.alt}`}
    >
      <img src={item.src} alt={item.alt} loading="lazy" />
      <span className="media-label">{item.label ?? item.alt}</span>
      <span className="media-expand">EXPAND ↗</span>
    </button>
  );
}

export default function Home() {
  const [pipelineStage, setPipelineStage] = useState(0);
  const [compare, setCompare] = useState(48);
  const [lightbox, setLightbox] = useState<
    | { type: "image"; media: Media[]; index: number }
    | { type: "video"; video: Video }
    | null
  >(null);
  const pipelineRef = useRef<HTMLElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(false);

  useEffect(() => {
    const updatePipeline = () => {
      const section = pipelineRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const next = Math.min(
        pipelineStages.length - 1,
        Math.floor(progress * pipelineStages.length)
      );
      setPipelineStage(next);
      section.style.setProperty("--pipeline-progress", `${progress}`);
    };
    updatePipeline();
    window.addEventListener("scroll", updatePipeline, { passive: true });
    window.addEventListener("resize", updatePipeline);
    return () => {
      window.removeEventListener("scroll", updatePipeline);
      window.removeEventListener("resize", updatePipeline);
    };
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (lightbox.type === "image" && event.key === "ArrowRight") {
        setLightbox({
          ...lightbox,
          index: (lightbox.index + 1) % lightbox.media.length,
        });
      }
      if (lightbox.type === "image" && event.key === "ArrowLeft") {
        setLightbox({
          ...lightbox,
          index:
            (lightbox.index - 1 + lightbox.media.length) %
            lightbox.media.length,
        });
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const updateCompare = (clientX: number) => {
    const frame = compareRef.current;
    if (!frame) return;
    const bounds = frame.getBoundingClientRect();
    const value = ((clientX - bounds.left) / bounds.width) * 100;
    setCompare(Math.min(94, Math.max(6, value)));
  };

  const onComparePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    dragRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateCompare(event.clientX);
  };

  const onComparePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (dragRef.current) updateCompare(event.clientX);
  };

  const openImage = (media: Media[], index: number) =>
    setLightbox({ type: "image", media, index });

  const openVideo = (video: Video) =>
    setLightbox({ type: "video", video });

  const activePipeline = pipelineStages[pipelineStage];
  const compareStyle = { "--compare": `${compare}%` } as CSSProperties;

  return (
    <main id="top">
      <header className="site-nav">
        <a className="nav-brand" href="#top" aria-label="Dinmukhamet Murat, home">
          DM
        </a>
        <nav aria-label="Primary navigation">
          <a href="#case">Case 01</a>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a className="nav-contact" href="#contact">
            Let&apos;s talk <ArrowIcon />
          </a>
        </nav>
      </header>

      <section className="hero-section" aria-labelledby="hero-title">
        <FrameHeader center="SELECTED WORK / 2024–26" index="01" />
        <div className="hero-intro-grid">
          <div>
            <p className="signal-label">DINMUKHAMET MURAT / ASTANA, KAZAKHSTAN</p>
            <h1 id="hero-title">
              Machines are precise.
              <span>The world isn&apos;t.</span>
            </h1>
          </div>
          <div className="hero-positioning">
            <p>
              I build perception, planning and control systems that keep
              working when scans, steel and environments aren&apos;t perfect.
            </p>
            <a href="#contact">
              OPEN TO ROBOTICS SOFTWARE / PERCEPTION ROLES
            </a>
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-photo" aria-label="Dinmukhamet at an ABB robotic cell">
            <div className="hero-slice slice-a">
              <img
                src="/images/work/me-abb-pendant.jpg"
                alt="Dinmukhamet Murat holding an ABB teach pendant in a production cell"
              />
            </div>
            <div className="hero-slice slice-b" aria-hidden="true">
              <img src="/images/work/me-abb-pendant.jpg" alt="" />
            </div>
            <div className="hero-slice slice-c" aria-hidden="true">
              <img src="/images/work/me-abb-pendant.jpg" alt="" />
            </div>
            <span className="hero-photo-caption">
              PRODUCTION FLOOR / ABB CELL / REAL HARDWARE
            </span>
          </div>
          <div className="hero-measure">
            <img
              src="/images/work/fit-inspection.png"
              alt="Fit inspection result showing measured geometry"
            />
            <div>
              <p>SELECTED PRODUCTION RESULT</p>
              <strong>
                3 mm <span>→</span> &lt;1
              </strong>
              <p>ABB PLACEMENT ERROR</p>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <a href="#case">SCROLL TO ENTER THE SCAN-TO-CAD PIPELINE ↓</a>
          <a href="/Dinmukhamet_Murat_Resume.pdf" download>
            VIEW CV ↗
          </a>
        </div>
      </section>

      <section
        className="pipeline-section"
        id="case"
        ref={pipelineRef}
        aria-labelledby="pipeline-title"
      >
        <div className="pipeline-sticky">
          <FrameHeader
            center="CASE 01 / SCAN-TO-CAD"
            index="02"
            inverse
          />
          <div className="pipeline-layout">
            <div className="pipeline-copy">
              <p className="signal-label">PRODUCTION PERCEPTION / QUANT ROBOTICS</p>
              <h2 id="pipeline-title">
                From noisy scan to robot-ready geometry.
              </h2>
              <div className="pipeline-active-copy" aria-live="polite">
                <p>{activePipeline.eyebrow}</p>
                <h3>{activePipeline.title}</h3>
                <p>{activePipeline.body}</p>
              </div>
              <ol className="pipeline-nav" aria-label="Scan-to-CAD stages">
                {pipelineStages.map((stage, index) => (
                  <li key={stage.short}>
                    <button
                      type="button"
                      className={index === pipelineStage ? "is-active" : ""}
                      onClick={() => {
                        setPipelineStage(index);
                        pipelineRef.current?.scrollIntoView({
                          block: "start",
                          behavior: "smooth",
                        });
                      }}
                      aria-current={index === pipelineStage ? "step" : undefined}
                    >
                      <span>{stage.index}</span>
                      {stage.short}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pipeline-visual">
              <div
                className="compare-frame"
                ref={compareRef}
                style={compareStyle}
                onPointerDown={onComparePointerDown}
                onPointerMove={onComparePointerMove}
                onPointerUp={() => {
                  dragRef.current = false;
                }}
                onPointerCancel={() => {
                  dragRef.current = false;
                }}
                role="group"
                aria-label="Before and after scan registration comparison"
              >
                <img
                  className="compare-before"
                  src="/images/work/pointcloud-unaligned-beam.jpg"
                  alt="Raw measured scan before registration"
                />
                <div className="compare-after">
                  <img
                    src="/images/work/scan-to-cad-beam-match.png"
                    alt="Registered scan aligned to the CAD model"
                  />
                </div>
                <span className="compare-label before-label">RAW MEASURED SCAN</span>
                <span className="compare-label after-label">REGISTERED MODEL</span>
                <div className="compare-handle" aria-hidden="true">
                  <span>↔</span>
                </div>
                <input
                  className="compare-range"
                  type="range"
                  min="6"
                  max="94"
                  value={compare}
                  onChange={(event) => setCompare(Number(event.target.value))}
                  aria-label="Compare raw scan and registered result"
                />
              </div>
              <div className="pipeline-filmstrip" aria-live="polite">
                {pipelineStages.map((stage, index) => (
                  <button
                    type="button"
                    key={stage.short}
                    className={index === pipelineStage ? "is-active" : ""}
                    onClick={() => setPipelineStage(index)}
                    aria-label={`Show ${stage.short} stage`}
                  >
                    <img src={stage.image} alt="" />
                  </button>
                ))}
              </div>
              <div className="pipeline-progress">
                <span>DRAG / SCROLL TO ALIGN</span>
                <span>PIPELINE STAGE {activePipeline.index} / 05</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="result-section" aria-labelledby="result-title">
        <FrameHeader center="CASE 01 / RESULT" index="03" />
        <div className="result-statement">
          <p className="signal-label">WHAT CHANGED IN PRODUCTION</p>
          <h2 id="result-title" aria-label="Placement error reduced from 3 millimetres to below 1 millimetre">
            <span className="result-old">3<small>mm</small></span>
            <span className="result-arrow">→</span>
            <span>&lt;1<small>mm</small></span>
          </h2>
          <div>
            <p>
              Placement error reduced by rebuilding the registration and
              inspection pipeline.
            </p>
            <span>OPEN3D / STAGED ICP / RAYCASTING / ABB RAPID</span>
          </div>
        </div>
        <div className="result-media">
          <button
            type="button"
            onClick={() =>
              openImage(
                [
                  {
                    src: "/images/work/fit-inspection.png",
                    alt: "Fit inspection of measured geometry",
                  },
                  {
                    src: "/images/work/me-gocator-calibration.jpg",
                    alt: "Dinmukhamet calibrating the Gocator scanner",
                  },
                ],
                0
              )
            }
          >
            <img
              src="/images/work/fit-inspection.png"
              alt="Fit inspection of measured geometry"
            />
            <span>FIT INSPECTION / MEASURED GEOMETRY</span>
          </button>
          <button
            type="button"
            onClick={() =>
              openImage(
                [
                  {
                    src: "/images/work/fit-inspection.png",
                    alt: "Fit inspection of measured geometry",
                  },
                  {
                    src: "/images/work/me-gocator-calibration.jpg",
                    alt: "Dinmukhamet calibrating the Gocator scanner",
                  },
                ],
                1
              )
            }
          >
            <img
              src="/images/work/me-gocator-calibration.jpg"
              alt="Dinmukhamet calibrating a Gocator scanner in the ABB cell"
            />
            <span>CALIBRATING THE REAL CELL</span>
          </button>
        </div>
        <div className="section-footnote">
          <span>THE PROOF IS THE SYSTEM, NOT THE ANIMATION.</span>
          <a href="#capabilities">NEXT: WHAT I BRING TO A TEAM ↓</a>
        </div>
      </section>

      <section
        className="capabilities-section"
        id="capabilities"
        aria-labelledby="capabilities-title"
      >
        <FrameHeader center="CAPABILITY / CONNECTED SYSTEMS" index="04" />
        <div className="capabilities-heading">
          <div>
            <p className="signal-label">WHAT I BRING TO A ROBOTICS TEAM</p>
            <h2 id="capabilities-title">
              Perception.
              <span>Planning.</span>
              <span>Control.</span>
            </h2>
          </div>
          <p>
            Not three disconnected skill lists. One engineering loop—from
            imperfect sensor input to precise robot motion.
          </p>
        </div>
        <div className="capability-grid">
          <article>
            <p>01 / SEE</p>
            <h3>3D perception</h3>
            <ul>
              <li>Scan registration</li>
              <li>Part identification</li>
              <li>Fit inspection</li>
            </ul>
            <img
              src="/images/work/scan-to-cad-beam-match.png"
              alt="Registered point cloud and CAD geometry"
            />
          </article>
          <article>
            <p>02 / DECIDE</p>
            <h3>Planning</h3>
            <ul>
              <li>Assembly sequencing</li>
              <li>Collision-safe motion</li>
              <li>Robot handoff</li>
            </ul>
            <img
              src="/images/work/assembly-visualizer.png"
              alt="Geometry-aware robotic assembly plan"
            />
          </article>
          <article>
            <p>03 / MOVE</p>
            <h3>Control</h3>
            <ul>
              <li>NMPC / Nav2</li>
              <li>ABB RAPID</li>
              <li>Real-time constraints</li>
            </ul>
            <img
              src="/images/work/robot-welding-2.jpg"
              alt="ABB robot executing a welding operation"
            />
          </article>
        </div>
        <div className="capability-footer">
          <span>OPEN3D · ROS 2 · MOVEIT2 · ACADOS · ABB RAPID</span>
          <a href="#work">EXPLORE SELECTED WORK ↓</a>
        </div>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <FrameHeader center="SELECTED WORK / RANGE" index="05" inverse />
        <div className="work-heading">
          <p className="signal-label">BEYOND THE FLAGSHIP CASE</p>
          <h2 id="work-title">
            Systems that sense, decide and move.
          </h2>
          <p>
            Production robotics, motion control, synthetic perception and
            edge inference—shown through real artifacts, not technology logos.
          </p>
        </div>

        <article className="work-feature work-feature-light">
          <div className="work-index">02</div>
          <div className="work-copy">
            <p>QUANT ROBOTICS / PRODUCTION AUTOMATION</p>
            <h3>Assembly planning for ABB welding cells.</h3>
            <p>
              Geometry-aware install-and-weld planning, collision-safe retreat
              trajectories and a robot-to-robot production handoff.
            </p>
            <dl>
              <div>
                <dt>Planning cycle</dt>
                <dd>160 → 30–55 s</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>ROS 2 · MoveIt2 · RAPID</dd>
              </div>
            </dl>
          </div>
          <div className="work-collage assembly-collage">
            {projectMedia.assembly.map((item, index) => (
              <MediaButton
                key={item.src}
                item={item}
                collection={projectMedia.assembly}
                index={index}
                className={`collage-${index + 1}`}
                onOpen={openImage}
              />
            ))}
          </div>
        </article>

        <article className="work-feature nmpc-feature">
          <div className="work-index">03</div>
          <div className="work-copy">
            <p>NAZARBAYEV UNIVERSITY / MOTION CONTROL</p>
            <h3>Human-aware NMPC for a mobile robot.</h3>
            <p>
              A custom nonlinear MPC controller for Nav2 with skid-steer
              dynamics and human-aware speed adaptation driven by RGB-D
              perception.
            </p>
            <div className="nmpc-metric">
              <strong>50–70</strong>
              <span>ms optimization cycle</span>
            </div>
            <p className="work-stack">
              ACADOS · NAV2 · ROS 2 · YOLOV8 · GAZEBO
            </p>
          </div>
          <div className="video-deck">
            {videos.map((video, index) => (
              <button
                type="button"
                key={video.id}
                className={`video-card video-card-${index + 1}`}
                onClick={() => openVideo(video)}
              >
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                />
                <span className="video-play">PLAY</span>
                <span>
                  {video.title}
                  <small>{video.duration}</small>
                </span>
              </button>
            ))}
          </div>
        </article>

        <div className="work-pair">
          <article>
            <div className="work-index">04</div>
            <p>OPEN SOURCE / SYNTHETIC PERCEPTION</p>
            <h3>Virtual point-cloud scanner.</h3>
            <p>
              An industrial scanner simulator that captures STL models from 36
              viewpoints with visibility and occlusion intact.
            </p>
            <MediaButton
              item={projectMedia.scanner[0]}
              collection={projectMedia.scanner}
              index={0}
              onOpen={openImage}
            />
            <a
              href="https://github.com/dinmukhamet-murat/virtual-pointcloud-scanner"
              target="_blank"
              rel="noreferrer"
            >
              VIEW REPOSITORY <ArrowIcon />
            </a>
          </article>
          <article>
            <div className="work-index">05</div>
            <p>EDGE CV / EXPERIMENTS</p>
            <h3>Inference built for limited compute.</h3>
            <p>
              Practical optimization across ONNX and OpenVINO, plus a wider
              archive of ROS 2 navigation and manipulation experiments.
            </p>
            <MediaButton
              item={projectMedia.edge[0]}
              collection={projectMedia.edge}
              index={0}
              onOpen={openImage}
            />
            <a
              href="https://gitlab.com/dinmukhamet.murat"
              target="_blank"
              rel="noreferrer"
            >
              EXPLORE ENGINEERING ARCHIVE <ArrowIcon />
            </a>
          </article>
        </div>
      </section>

      <section
        className="experience-section"
        id="experience"
        aria-labelledby="experience-title"
      >
        <FrameHeader center="EXPERIENCE / EDUCATION" index="06" />
        <div className="experience-heading">
          <p className="signal-label">FROM RESEARCH TO PRODUCTION</p>
          <h2 id="experience-title">Built in the lab. Proven on the floor.</h2>
        </div>
        <div className="experience-list">
          {experience.map((item, index) => (
            <article key={`${item.company}-${item.period}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item.period}</p>
              <div>
                <h3>{item.company}</h3>
                <p>{item.role}</p>
              </div>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
        <div className="education-row">
          <p>EDUCATION</p>
          <div>
            <h3>B.Sc. Robotics Engineering</h3>
            <p>Nazarbayev University · Astana · 2025</p>
          </div>
          <p>
            Control Systems · Machine Learning · PLC Programming · Industrial
            Automation
          </p>
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <FrameHeader center="CONTACT / AVAILABILITY" index="07" inverse />
        <div className="contact-layout">
          <div className="contact-image">
            <img
              src="/images/work/welding-beam.jpg"
              alt="ABB robot welding steel in a production cell"
            />
            <span>PRODUCTION ROBOTICS / REAL HARDWARE</span>
          </div>
          <div className="contact-copy">
            <p className="signal-label">
              AVAILABLE FOR THE NEXT SYSTEM THAT HAS TO WORK
            </p>
            <h2 id="contact-title">Need robotics beyond the demo?</h2>
            <p className="contact-roles">
              Robotics Software · 3D Perception
              <br />
              Motion Planning · Control
            </p>
            <div className="availability">
              <span>ASTANA, KAZAKHSTAN</span>
              <span>OPEN TO RELOCATION WITH VISA SPONSORSHIP</span>
            </div>
            <a
              className="talk-link"
              href="mailto:dinmukhamet.murat@gmail.com"
            >
              Let&apos;s talk <ArrowIcon />
            </a>
            <div className="contact-links">
              <a href="mailto:dinmukhamet.murat@gmail.com">EMAIL</a>
              <a
                href="https://www.linkedin.com/in/muratdinmukhamet/"
                target="_blank"
                rel="noreferrer"
              >
                LINKEDIN
              </a>
              <a href="/Dinmukhamet_Murat_Resume.pdf" download>
                DOWNLOAD CV
              </a>
            </div>
          </div>
        </div>
        <footer>
          <span>DINMUKHAMET MURAT © 2026</span>
          <span>BUILT FROM REAL WORK, NOT STOCK IMAGERY.</span>
        </footer>
      </section>

      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.type === "image" ? "Image viewer" : "Video player"}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setLightbox(null);
          }}
        >
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close viewer"
          >
            CLOSE ×
          </button>
          {lightbox.type === "image" ? (
            <div className="lightbox-image">
              <img
                src={lightbox.media[lightbox.index].src}
                alt={lightbox.media[lightbox.index].alt}
              />
              <p>
                {String(lightbox.index + 1).padStart(2, "0")} /{" "}
                {String(lightbox.media.length).padStart(2, "0")} —{" "}
                {lightbox.media[lightbox.index].alt}
              </p>
              {lightbox.media.length > 1 && (
                <>
                  <button
                    className="lightbox-prev"
                    type="button"
                    onClick={() =>
                      setLightbox({
                        ...lightbox,
                        index:
                          (lightbox.index - 1 + lightbox.media.length) %
                          lightbox.media.length,
                      })
                    }
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    className="lightbox-next"
                    type="button"
                    onClick={() =>
                      setLightbox({
                        ...lightbox,
                        index: (lightbox.index + 1) % lightbox.media.length,
                      })
                    }
                    aria-label="Next image"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="lightbox-video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${lightbox.video.id}?autoplay=1&rel=0`}
                title={lightbox.video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <p>{lightbox.video.title}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

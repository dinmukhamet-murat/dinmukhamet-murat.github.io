"use client";

import { useEffect, useState } from "react";

const metrics = [
  { value: "<1", unit: "mm", label: "placement error" },
  { value: "5×", unit: "", label: "faster registration" },
  { value: "33–37", unit: "FPS", label: "edge inference" },
];

type ProjectMedia = {
  src: string;
  alt: string;
};

type ProjectVideo = {
  id: string;
  href: string;
  title: string;
  duration: string;
};

type Project = {
  number: string;
  title: string;
  eyebrow: string;
  result: string;
  resultLabel: string;
  description: string;
  tags: string[];
  media: ProjectMedia[];
  videos?: ProjectVideo[];
  link?: {
    href: string;
    label: string;
  };
};

const projects: Project[] = [
  {
    number: "01",
    title: "Production scan-to-CAD perception",
    eyebrow: "Quant Robotics · Industrial perception",
    result: "3 mm → <1 mm",
    resultLabel: "ABB placement error",
    description:
      "I own the production 3D scanning, registration, and inspection stack behind an ABB robotic welding cell. I rebuilt the Open3D pipeline with scanner-visible CAD raycasting, staged ICP, part identification, and fit inspection.",
    tags: ["Open3D", "ICP", "Raycasting", "ABB RAPID", "ROS 2"],
    media: [
      { src: "/images/work/scan-to-cad-beam-match.png", alt: "Measured beam point cloud aligned to its CAD model" },
      { src: "/images/work/me-gocator-calibration.jpg", alt: "Dinmukhamet calibrating a Gocator scanner on an ABB cell" },
      { src: "/images/work/fit-inspection.png", alt: "Measured fit and deviation inspection result" },
    ],
  },
  {
    number: "02",
    title: "Assembly planning for ABB welding cells",
    eyebrow: "Quant Robotics · Production automation",
    result: "160 → 30–55 s",
    resultLabel: "planning cycle",
    description:
      "I built geometry-aware install-and-weld planning, collision-safe retreat trajectories, and a robot-to-robot handoff in ABB RAPID. The IRB6700 sends measured part correction over a socket; the IRB2600 welds to it.",
    tags: ["ROS 2", "MoveIt2", "Motion planning", "ABB RAPID", "PyVista"],
    media: [
      { src: "/images/work/assembly-visualizer.png", alt: "3D assembly planning visualizer" },
      { src: "/images/work/me-abb-pendant.jpg", alt: "Dinmukhamet working with an ABB teach pendant" },
      { src: "/images/work/robot-welding.jpg", alt: "ABB robot welding a steel assembly" },
    ],
  },
  {
    number: "03",
    title: "Human-aware NMPC",
    eyebrow: "Nazarbayev University · Motion control",
    result: "50–70 ms",
    resultLabel: "optimization cycle",
    description:
      "A custom nonlinear MPC local controller for a Clearpath Jackal in Nav2, with skid-steer dynamics and human-aware velocity adaptation driven by YOLOv8-nano 3D person detection at 10 Hz.",
    tags: ["ACADOS", "Nav2", "ROS 2", "YOLOv8", "Gazebo"],
    videos: [
      {
        id: "JUHFF74MCJs",
        href: "https://www.youtube.com/watch?v=JUHFF74MCJs",
        title: "Jackal UGV — dynamic obstacle avoidance with NMPC",
        duration: "01:03",
      },
      {
        id: "xvdzt8DPEdo",
        href: "https://www.youtube.com/watch?v=xvdzt8DPEdo",
        title: "3D human detection with YOLO, ROS, and an RGB-D camera",
        duration: "00:07",
      },
      {
        id: "l8Rhfs3ggD8",
        href: "https://www.youtube.com/watch?v=l8Rhfs3ggD8",
        title: "Human-following NMPC controller",
        duration: "01:01",
      },
    ],
    media: [],
  },
  {
    number: "04",
    title: "Virtual point-cloud scanner",
    eyebrow: "Open source · Synthetic perception",
    result: "36",
    resultLabel: "raycast viewpoints",
    description:
      "A synthetic industrial scanner that captures STL models from 36 viewpoints through Open3D raycasting and a pinhole model, preserving visibility and occlusion that naive mesh sampling misses.",
    tags: ["Open3D", "Raycasting", "Python", "Point clouds"],
    link: { href: "https://github.com/dinmukhamet-murat/virtual-pointcloud-scanner", label: "View repository" },
    media: [
      { src: "/images/work/virtual-scanner-raycast.png", alt: "Synthetic point cloud captured by raycasting an STL model" },
      { src: "/images/work/open3d-eiffel-pointcloud.png", alt: "Eiffel Tower point cloud in Open3D" },
      { src: "/images/work/scanner-stl-select.png", alt: "STL selection interface for the scanner" },
    ],
  },
  {
    number: "05",
    title: "ROS MoveIt pick-and-place",
    eyebrow: "Personal · In development",
    result: "UR-5",
    resultLabel: "manipulator platform",
    description:
      "A UR-5 picks boxes from a conveyor and arranges them into target shapes—a cube, tower, or pyramid—using ROS 2 Jazzy and MoveIt2.",
    tags: ["ROS 2 Jazzy", "MoveIt2", "UR-5", "Manipulation"],
    media: [
      { src: "/images/work/pnp-sim-scene.png", alt: "UR5 beside a conveyor and stacking table in RViz" },
      { src: "/images/work/pnp-pick.png", alt: "UR5 picking a box from the conveyor" },
      { src: "/images/work/pnp-carry-stack.png", alt: "UR5 carrying a box toward a stack" },
    ],
  },
  {
    number: "06",
    title: "Edge CV & robotics experiments",
    eyebrow: "Research · Engineering archive",
    result: "20 → 37 FPS",
    resultLabel: "edge throughput",
    description:
      "A collection of practical experiments: YOLO nano optimization across ONNX and OpenVINO, NMPC control of a UR-5, and Nav2/TurtleBot3 navigation in simulation.",
    tags: ["YOLO", "OpenVINO", "ONNX", "NMPC", "Nav2"],
    videos: [
      {
        id: "dfHD99SgBPc",
        href: "https://www.youtube.com/watch?v=dfHD99SgBPc",
        title: "UR-5 NMPC simulation",
        duration: "00:46",
      },
      {
        id: "PLBOdEnDqqc",
        href: "https://www.youtube.com/watch?v=PLBOdEnDqqc",
        title: "TurtleBot3 navigation experiment",
        duration: "05:40",
      },
      {
        id: "UEdqK3SDNaQ",
        href: "https://www.youtube.com/shorts/UEdqK3SDNaQ",
        title: "Snake prototype",
        duration: "00:39",
      },
    ],
    link: {
      href: "https://www.youtube.com/watch?v=-SphZAT90ls",
      label: "OpenVINO benchmark",
    },
    media: [
      { src: "/images/work/openvino-benchmark.png", alt: "OpenVINO model performance benchmark" },
      { src: "/images/work/experimental-setups.jpg", alt: "Robotics experimental setup" },
    ],
  },
];

const experience = [
  {
    period: "2025 — NOW",
    company: "QUANT ROBOTICS",
    role: "Robotics Software Engineer",
    summary:
      "Own the production 3D scanning, registration, inspection, and assembly-planning stack for ABB robotic welding cells.",
  },
  {
    period: "2024 — 2025",
    company: "NAZARBAYEV UNIVERSITY",
    role: "Research Assistant",
    summary:
      "Built a real-time NMPC local controller for mobile robots and integrated human-aware safety into the ROS 2 navigation loop.",
  },
  {
    period: "2025",
    company: "FOQUS",
    role: "Edge Video Systems Engineer",
    summary:
      "Optimized real-time object-detection inference across ONNX and OpenVINO pipelines for edge deployment.",
  },
];

const skillGroups = [
  {
    index: "01",
    title: "3D perception",
    items: "Open3D · ICP · RANSAC · FPFH · DBSCAN · Raycasting · PyVista",
  },
  {
    index: "02",
    title: "Robotics",
    items: "ROS 2 · MoveIt2 · Nav2 · ABB RAPID · Gazebo · RViz · URDF",
  },
  {
    index: "03",
    title: "Control",
    items: "MPC / NMPC · ACADOS · Trajectory optimization · SSM · Calibration",
  },
  {
    index: "04",
    title: "CV & systems",
    items: "YOLO · OpenVINO · ONNX · OpenCV · Docker · MongoDB · Linux",
  },
];

function ProjectVisual({
  media,
  title,
  featuredVideo,
  onOpenImage,
  onOpenVideo,
}: {
  media: ProjectMedia[];
  title: string;
  featuredVideo?: ProjectVideo;
  onOpenImage: (media: ProjectMedia[], index: number) => void;
  onOpenVideo: (video: ProjectVideo) => void;
}) {
  if (featuredVideo) {
    return (
      <button
        className="project-visual project-video-poster"
        type="button"
        onClick={() => onOpenVideo(featuredVideo)}
        aria-label={`Play ${featuredVideo.title}`}
      >
        <img
          src={`https://i.ytimg.com/vi/${featuredVideo.id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
        />
        <span className="video-play" aria-hidden="true">▶</span>
        <span className="video-poster-label">PLAY CASE STUDY</span>
        <span className="video-duration">{featuredVideo.duration}</span>
      </button>
    );
  }

  if (!media.length) {
    return (
      <div className="project-visual project-video-panel">
        <span className="visual-label">VIDEO CASE STUDY / EXTERNAL</span>
        <strong>{title}</strong>
      </div>
    );
  }
  return (
    <div className={`project-visual project-gallery gallery-${Math.min(media.length, 3)}`}>
      {media.map((item, index) => (
        <button
          type="button"
          key={item.src}
          className={index === 0 ? "gallery-primary" : ""}
          onClick={() => onOpenImage(media, index)}
          aria-label={`Open image: ${item.alt}`}
        >
          <img src={item.src} alt={item.alt} loading="lazy" />
          <span className="gallery-caption">{String(index + 1).padStart(2, "0")} / {item.alt}</span>
          <span className="gallery-open" aria-hidden="true">EXPAND ↗</span>
        </button>
      ))}
    </div>
  );
}

function ProjectVideos({
  videos,
  projectTitle,
  onOpenVideo,
}: {
  videos: ProjectVideo[];
  projectTitle: string;
  onOpenVideo: (video: ProjectVideo) => void;
}) {
  if (!videos.length) {
    return null;
  }

  return (
    <div className="project-video-strip" aria-label={`${projectTitle} videos`}>
      <div className="project-video-heading">
        <span>PROJECT FOOTAGE</span>
        <strong>{String(videos.length).padStart(2, "0")} CLIPS</strong>
      </div>
      <div className="project-video-grid">
        {videos.map((video) => (
          <button
            className="project-video-card"
            key={video.id}
            type="button"
            onClick={() => onOpenVideo(video)}
            aria-label={`Play ${video.title}`}
          >
            <div className="project-video-frame">
              <img
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
              />
              <span className="video-play" aria-hidden="true">▶</span>
            </div>
            <div className="video-card-copy">
              <span>{video.title}</span>
              <strong>{video.duration} · PLAY ↗</strong>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [lightbox, setLightbox] = useState<
    | { type: "image"; media: ProjectMedia[]; index: number }
    | { type: "video"; video: ProjectVideo }
    | null
  >(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.12 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (lightbox.type === "image" && event.key === "ArrowRight") {
        setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.media.length });
      }
      if (lightbox.type === "image" && event.key === "ArrowLeft") {
        setLightbox({
          ...lightbox,
          index: (lightbox.index - 1 + lightbox.media.length) % lightbox.media.length,
        });
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [lightbox]);

  const openImage = (media: ProjectMedia[], index: number) =>
    setLightbox({ type: "image", media, index });
  const openVideo = (video: ProjectVideo) =>
    setLightbox({ type: "video", video });

  return (
    <main>
      <header className="site-header">
        <a className="monogram" href="#top" aria-label="Dinmukhamet Murat, home">
          DM
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>

        <details className="mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>
        </details>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            Robotics Software Engineer <span>·</span> Almaty, Kazakhstan
          </p>

          <h1 id="hero-title">
            <span>I BUILD ROBOTS</span>
            <span>THAT SEE, DECIDE,</span>
            <span>AND MOVE PRECISELY.</span>
          </h1>

          <p className="hero-intro">
            I work where geometry meets motion: 3D perception, scan-to-CAD
            registration, and real-time control for industrial robots and
            autonomous systems.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              View selected work <span aria-hidden="true">↗</span>
            </a>
            <a
              className="button button-secondary"
              href="/Dinmukhamet_Murat_Resume.pdf"
              download
            >
              Download CV <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-art">
          <img
            className="lab-image"
            src="/images/robotics-lab.webp"
            alt=""
            aria-hidden="true"
          />
          <div className="art-vignette" aria-hidden="true" />
          <img
            className="portrait-image"
            src="/images/dinmukhamet-sweater.webp"
            alt="Dinmukhamet Murat, robotics software engineer"
          />
          <div className="hero-seam" aria-hidden="true" />
          <div className="registration-mark" aria-hidden="true">
            <i />
          </div>
          <p className="art-caption" aria-hidden="true">
            HUMAN / MACHINE
            <span>ALMATY · 43.2389° N</span>
          </p>
        </div>

        <dl className="hero-metrics" aria-label="Selected engineering outcomes">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>
                <strong>{metric.value}</strong>
                {metric.unit && <span>{metric.unit}</span>}
              </dd>
              <span className="metric-label" aria-hidden="true">
                {metric.label}
              </span>
            </div>
          ))}
        </dl>
      </section>

      <section className="industrial-reel" aria-label="Industrial robotics in production">
        <div className="reel-copy">
          <p className="section-kicker">FIELD / PRODUCTION FLOOR</p>
          <strong>INDUSTRIAL ROBOTS. REAL STEEL. PRODUCTION CONSTRAINTS.</strong>
        </div>
        <div className="reel-track">
          {[
            ["/images/work/robot-welding.jpg", "ABB robotic welding cell"],
            ["/images/work/me-gocator-calibration.jpg", "Scanner calibration on an ABB cell"],
            ["/images/work/me-abb-pendant.jpg", "Programming an ABB industrial robot"],
            ["/images/work/me-rotators.jpg", "Industrial robot cell and workpiece rotators"],
            ["/images/work/welding-beam.jpg", "Robotic welding of a steel beam"],
            ["/images/work/robot-welding-2.jpg", "ABB welding operation"],
          ].map(([src, alt], index) => (
            <button type="button" key={src} onClick={() => openImage([{ src, alt }], 0)}>
              <img src={src} alt={alt} loading={index > 2 ? "lazy" : "eager"} />
              <span>{String(index + 1).padStart(2, "0")} / {alt}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section work-section reveal" id="work">
        <div className="section-heading">
          <p className="section-kicker">01 / SELECTED WORK</p>
          <h2>
            ROBOTS ARE ONLY USEFUL
            <span>WHEN THEY WORK IN THE REAL WORLD.</span>
          </h2>
        </div>

        <div className="project-list">
          {projects.map((project) => {
            const featuredVideo =
              project.media.length === 0 ? project.videos?.[0] : undefined;
            const supportingVideos = featuredVideo
              ? project.videos?.slice(1) ?? []
              : project.videos ?? [];

            return (
              <article className="project" key={project.number}>
                <div className="project-number">{project.number}</div>
                <div className="project-copy">
                  <p className="project-eyebrow">{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <ul className="tag-list" aria-label={`${project.title} tools`}>
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <div className="project-links">
                    {project.link && (
                      <a href={project.link.href} target="_blank" rel="noreferrer">
                        {project.link.label} ↗
                      </a>
                    )}
                    {featuredVideo && (
                      <a href={featuredVideo.href} target="_blank" rel="noreferrer">
                        Open featured video ↗
                      </a>
                    )}
                  </div>
                </div>
                <div className="project-result">
                  <span>{project.resultLabel}</span>
                  <strong>{project.result}</strong>
                </div>
                <ProjectVisual
                  media={project.media}
                  title={project.title}
                  featuredVideo={featuredVideo}
                  onOpenImage={openImage}
                  onOpenVideo={openVideo}
                />
                <ProjectVideos
                  videos={supportingVideos}
                  projectTitle={project.title}
                  onOpenVideo={openVideo}
                />
              </article>
            );
          })}
        </div>

        <div className="work-footer">
          <p>
            More code, experiments, and work-in-progress live on my GitLab.
          </p>
          <a
            className="text-link"
            href="https://gitlab.com/dinmukhamet.murat"
            target="_blank"
            rel="noreferrer"
          >
            Explore GitLab <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="section about-section reveal" id="about">
        <div className="about-intro">
          <p className="section-kicker">02 / ABOUT</p>
          <h2>
            I TURN MESSY PHYSICAL PROBLEMS INTO{" "}
            <span>RELIABLE ROBOT BEHAVIOR.</span>
          </h2>
        </div>

        <div className="about-body">
          <p className="about-lead">
            My work sits between 3D perception, control, and the production
            floor.
          </p>
          <div className="about-copy">
            <p>
              At Quant Robotics, I build the software that lets industrial
              robots scan steel parts, understand where they are, plan the next
              move, and assemble them with sub-millimetre precision.
            </p>
            <p>
              I care about the gap between a good demo and a system operators
              can trust: calibration, edge cases, cycle time, clear failure
              modes, and maintainable code.
            </p>
          </div>
        </div>

        <div className="lab-projects">
          <p className="lab-title">IN THE LAB</p>
          <article>
            <span>01</span>
            <div>
              <h3>virtual-pointcloud-scanner</h3>
              <p>
                Industrial laser-scanner simulation from 36 viewpoints using
                Open3D raycasting, occlusion, and a pinhole camera model.
              </p>
            </div>
            <strong>Open3D / Python</strong>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>ROS MoveIt pick-and-place</h3>
              <p>
                A UR-5 arranges conveyor boxes into target shapes with ROS 2
                Jazzy and MoveIt2. Currently in development.
              </p>
            </div>
            <strong>ROS 2 / MoveIt2</strong>
          </article>
        </div>
      </section>

      <section className="section experience-section reveal" id="experience">
        <div className="section-heading experience-heading">
          <p className="section-kicker">03 / EXPERIENCE</p>
          <h2>BUILDING FROM RESEARCH TO PRODUCTION.</h2>
        </div>

        <div className="experience-list">
          {experience.map((item) => (
            <article key={`${item.company}-${item.period}`}>
              <p className="experience-period">{item.period}</p>
              <div>
                <h3>{item.company}</h3>
                <p className="experience-role">{item.role}</p>
              </div>
              <p className="experience-summary">{item.summary}</p>
            </article>
          ))}
        </div>

        <div className="education">
          <p className="section-kicker">EDUCATION</p>
          <div>
            <h3>B.S. ROBOTICS ENGINEERING</h3>
            <p>Nazarbayev University · Astana, Kazakhstan · 2025</p>
          </div>
        </div>
      </section>

      <section className="section skills-section reveal" aria-labelledby="skills-title">
        <div className="skills-heading">
          <p className="section-kicker">04 / TOOLKIT</p>
          <h2 id="skills-title">THE STACK BEHIND THE MOTION.</h2>
        </div>

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article key={group.index}>
              <span>{group.index}</span>
              <h3>{group.title}</h3>
              <p>{group.items}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section reveal" id="contact">
        <p className="section-kicker">05 / CONTACT</p>
        <h2>
          LET&apos;S BUILD ROBOTS
          <span>THAT WORK OUTSIDE THE DEMO.</span>
        </h2>

        <div className="contact-row">
          <a href="mailto:dinmukhamet.murat@gmail.com">
            dinmukhamet.murat@gmail.com <span aria-hidden="true">↗</span>
          </a>
          <div className="social-links">
            <a
              href="https://www.linkedin.com/in/muratdinmukhamet/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://gitlab.com/dinmukhamet.murat"
              target="_blank"
              rel="noreferrer"
            >
              GitLab
            </a>
            <a href="tel:+77066500639">+7 706 650 0639</a>
          </div>
        </div>

        <footer>
          <p>© 2026 Dinmukhamet Murat</p>
          <a href="#top">Back to top ↑</a>
        </footer>
      </section>

      {lightbox && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.type === "image" ? "Image viewer" : "Video player"}
          onMouseDown={(event) => {
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

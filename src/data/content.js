/* All site content in one place — ported 1:1 from the v3 WELD CELL build.
   Media paths point at /assets/** (served from public/). Image/video paths are
   made base-aware at render time (see Gallery's thumbUrl/MediaEl); RESUME is
   wrapped here because it's linked from several components. */
import { asset } from '../lib/asset';

export const NAV_LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'Operator' },
  { href: '#log', label: 'Log' },
  { href: '#stack', label: 'Equipment' },
  { href: '#contact', label: 'Contact' },
];

export const RESUME = asset('/assets/Dinmukhamet_Murat_Resume.pdf');

export const SOCIALS = [
  { href: 'https://github.com/dinmukhamet-murat', label: 'GitHub' },
  { href: 'https://gitlab.com/dinmukhamet.murat', label: 'GitLab' },
  { href: 'https://linkedin.com/in/muratdinmukhamet', label: 'LinkedIn' },
  { href: 'mailto:dinmukhamet.murat@gmail.com', label: 'Email' },
];

export const MARQUEE = [
  ['SCAN-TO-CAD', '<1 MM'], ['ROS 2 / MOVEIT2', ''], ['PLANNING', '160 S → 30-55 S'],
  ['NMPC', '50-70 MS'], ['ABB RAPID', ''], ['OPEN3D / ICP', ''], ['TCP CAL', '<5 S'],
];

export const METRICS = [
  { was: 'was 3 mm', pre: '<', count: 1, post: '', unit: 'mm', label: 'robot placement error' },
  { was: 'was 160 s', pre: '', count: 30, post: '-55', unit: 's', label: 'install & weld planning' },
  { was: 'was 80 s', pre: '', count: 15, post: '', unit: 's', label: 'beam matching (5x)' },
  { was: 'was 10 min, manual', pre: '<', count: 5, post: '', unit: 's', label: 'hands-off TCP calibration' },
];

export const PROJECTS = [
  {
    id: 'scan-to-cad', flip: false,
    dimLabel: 'TOL ±0.5 — MEASURED <1.0 MM',
    dwg: 'QR-EVA-001', org: 'QUANT ROBOTICS · PRODUCTION',
    title: 'Sub-millimetre scan-to-CAD perception for ABB welding cells',
    desc: `Owned the production 3D scanning, registration, and inspection stack. Rebuilt the Open3D scan-to-CAD pipeline and cut robot placement error from 3&nbsp;mm to <strong>under 1&nbsp;mm</strong> — the assembly tolerance manual welding (up to 3&nbsp;mm error) cannot reliably hold. Raycasting-based beam registration, look-alike part disambiguation, parallelized matching.`,
    tags: ['Open3D', 'ICP', 'RANSAC / FPFH', 'raycasting', 'ABB IRB6700', 'Gocator'],
    block: { scale: '1:1 ONLY', rev: 'C', drawn: 'D.MURAT', status: 'IN PRODUCTION' },
    media: [
      { type: 'image', src: '/assets/work/scan-to-cad-beam-match.png', alt: 'Scan-to-CAD registration: measured beam point cloud aligned to its CAD model' },
      { type: 'image', src: '/assets/work/me-gocator-calibration.jpg', alt: 'Calibrating the Gocator scanner TCP on the ABB IRB6700 welding cell' },
      { type: 'image', src: '/assets/work/pointcloud-unaligned-beam.jpg', alt: 'Raw scan of a beam before registration — measured points offset from the CAD reference (red vs green)' },
      { type: 'image', src: '/assets/work/fit-inspection.png', alt: 'Fit inspection: measured thickness and deviation across a scanned component' },
      { type: 'image', src: '/assets/work/scanner-calibration.jpg', alt: 'Scanner calibration setup: ABB robot, Gocator profiler, and survey reference sphere' },
      { type: 'image', src: '/assets/work/beam-matching.jpg', alt: 'Beam matching: detected part instances localized on the scanned beam' },
      { type: 'image', src: '/assets/work/table-scan.png', alt: 'Raw laser scan of the fixture table and mounted parts' },
      { type: 'image', src: '/assets/work/inspection-logs.jpg', alt: 'Part deflection inspection logs from the production pipeline' },
    ],
  },
  {
    id: 'assembly', flip: true,
    dimLabel: 'PLAN WINDOW 30-55 S — INSIDE TOOL CHANGE',
    dwg: 'QR-EVA-002', org: 'QUANT ROBOTICS · PRODUCTION',
    title: 'Assembly planning, trajectory selection & two-robot handoff',
    desc: `Cut install-and-weld planning from 160&nbsp;s to <strong>30-55&nbsp;s</strong> — it now finishes inside the robot's tool change. Added optimal-trajectory selection so the welder takes the lowest-motion retreat path and stays near the part. Built a robot-to-robot handoff in ABB RAPID: the IRB6700 serves its measured part correction over a socket, the IRB2600 welds to it.`,
    tags: ['ROS 2', 'MoveIt2', 'motion planning', 'ABB RAPID', 'IK', 'PyVista'],
    block: { scale: '1:1 ONLY', rev: 'D', drawn: 'D.MURAT', status: 'IN PRODUCTION' },
    media: [
      { type: 'image', src: '/assets/work/assembly-visualizer.png', alt: 'Off-screen 3D assembly visualizer: holders, rotators, supports, and planned placements' },
      { type: 'image', src: '/assets/work/rotator-conflict-check.jpg', alt: 'Rotator placement conflict check against parts and tolerance along the beam axis' },
      { type: 'image', src: '/assets/work/beam-placement-inspection.jpg', alt: 'Placement planning view: where each detail will sit inside the H-beam' },
      { type: 'image', src: '/assets/work/placed-detail-2level.jpg', alt: 'Robot-placed two-level detail seated on the beam before welding' },
      { type: 'image', src: '/assets/work/placed-detail-hbeam.jpg', alt: 'Detail placed inside an H-beam by the robot' },
      { type: 'image', src: '/assets/work/me-rotators.jpg', alt: "Working on the welding cell's rotator / positioner mechanism" },
      { type: 'image', src: '/assets/work/me-abb-pendant.jpg', alt: 'On the floor with the ABB teach pendant and beam positioner' },
      { type: 'video', src: '/assets/work/welding-beam.mp4', poster: '/assets/work/welding-beam.jpg', alt: 'ABB robot welding a beam on the positioner' },
      { type: 'image', src: '/assets/work/robot-welding.jpg', alt: 'ABB robot arc-welding a steel assembly in the cell' },
      { type: 'image', src: '/assets/work/robot-welding-2.jpg', alt: 'Close-up of the robot weld arc on a beam joint' },
      { type: 'video', src: '/assets/work/experimental-setups.mp4', poster: '/assets/work/experimental-setups.jpg', alt: 'Running experimental robot setups on the shop floor' },
    ],
  },
  {
    id: 'nmpc', flip: false,
    dimLabel: 'SOLVE 50-70 MS / CYCLE @ 10 HZ',
    dwg: 'NU-NMPC-003', org: 'NAZARBAYEV UNIVERSITY · RESEARCH',
    title: 'Human-aware NMPC for a mobile robot',
    desc: `Custom NMPC local controller integrated into Nav2 for a Clearpath Jackal (ROS&nbsp;2 / Gazebo, ACADOS), solving each cycle in <strong>50-70&nbsp;ms</strong> on a skid-steer model. Speed-and-Separation-Monitoring velocity adaptation with YOLOv8-nano 3D person detection in the loop at 10&nbsp;Hz, under 3% CPU.`,
    tags: ['NMPC', 'ACADOS', 'Nav2', 'Gazebo', 'pHRI safety', 'YOLOv8'],
    block: { scale: 'SIM + FIELD', rev: 'B', drawn: 'D.MURAT', status: 'THESIS BASE' },
    media: [
      { type: 'youtube', id: 'JUHFF74MCJs', alt: 'Clearpath Jackal avoiding a dynamic obstacle using the NMPC local controller' },
      { type: 'youtube', id: 'xvdzt8DPEdo', alt: 'Human detection with 3D bounding boxes via YOLO in ROS for safety monitoring' },
      { type: 'youtube', id: 'LFI8dKoZKn8', alt: 'Nav2 navigation with YOLOv8-nano person detection in the loop' },
      { type: 'youtube', id: 'l8Rhfs3ggD8', alt: 'NMPC person-following controller in simulation' },
    ],
  },
  {
    id: 'vscanner', flip: true,
    dimLabel: '36 VIEWPOINTS · OCCLUSION-CORRECT',
    dwg: 'OSS-VPS-004', org: 'OPEN SOURCE',
    title: 'virtual-pointcloud-scanner',
    desc: `A synthetic scanner that simulates industrial laser-scanner capture from 36 viewpoints via Open3D raycasting (tensor API) with a pinhole model — correctly handling visibility and occlusion that naive mesh sampling misses.`,
    tags: ['Open3D', 'raycasting', 'Python'],
    link: { href: 'https://github.com/dinmukhamet-murat/virtual-pointcloud-scanner', label: 'View on GitHub ↗' },
    block: { scale: 'SYNTHETIC', rev: 'A', drawn: 'D.MURAT', status: 'PUBLIC' },
    media: [
      { type: 'image', src: '/assets/work/virtual-scanner-raycast.png', alt: 'Synthetic point cloud captured by raycasting an STL from 36 viewpoints' },
      { type: 'image', src: '/assets/work/open3d-eiffel-pointcloud.png', alt: 'Point cloud sampled from an STL model (Eiffel Tower) in Open3D' },
      { type: 'image', src: '/assets/work/scanner-stl-select.png', alt: 'Selecting an input STL model to scan in the virtual scanner tool' },
    ],
  },
  {
    id: 'pnp', flip: false,
    dimLabel: 'UR-5 · CONVEYOR PICK → STACK',
    dwg: 'LAB-PNP-005', org: 'PERSONAL · IN DEVELOPMENT',
    title: 'ros_moveit_pnp',
    desc: `A UR-5 picks boxes from a conveyor and arranges them into target shapes — cube, tower, or pyramid. Built on ROS&nbsp;2 Jazzy + MoveIt2 to push manipulation and motion planning beyond the perception stack.`,
    tags: ['ROS 2 Jazzy', 'MoveIt2', 'UR-5', 'manipulation'],
    block: { scale: 'SIM', rev: 'WIP', drawn: 'D.MURAT', status: 'ACTIVE' },
    media: [
      { type: 'image', src: '/assets/work/pnp-sim-scene.png', alt: 'UR5e with parallel-jaw gripper beside the conveyor belt and stacking table (MoveIt 2 / RViz)' },
      { type: 'image', src: '/assets/work/pnp-carry-stack.png', alt: 'Arm transporting picked boxes to build a stack, with placed boxes on the table' },
      { type: 'image', src: '/assets/work/pnp-pick.png', alt: 'Grasping a box at the conveyor pickup point before placing it' },
      { type: 'image', src: '/assets/work/ros-moveit-pnp.png', alt: 'UR-5 conveyor pick-and-place architecture diagram' },
    ],
  },
  {
    id: 'research', flip: true,
    dimLabel: 'EDGE INFERENCE 20 → 33-37 FPS',
    dwg: 'RND-MIX-006', org: 'RESEARCH · EXPERIMENTS',
    title: 'Research & demos',
    desc: `Experiments outside the production stack: NMPC control of a UR-5 manipulator, Nav2 / TurtleBot3 navigation in simulation, and edge-inference benchmarking — YOLO-nano throughput from 20&nbsp;FPS to <strong>33-37&nbsp;FPS</strong> across ONNX and OpenVINO.`,
    tags: ['NMPC', 'Nav2', 'TurtleBot3', 'OpenVINO', 'simulation'],
    block: { scale: 'MIXED', rev: '—', drawn: 'D.MURAT', status: 'ARCHIVE' },
    media: [
      { type: 'youtube', id: 'dfHD99SgBPc', alt: 'NMPC control of a UR-5 manipulator in simulation' },
      { type: 'youtube', id: 'PLBOdEnDqqc', alt: 'TurtleBot3 navigating a maze in simulation' },
      { type: 'youtube', id: '-SphZAT90ls', alt: 'Edge-inference benchmark — OpenVINO test screencast' },
      { type: 'image', src: '/assets/work/openvino-benchmark.png', alt: 'YOLO model benchmark on OpenVINO: FPS, inference time, RAM, CPU/GPU across exports' },
    ],
  },
];

export const LOG = [
  {
    when: 'JUN 2025 — PRESENT', where: 'ALMATY, KZ',
    role: 'Robotics Software Engineer',
    org: 'QUANT ROBOTICS — PRODUCTION 3D PERCEPTION & SCAN-TO-CAD',
    points: [
      `Rebuilt the Open3D scan-to-CAD registration pipeline, cutting ABB placement error <strong>from 3&nbsp;mm to under 1&nbsp;mm</strong> — the assembly tolerance manual welding can't reliably hold.`,
      `Own the production scanning, registration &amp; inspection stack for the EVA welding cells — modular Python behind one Docker entrypoint, orchestrating an ABB IRB6700 and Gocator scanner via MongoDB.`,
      `Cut install-and-weld planning <strong>160&nbsp;s → 30-55&nbsp;s</strong>; parallelized matching: beams <strong>80&nbsp;s → 15&nbsp;s</strong>, table <strong>60-75&nbsp;s → 15-20&nbsp;s</strong>.`,
      `Built robot-to-robot part-position handoff in ABB RAPID (IRB6700 → IRB2600 over socket), validated on the production cell.`,
      `Automated TCP calibration — a 10-minute operator routine replaced by a hands-off step finishing in <strong>under 5&nbsp;s</strong>.`,
    ],
  },
  {
    when: 'MAY 2024 — JUN 2025', where: 'NAZARBAYEV UNIVERSITY',
    role: 'Research Assistant',
    org: 'REAL-TIME NMPC MOTION CONTROL FOR MOBILE ROBOTS',
    points: [
      `Custom NMPC local controller in Nav2 for a Clearpath Jackal (ROS&nbsp;2 Humble / Gazebo), solving in <strong>50-70&nbsp;ms</strong> per cycle with ACADOS on a skid-steer model.`,
      `Human-aware velocity adaptation under Speed-and-Separation Monitoring — YOLOv8-nano 3D person detection in the loop at <strong>10&nbsp;Hz, &lt;3% CPU</strong>.`,
    ],
  },
  {
    when: 'FEB 2025 — APR 2025', where: 'REMOTE',
    role: 'Edge Video Systems Engineer',
    org: 'FOQUS — EDGE COMPUTER-VISION PERFORMANCE',
    points: [
      `YOLO-nano inference <strong>20&nbsp;FPS → 33-37&nbsp;FPS</strong> by benchmarking YOLOv5/v8/v11 and tuning export, device fallback, and frame-level logging across ONNX and OpenVINO.`,
    ],
  },
  {
    when: 'JUN 2025', where: 'ASTANA, KZ',
    role: 'B.S., Robotics Engineering',
    org: 'NAZARBAYEV UNIVERSITY',
    points: [],
  },
];

export const STACK = [
  { idx: '01', h: '3D Vision & Point Clouds', p: 'Open3D · ICP · RANSAC · FPFH · DBSCAN · raycasting · scan-to-CAD matching · PyVista · Trimesh' },
  { idx: '02', h: 'Robotics & ROS', p: 'ROS 2 (Humble / Jazzy) · MoveIt2 · ABB RAPID · Nav2 · Gazebo · RViz · URDF / SRDF / xacro' },
  { idx: '03', h: 'Control & Calibration', p: 'MPC / NMPC · ACADOS · trajectory optimization · SSM / pHRI safety · TCP & scanner calibration' },
  { idx: '04', h: 'ML & Edge CV', p: 'YOLOv8 / YOLOv11 · OpenVINO · ONNX · OpenCV · NumPy · SciPy' },
  { idx: '05', h: 'Programming & Infra', p: 'Python · Bash · CMake · Docker · Git / GitLab · MongoDB · Linux · AWS' },
  { idx: '06', h: 'Hardware', p: 'ABB IRB6700 / IRB2600 · LMI Gocator · Universal Robots UR-5 · Clearpath Jackal · Intel RealSense · Hokuyo LiDAR' },
];

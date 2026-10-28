import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

interface Station {
  x: number;
  z: number;
  color: string;
  title: string;
  tag: string;
  url: string;
  shape: 'ico' | 'octa' | 'torus';
}

interface Screen {
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  station: Station;
}

const STATIONS: Station[] = [
  { x: -7, z: -4, color: '#34cfff', title: 'DriveAI', tag: 'AI car rental platform',
    url: 'https://github.com/muzy326/car_application', shape: 'ico' },
  { x: 0, z: -6, color: '#b58aff', title: 'Bakery-Hub', tag: 'Bakery ordering web app',
    url: 'https://github.com/muzy326/Bakery-Hub', shape: 'torus' },
  { x: 7, z: -4, color: '#4be0ae', title: 'PlumAI', tag: 'AI e-commerce store',
    url: 'https://github.com/muzy326/e-commerce', shape: 'octa' },
];

// ---------- animated canvas content for the developer bay ----------
type Ctx = CanvasRenderingContext2D;

interface LiveScreen {
  ctx: Ctx;
  texture: THREE.CanvasTexture;
  w: number;
  h: number;
  every: number;
  draw: (c: Ctx, w: number, h: number, t: number) => void;
}

function drawCode(c: Ctx, w: number, h: number, t: number): void {
  c.fillStyle = '#0b1020';
  c.fillRect(0, 0, w, h);
  c.fillStyle = '#141c33';
  c.fillRect(0, 0, w, 34);
  ['#ff5f56', '#ffbd2e', '#27c93f'].forEach((color, i) => {
    c.fillStyle = color;
    c.beginPath();
    c.arc(20 + i * 22, 17, 6, 0, Math.PI * 2);
    c.fill();
  });
  c.fillStyle = '#9fb3d9';
  c.font = '16px monospace';
  c.textAlign = 'left';
  c.fillText('app.component.ts — portfolio', 90, 22);
  c.fillStyle = '#0e1528';
  c.fillRect(0, 34, 150, h - 34);
  c.fillStyle = '#6f82a8';
  c.font = '14px monospace';
  ['src', '  app', '   studio-3d', '   project-card', '   skills', 'package.json'].forEach((name, i) => {
    c.fillText(name, 14, 62 + i * 24);
  });
  const colors = ['#7aa2ff', '#ff9e64', '#9ece6a', '#bb9af7', '#e0af68'];
  const lineCount = 11;
  const gap = 360;
  const progress = (t * 170) % (lineCount * gap + 400);
  for (let i = 0; i < lineCount; i++) {
    const random = (((i + 3) * 9301 + 49297) % 233280) / 233280;
    const lineWidth = 90 + random * 300;
    const drawn = Math.min(Math.max(progress - i * gap, 0), lineWidth);
    if (drawn <= 0) continue;
    const y = 62 + i * 26;
    let x = 172 + (i % 3) * 26;
    let remaining = drawn;
    let chunk = 0;
    while (remaining > 0) {
      const size = Math.min(remaining, 38 + ((i * 7 + chunk * 13) % 50));
      c.fillStyle = colors[(i + chunk) % colors.length]!;
      c.globalAlpha = 0.85;
      c.fillRect(x, y, size, 10);
      x += size + 8;
      remaining -= size + 8;
      chunk++;
    }
    c.globalAlpha = 1;
    if (drawn < lineWidth && Math.floor(t * 3) % 2 === 0) {
      c.fillStyle = '#ffffff';
      c.fillRect(x, y - 3, 3, 16);
    }
  }
  c.globalAlpha = 1;
}

function drawDashboard(c: Ctx, w: number, h: number, t: number): void {
  c.fillStyle = '#071226';
  c.fillRect(0, 0, w, h);
  c.fillStyle = '#0f2140';
  c.fillRect(0, 0, w, 34);
  c.fillStyle = '#7fd8ff';
  c.font = 'bold 16px Arial';
  c.textAlign = 'left';
  c.fillText('BUILD PIPELINE', 14, 22);
  for (let i = 0; i < 8; i++) {
    const value = 0.35 + 0.55 * Math.abs(Math.sin(t * 1.3 + i * 0.8));
    const barHeight = value * h * 0.45;
    c.fillStyle = i % 2 ? '#d946ef' : '#38bdf8';
    c.fillRect(24 + i * 52, h * 0.62 - barHeight, 34, barHeight);
  }
  c.strokeStyle = '#4be0ae';
  c.lineWidth = 3;
  c.beginPath();
  for (let x = 0; x <= w - 48; x += 8) {
    const y = h * 0.84 + Math.sin(x * 0.03 + t * 2) * 14;
    if (x === 0) c.moveTo(24 + x, y);
    else c.lineTo(24 + x, y);
  }
  c.stroke();
  const cx = w - 70;
  const cy = 90;
  c.lineWidth = 8;
  c.strokeStyle = '#1a2c52';
  c.beginPath();
  c.arc(cx, cy, 34, 0, Math.PI * 2);
  c.stroke();
  c.strokeStyle = '#38bdf8';
  c.beginPath();
  c.arc(cx, cy, 34, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ((t * 0.2) % 1));
  c.stroke();
  c.fillStyle = '#ffffff';
  c.font = 'bold 13px Arial';
  c.textAlign = 'center';
  c.fillText('DEPLOY', cx, cy + 5);
}

function drawFace(c: Ctx, w: number, h: number, t: number): void {
  const gradient = c.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#06223a');
  gradient.addColorStop(1, '#04101f');
  c.fillStyle = gradient;
  c.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  c.lineWidth = 4;
  c.strokeStyle = '#38bdf8';
  for (let i = 0; i < 3; i++) {
    const start = t * (1 + i * 0.4) + i;
    c.beginPath();
    c.arc(cx, cy, 78 + i * 20, start, start + Math.PI * 1.2);
    c.stroke();
  }
  c.strokeStyle = '#7fd8ff';
  c.lineWidth = 3;
  c.beginPath();
  c.ellipse(cx, cy, 50, 62, 0, 0, Math.PI * 2);
  c.stroke();
  const blink = t % 4 < 0.15 ? 0.1 : 1;
  c.fillStyle = '#7ff3ff';
  [-20, 20].forEach(dx => {
    c.beginPath();
    c.ellipse(cx + dx, cy - 8, 9, 9 * blink, 0, 0, Math.PI * 2);
    c.fill();
  });
  c.strokeStyle = '#7ff3ff';
  for (let i = 0; i < 3; i++) {
    c.beginPath();
    c.arc(cx, cy + 34, 8 + i * 8, -Math.PI * 0.8, -Math.PI * 0.2);
    c.stroke();
  }
  c.fillStyle = '#9fd9ff';
  c.font = 'bold 15px Arial';
  c.textAlign = 'center';
  c.fillText('AI ASSISTANT', cx, h - 14);
}

function drawMat(c: Ctx, w: number, h: number, t: number): void {
  c.fillStyle = '#04121f';
  c.fillRect(0, 0, w, h);
  for (let y = 8; y < h; y += 14) {
    for (let x = 8; x < w; x += 14) {
      const v = Math.sin(x * 0.05 + t * 1.2) * Math.cos(y * 0.06 - t * 0.8);
      if (v > 0.25) {
        c.fillStyle = `rgba(80,220,255,${0.3 + v * 0.7})`;
        c.fillRect(x, y, 6, 6);
      }
    }
  }
}

function drawKeys(c: Ctx, w: number, h: number, t: number): void {
  c.fillStyle = '#0b0f1c';
  c.fillRect(0, 0, w, h);
  const cols = 5;
  const rows = 13;
  const kw = w / cols;
  const kh = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let k = 0; k < cols; k++) {
      c.fillStyle = `hsl(${(t * 70 + k * 18 + r * 14) % 360},90%,58%)`;
      c.fillRect(k * kw + 2, r * kh + 2, kw - 4, kh - 4);
    }
  }
}

function drawHoloRobot(c: Ctx, w: number, h: number, t: number): void {
  c.fillStyle = '#10061f';
  c.fillRect(0, 0, w, h);
  c.strokeStyle = '#e6dcff';
  c.shadowColor = '#a78bfa';
  c.shadowBlur = 14;
  c.lineWidth = 4;
  c.lineCap = 'round';
  const cx = w / 2;
  const wave = Math.sin(t * 2.5) * 0.5;
  c.beginPath();
  c.arc(cx, 120, 34, 0, Math.PI * 2);
  c.stroke();
  c.strokeRect(cx - 38, 170, 76, 100);
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  };
  line(cx - 38, 185, cx - 80, 235);
  line(cx + 38, 185, cx + 38 + 62 * Math.cos(-0.9 + wave), 185 + 62 * Math.sin(-0.9 + wave));
  line(cx - 20, 270, cx - 24, 360);
  line(cx + 20, 270, cx + 24, 360);
  c.fillStyle = '#a5f3fc';
  [-12, 12].forEach(dx => {
    c.beginPath();
    c.arc(cx + dx, 116, 5, 0, Math.PI * 2);
    c.fill();
  });
  c.strokeStyle = '#a78bfa';
  c.beginPath();
  c.ellipse(cx, 392, 60 + Math.sin(t * 2) * 6, 12, 0, 0, Math.PI * 2);
  c.stroke();
  c.shadowBlur = 0;
}

function drawCircuit(c: Ctx, w: number, h: number, t: number): void {
  c.fillStyle = '#070a22';
  c.fillRect(0, 0, w, h);
  c.lineWidth = 3;
  for (let i = 0; i < 9; i++) {
    const y = 40 + i * 44;
    const random = ((i * 7919) % 100) / 100;
    const x1 = w * 0.3 + random * 80;
    const dy = 22 * (i % 2 ? 1 : -1);
    c.strokeStyle = '#2b3b86';
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(x1, y);
    c.lineTo(x1 + 30, y + dy);
    c.lineTo(w, y + dy);
    c.stroke();
    const px = ((t * 90 + i * 57) % (w + 40)) - 20;
    const py = px < x1 ? y : px < x1 + 30 ? y + (dy * (px - x1)) / 30 : y + dy;
    c.fillStyle = i % 2 ? '#d946ef' : '#38bdf8';
    c.beginPath();
    c.arc(px, py, 5, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#0d0a2a';
  c.fillRect(w / 2 - 50, h / 2 - 50, 100, 100);
  c.strokeStyle = '#d946ef';
  c.lineWidth = 4;
  c.strokeRect(w / 2 - 50, h / 2 - 50, 100, 100);
  c.fillStyle = '#f5d0fe';
  c.font = 'bold 40px Arial';
  c.textAlign = 'center';
  c.fillText('MM', w / 2, h / 2 + 14);
}

function drawRadar(c: Ctx, w: number, h: number, t: number): void {
  c.fillStyle = '#060d1f';
  c.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  c.strokeStyle = '#1f6f8f';
  c.lineWidth = 2;
  [60, 110, 160].forEach(r => {
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.stroke();
  });
  c.beginPath();
  c.moveTo(cx - 170, cy);
  c.lineTo(cx + 170, cy);
  c.moveTo(cx, cy - 170);
  c.lineTo(cx, cy + 170);
  c.stroke();
  const angle = t * 1.4;
  c.fillStyle = 'rgba(56,189,248,0.25)';
  c.beginPath();
  c.moveTo(cx, cy);
  c.arc(cx, cy, 165, angle - 0.6, angle);
  c.closePath();
  c.fill();
  c.strokeStyle = '#7fd8ff';
  c.beginPath();
  c.moveTo(cx, cy);
  c.lineTo(cx + Math.cos(angle) * 165, cy + Math.sin(angle) * 165);
  c.stroke();
  for (let i = 0; i < 6; i++) {
    const a = i * 1.9;
    const r = 40 + i * 24;
    const pulse = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.4 - a));
    c.fillStyle = `rgba(75,224,174,${pulse})`;
    c.beginPath();
    c.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 6, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = '#9fd9ff';
  c.font = 'bold 16px Arial';
  c.textAlign = 'center';
  c.fillText('ALL SYSTEMS ONLINE', cx, h - 18);
}

@Component({
  selector: 'app-studio-3d',
  standalone: true,
  template: `
    <section class="studio">
      <canvas #sceneCanvas aria-label="Interactive 3D developer studio"></canvas>

      <div class="hud">
        <div class="brand">MM <span>Developer studio</span></div>
        <div class="instructions">
          <strong>Explore my work</strong>
          <p>W A S D or arrow keys to move</p>
          <p>Drag the mouse or use left / right arrows to look</p>
          <p>Stand near a project and press E to open it</p>
          <p>Visit the developer bay on the left</p>
        </div>

        <a class="resume" href="/resume.pdf" download="Mohammed-Mujeeba-Resume.pdf">
          Download Resume ↗
        </a>
        <button class="exit" type="button" (click)="exitStudio()">Back to Portfolio</button>
        <div #prompt class="prompt" role="status"></div>
      </div>

      <div class="footer">Angular · Three.js · Built by Mohammed Mujeeba</div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .studio {
      position: relative; height: 100vh; min-height: 560px; overflow: hidden;
      color: #f3f6ff; background: #050814; font-family: Arial, sans-serif;
    }
    canvas { display: block; width: 100%; height: 100%; outline: none; cursor: grab; touch-action: none; }
    canvas:active { cursor: grabbing; }
    .hud { position: absolute; inset: 0; pointer-events: none; }
    .brand { position: absolute; top: 24px; left: 26px; font-size: 25px; font-weight: 800; letter-spacing: 2px; }
    .brand span { display: block; margin-top: 5px; font-size: 11px; letter-spacing: 3px; color: #80d9ff; font-weight: 600; }
    .instructions {
      position: absolute; left: 26px; bottom: 65px; max-width: 330px; padding: 18px;
      border: 1px solid #34425e; border-radius: 12px; background: #0c1425cc; line-height: 1.6;
      backdrop-filter: blur(6px);
    }
    .instructions strong { color: #80d9ff; font-size: 13px; letter-spacing: 1px; }
    .instructions p { margin: 8px 0 0; font-size: 13px; color: #d1d9eb; }
    .resume, .exit {
      position: absolute; top: 25px; pointer-events: auto; padding: 12px 16px;
      border: 1px solid #536683; border-radius: 8px; color: white; background: #111c30cc;
      text-decoration: none; font-size: 13px; cursor: pointer;
    }
    .resume { right: 190px; }
    .exit { right: 25px; }
    .resume:hover, .exit:hover { background: #17415b; }
    .prompt {
      position: absolute; left: 50%; bottom: 90px; transform: translateX(-50%);
      padding: 12px 20px; border-radius: 999px; background: #0c1425e6;
      border: 1px solid #80d9ff; color: #fff; font-size: 15px;
      opacity: 0; transition: opacity .2s;
    }
    .prompt.show { opacity: 1; }
    .footer { position: absolute; bottom: 22px; right: 25px; color: #a6b5cf; font-size: 11px; letter-spacing: 1px; pointer-events: none; }
    @media (max-width: 600px) {
      .brand { top: 18px; left: 16px; }
      .resume { top: 100px; left: 16px; right: auto; }
      .exit { top: 100px; right: 16px; }
      .instructions { left: 12px; bottom: 48px; max-width: 255px; padding: 12px; }
      .footer { right: 12px; bottom: 12px; font-size: 9px; }
    }
  `],
})
export class Studio3DComponent implements AfterViewInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @ViewChild('sceneCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('prompt', { static: true }) promptRef!: ElementRef<HTMLDivElement>;

  private readonly zone = inject(NgZone);
  private renderer?: THREE.WebGLRenderer;
  private composer?: EffectComposer;
  private bloom?: UnrealBloomPass;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private readonly clock = new THREE.Clock();
  private animationId = 0;
  private frame = 0;

  private readonly keys = new Set<string>();
  private readonly velocity = new THREE.Vector3();
  private yaw = 0;
  private pitch = 0;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private nearStation: Station | null = null;

  private readonly animated: Array<(time: number, delta: number) => void> = [];
  private readonly screens: Screen[] = [];
  private particles?: THREE.Points;
  private readonly live: LiveScreen[] = [];

  private readonly onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      event.preventDefault();
      this.keys.add(key);
    }
    if (key === 'e' && this.nearStation) {
      window.open(this.nearStation.url, '_blank', 'noopener');
    }
  };
  private readonly onKeyUp = (event: KeyboardEvent) => this.keys.delete(event.key.toLowerCase());
  private readonly onBlur = () => this.keys.clear();
  private readonly onResize = () => this.resize();
  private readonly onPointerDown = (event: PointerEvent) => {
    this.dragging = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  };
  private readonly onPointerMove = (event: PointerEvent) => {
    if (!this.dragging) return;
    this.yaw -= (event.clientX - this.lastX) * 0.004;
    this.pitch = THREE.MathUtils.clamp(this.pitch - (event.clientY - this.lastY) * 0.003, -0.6, 0.6);
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  };
  private readonly onPointerUp = () => { this.dragging = false; };

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.createStudio();
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('blur', this.onBlur);
      window.addEventListener('resize', this.onResize);
      window.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('pointerup', this.onPointerUp);
      this.canvasRef.nativeElement.addEventListener('pointerdown', this.onPointerDown);
      this.animate();
    });
  }

  // ---------- scene ----------
  private createStudio(): void {
    const canvas = this.canvasRef.nativeElement;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050814');
    scene.fog = new THREE.FogExp2('#050814', 0.035);
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0.5, 1.7, 10);
    this.yaw = 0.38;
    camera.rotation.order = 'YXZ';
    this.camera = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    this.renderer = renderer;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    this.bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), 0.85, 0.6, 0.7
    );
    composer.addPass(this.bloom);
    composer.addPass(new OutputPass());
    this.composer = composer;

    scene.add(new THREE.HemisphereLight('#9fd8ff', '#1a2140', 1.1));

    this.buildRoom(scene);
    STATIONS.forEach(station => this.buildStation(scene, station));
    this.buildCenterpiece(scene);
    this.buildNameplate(scene);
    this.buildParticles(scene);
    this.buildDeveloper(scene);
  }

  private glow(color: string, intensity: number): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: '#000000', emissive: color, emissiveIntensity: intensity,
    });
  }

  private buildRoom(scene: THREE.Scene): void {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 26),
      new THREE.MeshStandardMaterial({ color: '#0f1830', roughness: 0.35, metalness: 0.7 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const grid = new THREE.GridHelper(26, 26, '#2f9fd6', '#1b2a4a');
    grid.position.y = 0.01;
    scene.add(grid);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: '#0b1226', roughness: 0.9 });
    const back = new THREE.Mesh(new THREE.PlaneGeometry(26, 8), wallMaterial);
    back.position.set(0, 4, -12);
    scene.add(back);
    const left = new THREE.Mesh(new THREE.PlaneGeometry(26, 8), wallMaterial);
    left.position.set(-13, 4, 0);
    left.rotation.y = Math.PI / 2;
    scene.add(left);
    const right = left.clone();
    right.position.x = 13;
    right.rotation.y = -Math.PI / 2;
    scene.add(right);

    // Glowing ceiling strips and wall trims (these bloom).
    const strips: Array<[number, number, number, number, number, string]> = [
      [0, 7.6, -3, 14, 0.12, '#38bdf8'],
      [0, 7.6, 3, 14, 0.12, '#9b8aff'],
      [0, 0.15, -11.9, 26, 0.1, '#38bdf8'],
    ];
    strips.forEach(([x, y, z, w, h, color]) => {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), this.glow(color, 3));
      strip.position.set(x, y, z);
      scene.add(strip);
    });
  }

  private buildStation(scene: THREE.Scene, station: Station): void {
    const { x, z, color } = station;

    // Backing wall panel with a glowing frame.
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 2.4, 0.2),
      new THREE.MeshStandardMaterial({ color: '#15213b', roughness: 0.5, metalness: 0.4 })
    );
    panel.position.set(x, 2.3, z);
    scene.add(panel);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.07, 0.25), this.glow(color, 3.5));
    frame.position.set(x, 3.55, z);
    scene.add(frame);
    const frameBottom = frame.clone();
    frameBottom.position.y = 1.05;
    scene.add(frameBottom);

    // Animated screen showing the project.
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 320;
    const ctx = screenCanvas.getContext('2d');
    const texture = new THREE.CanvasTexture(screenCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.3, 2.06),
      new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
    );
    screenMesh.position.set(x, 2.3, z + 0.12);
    scene.add(screenMesh);
    if (ctx) {
      this.screens.push({ ctx, texture, station });
      this.drawScreen({ ctx, texture, station }, 0);
    }

    // Floor ring and light pool.
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.03, 12, 64), this.glow(color, 4));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, 0.05, z + 2);
    scene.add(ring);
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 48),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12 })
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(x, 0.03, z + 2);
    scene.add(disc);

    // Floating hologram above the ring.
    let geometry: THREE.BufferGeometry;
    if (station.shape === 'ico') geometry = new THREE.IcosahedronGeometry(0.55, 1);
    else if (station.shape === 'octa') geometry = new THREE.OctahedronGeometry(0.6, 0);
    else geometry = new THREE.TorusKnotGeometry(0.4, 0.13, 96, 12);
    const holo = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: '#000000', emissive: color, emissiveIntensity: 2.2, wireframe: true,
      })
    );
    holo.position.set(x, 1.5, z + 2);
    scene.add(holo);
    const phase = x;
    this.animated.push((t, dt) => {
      holo.rotation.y += dt * 0.9;
      holo.rotation.x += dt * 0.4;
      holo.position.y = 1.5 + Math.sin(t * 1.6 + phase) * 0.12;
      ring.scale.setScalar(1 + Math.sin(t * 2 + phase) * 0.04);
    });

    const light = new THREE.PointLight(color, 18, 9, 2);
    light.position.set(x, 2.2, z + 2.2);
    scene.add(light);
  }

  private buildCenterpiece(scene: THREE.Scene): void {
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.9, 0.22, 160, 18, 2, 3),
      new THREE.MeshStandardMaterial({
        color: '#0a1020', emissive: '#6ee7ff', emissiveIntensity: 1.6, metalness: 0.9, roughness: 0.2,
      })
    );
    knot.position.set(0, 2.6, 0);
    scene.add(knot);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 1.1, 0.3, 48),
      new THREE.MeshStandardMaterial({ color: '#1a2744', metalness: 0.8, roughness: 0.3 })
    );
    base.position.set(0, 0.15, 0);
    scene.add(base);
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.04, 12, 64), this.glow('#6ee7ff', 4));
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.set(0, 0.32, 0);
    scene.add(baseRing);

    const light = new THREE.PointLight('#6ee7ff', 22, 12, 2);
    light.position.set(0, 3.2, 0.5);
    scene.add(light);

    this.animated.push((t, dt) => {
      knot.rotation.y += dt * 0.6;
      knot.rotation.x += dt * 0.25;
      knot.position.y = 2.6 + Math.sin(t * 1.2) * 0.15;
    });
  }

  private buildNameplate(scene: THREE.Scene): void {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#e8f6ff';
    ctx.font = 'bold 96px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MOHAMMED MUJEEBA', 512, 120);
    ctx.fillStyle = '#80d9ff';
    ctx.font = '40px Arial';
    ctx.fillText('Front-End Developer · Angular · React · TypeScript', 512, 190);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 2.25),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false })
    );
    plate.position.set(0, 5.6, -11.85);
    scene.add(plate);
  }

  private buildParticles(scene: THREE.Scene): void {
    const count = 450;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = Math.random() * 7.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: '#8fdcff', size: 0.06, transparent: true, opacity: 0.8,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
    scene.add(this.particles);
    this.animated.push((_t, dt) => {
      const attribute = geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let y = attribute.getY(i) + dt * (0.15 + (i % 5) * 0.05);
        if (y > 7.5) y = 0;
        attribute.setY(i, y);
      }
      attribute.needsUpdate = true;
    });
  }

  // ---------- developer bay (cyber desk, side view) ----------
  private placeLimb(mesh: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3): void {
    const direction = new THREE.Vector3().subVectors(to, from);
    const length = direction.length();
    mesh.position.copy(from).addScaledVector(direction, 0.5);
    mesh.scale.set(1, length, 1);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  }

  private addLive(
    width: number, height: number, every: number,
    draw: (c: Ctx, w: number, h: number, t: number) => void
  ): THREE.Material {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.MeshBasicMaterial({ color: '#0b1020' });
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    this.live.push({ ctx, texture, w: width, h: height, every, draw });
    draw(ctx, width, height, 0);
    texture.needsUpdate = true;
    return new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  }

  private buildDeveloper(scene: THREE.Scene): void {
    const group = new THREE.Group();
    group.position.set(-4, 0, 4.5); // she faces +x, so the camera sees her profile
    scene.add(group);

    const skin = new THREE.MeshStandardMaterial({ color: '#e7b28f', roughness: 0.6 });
    const cloth = new THREE.MeshStandardMaterial({ color: '#b3303c', roughness: 0.85 });
    const hoodie = new THREE.MeshStandardMaterial({ color: '#2b3d63', roughness: 0.8 });
    const dark = new THREE.MeshStandardMaterial({ color: '#0b0f1a', roughness: 0.6 });
    const pants = new THREE.MeshStandardMaterial({ color: '#1c2233', roughness: 0.8 });
    const metal = new THREE.MeshStandardMaterial({ color: '#2a3550', roughness: 0.4, metalness: 0.7 });
    const light = new THREE.MeshStandardMaterial({ color: '#cfd8ea', roughness: 0.35, metalness: 0.3 });
    const desk = new THREE.MeshStandardMaterial({ color: '#1b2540', roughness: 0.45, metalness: 0.5 });

    const part = (
      geometry: THREE.BufferGeometry, material: THREE.Material,
      x: number, y: number, z: number, parent: THREE.Object3D = group
    ): THREE.Mesh => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    };

    const neonFrame = (cx: number, cy: number, cz: number, w: number, h: number, color: string): void => {
      const m = this.glow(color, 3.5);
      part(new THREE.BoxGeometry(w + 0.1, 0.06, 0.08), m, cx, cy + h / 2, cz);
      part(new THREE.BoxGeometry(w + 0.1, 0.06, 0.08), m, cx, cy - h / 2, cz);
      part(new THREE.BoxGeometry(0.06, h, 0.08), m, cx - w / 2 - 0.02, cy, cz);
      part(new THREE.BoxGeometry(0.06, h, 0.08), m, cx + w / 2 + 0.02, cy, cz);
    };

    // Rug with a glowing edge.
    const rug = part(new THREE.CircleGeometry(2.2, 48),
      new THREE.MeshBasicMaterial({ color: '#a855f7', transparent: true, opacity: 0.1 }), 0.8, 0.02, 0);
    rug.rotation.x = -Math.PI / 2;
    const rugRing = part(new THREE.TorusGeometry(2.2, 0.03, 12, 72), this.glow('#a855f7', 2.5), 0.8, 0.04, 0);
    rugRing.rotation.x = Math.PI / 2;

    // Partition wall behind the desk with neon panels (the backdrop).
    part(new THREE.BoxGeometry(6.6, 3.2, 0.12), new THREE.MeshStandardMaterial({ color: '#0a0f24', roughness: 0.8 }),
      0.8, 1.6, -2.6);
    part(new THREE.BoxGeometry(6.6, 0.04, 0.16), this.glow('#8b5cf6', 3), 0.8, 0.03, -2.58);
    const panels: Array<[number, number, number, string, (c: Ctx, w: number, h: number, t: number) => void]> = [
      [-1.5, 1.9, 2.3, '#38bdf8', drawHoloRobot],
      [0.8, 2.2, 2.3, '#d946ef', drawCircuit],
      [3.1, 1.9, 2.3, '#8b5cf6', drawRadar],
    ];
    panels.forEach(([px, pw, ph, color, drawFn]) => {
      const material = this.addLive(Math.round(pw * 200), Math.round(ph * 200), 3, drawFn);
      part(new THREE.PlaneGeometry(pw, ph), material, px, 1.65, -2.53);
      neonFrame(px, 1.65, -2.52, pw, ph, color);
    });

    // Chair.
    part(new THREE.BoxGeometry(0.5, 0.07, 0.5), metal, -0.05, 0.5, 0);
    part(new THREE.BoxGeometry(0.06, 0.6, 0.46), metal, -0.3, 0.82, 0);
    part(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12), metal, -0.05, 0.25, 0);
    part(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 24), metal, -0.05, 0.03, 0);

    // Desk with glowing mat, keyboard and mouse.
    part(new THREE.BoxGeometry(1.5, 0.06, 2.5), desk, 1.0, 0.75, 0);
    [[0.35, 1.1], [0.35, -1.1], [1.65, 1.1], [1.65, -1.1]].forEach(([lx, lz]) => {
      part(new THREE.BoxGeometry(0.06, 0.72, 0.06), metal, lx!, 0.36, lz!);
    });
    part(new THREE.BoxGeometry(1.5, 0.02, 0.05), this.glow('#38bdf8', 3), 1.0, 0.73, 1.25);

    const mat = part(new THREE.PlaneGeometry(0.5, 1.3), this.addLive(192, 480, 4, drawMat), 0.97, 0.783, 0);
    mat.rotation.x = -Math.PI / 2;
    part(new THREE.BoxGeometry(0.22, 0.025, 0.52), dark, 0.55, 0.7925, 0);
    const keys = part(new THREE.PlaneGeometry(0.2, 0.5), this.addLive(100, 260, 4, drawKeys), 0.55, 0.806, 0);
    keys.rotation.x = -Math.PI / 2;
    part(new THREE.BoxGeometry(0.01, 0.02, 0.52), this.glow('#38bdf8', 4), 0.445, 0.795, 0);
    part(new THREE.BoxGeometry(0.07, 0.025, 0.045), dark, 0.62, 0.795, -0.5);
    part(new THREE.CylinderGeometry(0.04, 0.04, 0.09, 16), cloth, 0.5, 0.83, 1.0);

    // Three monitors in an arc; each one is turned toward her.
    const addMonitor = (
      x: number, y: number, z: number, theta: number, w: number, h: number, material: THREE.Material
    ): void => {
      const mon = new THREE.Group();
      mon.position.set(x, y, z);
      mon.rotation.y = theta;
      group.add(mon);
      part(new THREE.BoxGeometry(w + 0.04, h + 0.04, 0.05), dark, 0, 0, 0, mon);
      part(new THREE.PlaneGeometry(w, h), material, 0, 0, 0.028, mon);
      const stand = y - h / 2 - 0.78;
      part(new THREE.BoxGeometry(0.06, stand, 0.04), metal, 0, -(h / 2 + stand / 2), -0.04, mon);
      part(new THREE.BoxGeometry(0.26, 0.015, 0.18), metal, 0, -(h / 2 + stand) + 0.008, -0.04, mon);
    };
    addMonitor(1.55, 1.22, 0, -Math.PI / 2, 1.1, 0.62, this.addLive(640, 360, 3, drawCode));
    addMonitor(1.35, 1.17, 1.05, -Math.PI / 2 - 0.46, 0.8, 0.5, this.addLive(512, 320, 3, drawDashboard));
    addMonitor(1.35, 1.17, -1.05, -Math.PI / 2 + 0.46, 0.8, 0.5, this.addLive(512, 320, 3, drawFace));

    // Floating robot helper.
    const bot = new THREE.Group();
    bot.position.set(1.4, 2.2, 1.5);
    group.add(bot);
    const white = new THREE.MeshStandardMaterial({ color: '#eef2ff', roughness: 0.35, metalness: 0.2 });
    part(new THREE.SphereGeometry(0.14, 24, 18), white, 0, 0, 0, bot);
    const visor = part(new THREE.SphereGeometry(0.11, 24, 18),
      new THREE.MeshStandardMaterial({ color: '#05070d', roughness: 0.1, metalness: 0.8 }), 0, 0.005, 0.045, bot);
    visor.scale.set(1, 0.8, 0.8);
    const eyeMaterial = this.glow('#7ff3ff', 5);
    const eyes = [-0.04, 0.04].map(ex => part(new THREE.SphereGeometry(0.02, 12, 10), eyeMaterial, ex, 0.01, 0.118, bot));
    part(new THREE.CapsuleGeometry(0.07, 0.08, 4, 12), white, 0, -0.2, 0, bot);
    const halo = part(new THREE.TorusGeometry(0.2, 0.008, 8, 40), this.glow('#7ff3ff', 3), 0, -0.33, 0, bot);
    halo.rotation.x = Math.PI / 2;

    // Her: legs, hips, hoodie.
    part(new THREE.BoxGeometry(0.3, 0.16, 0.4), pants, 0, 0.62, 0);
    ([0.1, -0.1] as number[]).forEach(z => {
      part(new THREE.BoxGeometry(0.5, 0.15, 0.17), pants, 0.22, 0.62, z);
      part(new THREE.BoxGeometry(0.14, 0.5, 0.16), pants, 0.5, 0.33, z);
      part(new THREE.BoxGeometry(0.28, 0.08, 0.17), dark, 0.58, 0.04, z);
    });
    const torso = part(new THREE.CapsuleGeometry(0.17, 0.3, 6, 16), hoodie, 0, 0.97, 0);
    torso.scale.z = 1.25;
    torso.rotation.z = -0.1;

    // Hijab drape over the shoulders.
    const drape = part(new THREE.SphereGeometry(0.3, 32, 20), cloth, -0.02, 1.2, 0);
    drape.scale.set(0.8, 0.75, 1.05);

    // Head (profile): skin face in front, hijab over the back and sides.
    const head = new THREE.Group();
    head.position.set(0.1, 1.5, 0);
    head.rotation.z = -0.1;
    group.add(head);
    const face = part(new THREE.SphereGeometry(0.15, 32, 24), skin, 0.03, 0, 0, head);
    face.scale.set(0.95, 1.05, 0.92);
    const hijabHead = part(new THREE.SphereGeometry(0.18, 32, 24), cloth, -0.06, 0.025, 0, head);
    hijabHead.scale.set(1, 1.08, 1);

    const nose = part(new THREE.SphereGeometry(0.028, 16, 12), skin, 0.185, -0.02, 0, head);
    nose.scale.set(1.1, 1, 0.8);
    const noseRing = part(new THREE.TorusGeometry(0.012, 0.003, 8, 20),
      new THREE.MeshStandardMaterial({ color: '#f2c14e', metalness: 0.9, roughness: 0.25 }),
      0.196, -0.042, 0.022, head);
    noseRing.rotation.y = Math.PI / 2;
    part(new THREE.SphereGeometry(0.018, 16, 12),
      new THREE.MeshStandardMaterial({ color: '#2a1710', roughness: 0.3 }), 0.115, 0.025, 0.107, head);
    part(new THREE.SphereGeometry(0.006, 8, 8), new THREE.MeshBasicMaterial({ color: '#ffffff' }), 0.12, 0.032, 0.122, head);
    const brow = part(new THREE.BoxGeometry(0.05, 0.009, 0.012),
      new THREE.MeshStandardMaterial({ color: '#3a2418' }), 0.112, 0.062, 0.1, head);
    brow.rotation.z = 0.12;
    const lips = part(new THREE.SphereGeometry(0.02, 16, 12),
      new THREE.MeshStandardMaterial({ color: '#d9726f', roughness: 0.5 }), 0.168, -0.075, 0.015, head);
    lips.scale.set(0.5, 0.5, 1.5);
    part(new THREE.SphereGeometry(0.03, 16, 12),
      new THREE.MeshBasicMaterial({ color: '#ff8f8f', transparent: true, opacity: 0.3 }), 0.105, -0.03, 0.1, head);

    // Headset with a glowing ear cup and a microphone boom.
    const headband = part(new THREE.TorusGeometry(0.215, 0.011, 8, 40, Math.PI), light, 0, 0.01, 0, head);
    headband.rotation.y = Math.PI / 2;
    ([0.205, -0.205] as number[]).forEach(z => {
      const cup = part(new THREE.CylinderGeometry(0.055, 0.055, 0.035, 24), light, 0, 0, z, head);
      cup.rotation.x = Math.PI / 2;
      part(new THREE.TorusGeometry(0.04, 0.005, 8, 32), this.glow('#7ff3ff', 4), 0, 0, z * 1.12, head);
    });
    const boomPoints = [
      new THREE.Vector3(0, -0.02, 0.215), new THREE.Vector3(0.075, -0.1, 0.16), new THREE.Vector3(0.15, -0.098, 0.075),
    ];
    for (let i = 0; i < 2; i++) {
      const boom = part(new THREE.CylinderGeometry(0.004, 0.004, 1, 8), light, 0, 0, 0, head);
      this.placeLimb(boom, boomPoints[i]!, boomPoints[i + 1]!);
    }
    part(new THREE.SphereGeometry(0.014, 12, 10), dark, 0.15, -0.098, 0.075, head);

    // Arms and hands that type.
    const shoulders = [new THREE.Vector3(0.02, 1.2, 0.19), new THREE.Vector3(0.02, 1.2, -0.19)];
    const elbows = [new THREE.Vector3(0.1, 0.92, 0.24), new THREE.Vector3(0.1, 0.92, -0.24)];
    const upper = shoulders.map(() => part(new THREE.CylinderGeometry(0.055, 0.05, 1, 12), hoodie, 0, 0, 0));
    const fore = shoulders.map(() => part(new THREE.CylinderGeometry(0.045, 0.04, 1, 12), hoodie, 0, 0, 0));
    const hands = shoulders.map(() => part(new THREE.SphereGeometry(0.05, 12, 10), skin, 0, 0, 0));

    // Neon lighting: purple from behind, cool glow from the screens, warm fill on her.
    const purple = new THREE.PointLight('#a855f7', 26, 9, 2);
    purple.position.set(0.8, 2.6, -1.8);
    group.add(purple);
    const blue = new THREE.PointLight('#38bdf8', 12, 6, 2);
    blue.position.set(1.2, 1.3, 0);
    group.add(blue);
    const fill = new THREE.PointLight('#ffb3a0', 5, 5, 2);
    fill.position.set(0, 2.2, 0.9);
    group.add(fill);

    // Sign above her.
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 768;
    signCanvas.height = 160;
    const signCtx = signCanvas.getContext('2d');
    if (signCtx) {
      signCtx.fillStyle = '#ffd6da';
      signCtx.font = 'bold 64px Arial';
      signCtx.textAlign = 'center';
      signCtx.fillText('Building projects…', 384, 95);
    }
    const signTexture = new THREE.CanvasTexture(signCanvas);
    signTexture.colorSpace = THREE.SRGBColorSpace;
    part(new THREE.PlaneGeometry(1.8, 0.375),
      new THREE.MeshBasicMaterial({ map: signTexture, transparent: true, toneMapped: false }), 0.7, 2.5, 0);

    this.animated.push(t => {
      // Typing: hands tap in turn, head nods; the robot hovers and blinks.
      hands.forEach((hand, i) => {
        const tap = Math.max(0, Math.sin(t * 14 + i * 3)) * 0.012;
        const target = new THREE.Vector3(
          0.58 + Math.sin(t * 9 + i * 2) * 0.015, 0.84 + tap, i === 0 ? 0.13 : -0.13
        );
        hand.position.copy(target);
        this.placeLimb(upper[i]!, shoulders[i]!, elbows[i]!);
        this.placeLimb(fore[i]!, elbows[i]!, target);
      });
      head.rotation.z = -0.1 + Math.sin(t * 0.8) * 0.02;
      bot.position.y = 2.2 + Math.sin(t * 1.4) * 0.07;
      bot.rotation.y = Math.sin(t * 0.7) * 0.4;
      const blink = t % 3.5 < 0.12 ? 0.1 : 1;
      eyes.forEach(eye => eye.scale.set(1, blink, 1));
    });
  }

  // ---------- animated project screens ----------
  private drawScreen(screen: Screen, time: number): void {
    const { ctx, texture, station } = screen;
    const w = 512;
    const h = 320;
    ctx.fillStyle = '#07101f';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = station.color;
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.textAlign = 'left';
    ctx.fillStyle = station.color;
    ctx.font = 'bold 44px Arial';
    ctx.fillText(station.title, 28, 70);
    ctx.fillStyle = '#b8c6e0';
    ctx.font = '22px Arial';
    ctx.fillText(station.tag, 28, 104);

    // Scrolling "code" lines.
    const rowHeight = 22;
    const scroll = (time * 28) % rowHeight;
    const shift = Math.floor((time * 28) / rowHeight);
    ctx.save();
    ctx.beginPath();
    ctx.rect(20, 120, w - 40, 138);
    ctx.clip();
    ctx.fillStyle = station.color;
    for (let i = 0; i < 8; i++) {
      const seed = i + shift;
      const random = ((seed * 9301 + 49297) % 233280) / 233280;
      const indent = (seed % 3) * 24;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(28 + indent, 126 + i * rowHeight - scroll, 90 + random * 270, 8);
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    const blink = Math.floor(time * 1.5) % 2 === 0;
    ctx.fillStyle = blink ? '#ffffff' : '#7d8cab';
    ctx.font = '20px Arial';
    ctx.fillText('Press E to open on GitHub', 28, 292);
    texture.needsUpdate = true;
  }

  // ---------- loop ----------
  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    const { camera, composer } = this;
    if (!camera || !composer) return;

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const time = this.clock.elapsedTime;
    this.frame++;

    this.animated.forEach(fn => fn(time, delta));
    if (this.frame % 4 === 0) this.screens.forEach(s => this.drawScreen(s, time));
    this.live.forEach(screen => {
      if (this.frame % screen.every !== 0) return;
      screen.draw(screen.ctx, screen.w, screen.h, time);
      screen.texture.needsUpdate = true;
    });

    // Turning and movement with smoothing.
    if (this.keys.has('arrowleft')) this.yaw += 1.9 * delta;
    if (this.keys.has('arrowright')) this.yaw -= 1.9 * delta;

    const forward = this.keys.has('w') || this.keys.has('arrowup');
    const backward = this.keys.has('s') || this.keys.has('arrowdown');
    const strafeLeft = this.keys.has('a');
    const strafeRight = this.keys.has('d');

    const direction = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const side = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const target = new THREE.Vector3();
    if (forward) target.add(direction);
    if (backward) target.sub(direction);
    if (strafeRight) target.add(side);
    if (strafeLeft) target.sub(side);
    if (target.lengthSq() > 0) target.normalize().multiplyScalar(5);
    this.velocity.lerp(target, 1 - Math.exp(-10 * delta));
    camera.position.addScaledVector(this.velocity, delta);

    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -11, 11);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -10, 11);
    camera.position.y = 1.7 + Math.sin(time * 9) * 0.03 * Math.min(this.velocity.length() / 5, 1);
    camera.rotation.y = this.yaw;
    camera.rotation.x = this.pitch;

    this.updatePrompt();
    composer.render();
  };

  private updatePrompt(): void {
    const camera = this.camera;
    if (!camera) return;
    let nearest: Station | null = null;
    for (const station of STATIONS) {
      const dx = camera.position.x - station.x;
      const dz = camera.position.z - (station.z + 2);
      if (Math.hypot(dx, dz) < 3.2) nearest = station;
    }
    if (nearest === this.nearStation) return;
    this.nearStation = nearest;
    const prompt = this.promptRef.nativeElement;
    if (nearest) {
      prompt.textContent = `Press E to open ${nearest.title} on GitHub`;
      prompt.classList.add('show');
    } else {
      prompt.classList.remove('show');
    }
  }

  private resize(): void {
    if (!this.camera || !this.renderer || !this.composer) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }

  exitStudio(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.canvasRef.nativeElement.removeEventListener('pointerdown', this.onPointerDown);

    this.scene?.traverse(object => {
      const item = object as THREE.Mesh;
      item.geometry?.dispose();
      const material = item.material;
      if (material) {
        (Array.isArray(material) ? material : [material]).forEach(m => {
          (m as THREE.MeshBasicMaterial).map?.dispose();
          m.dispose();
        });
      }
    });
    this.composer?.dispose();
    this.renderer?.dispose();
  }
}
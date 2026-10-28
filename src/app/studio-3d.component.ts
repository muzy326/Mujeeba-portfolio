
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-studio-3d',
  standalone: true,
  template: `
    <section class="studio">
      <canvas #sceneCanvas aria-label="Interactive 3D developer studio"></canvas>

      <div class="hud">
        <div class="brand">MM <span>DEVELOPER STUDIO</span></div>
        <div class="instructions">
          <strong>EXPLORE MY WORLD</strong>
          <p>W A S D or arrow keys to move</p>
          <p>Use the arrow keys to turn</p>
          <p>Look around and explore the project stations.</p>
        </div>

        <a class="resume" href="/resume.pdf"
           download="Mohammed-Mujeeba-Resume.pdf">
          Download Resume ↗
        </a>

        <button class="exit" type="button" (click)="exitStudio()">
          Back to Portfolio
        </button>
      </div>

      <div class="crosshair" aria-hidden="true">+</div>
      <div class="footer">ANGULAR · THREE.JS · BUILT BY MOHAMMED Mujeeba</div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .studio {
      position: relative;
      height: 100vh;
      min-height: 560px;
      overflow: hidden;
      color: #f3f6ff;
      background: #080c18;
      font-family: Arial, sans-serif;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
      outline: none;
    }
    .hud {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .brand {
      position: absolute;
      top: 24px;
      left: 26px;
      font-size: 25px;
      font-weight: 800;
      letter-spacing: 2px;
    }
    .brand span {
      display: block;
      margin-top: 5px;
      font-size: 10px;
      letter-spacing: 3px;
      color: #80d9ff;
    }
    .instructions {
      position: absolute;
      left: 26px;
      bottom: 65px;
      max-width: 310px;
      padding: 18px;
      border: 1px solid #34425e;
      border-radius: 12px;
      background: #0c1425dd;
      line-height: 1.6;
    }
    .instructions strong {
      color: #80d9ff;
      letter-spacing: 2px;
      font-size: 12px;
    }
    .instructions p {
      margin: 8px 0 0;
      font-size: 13px;
      color: #d1d9eb;
    }
    .resume, .exit {
      position: absolute;
      top: 25px;
      pointer-events: auto;
      padding: 12px 16px;
      border: 1px solid #536683;
      border-radius: 8px;
      color: white;
      background: #111c30;
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
    }
    .resume { right: 190px; }
    .exit { right: 25px; }
    .resume:hover, .exit:hover { background: #17415b; }
    .crosshair {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #80d9ff;
      font-size: 24px;
      pointer-events: none;
    }
    .footer {
      position: absolute;
      bottom: 22px;
      right: 25px;
      color: #a6b5cf;
      font-size: 10px;
      letter-spacing: 1px;
      pointer-events: none;
    }
    @media (max-width: 600px) {
      .brand { top: 18px; left: 16px; }
      .resume { top: 100px; left: 16px; right: auto; }
      .exit { top: 100px; right: 16px; }
      .instructions {
        left: 12px;
        bottom: 48px;
        max-width: 255px;
        padding: 12px;
      }
      .footer { right: 12px; bottom: 12px; font-size: 8px; }
    }
  `],
})
export class Studio3DComponent implements AfterViewInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @ViewChild('sceneCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private animationId = 0;
  private readonly keys = new Set<string>();
  private yaw = 0;
  private readonly moveSpeed = 0.12;
  private readonly onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown',
         'arrowleft', 'arrowright'].includes(key)) {
      event.preventDefault();
      this.keys.add(key);
    }
  };
  private readonly onKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.key.toLowerCase());
  };
  private readonly onBlur = () => this.keys.clear();
  private readonly onResize = () => this.resize();

  ngAfterViewInit(): void {
    this.createStudio();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('resize', this.onResize);
    this.animate();
  }

  private createStudio(): void {
    const canvas = this.canvasRef.nativeElement;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#080c18');
    this.scene.fog = new THREE.Fog('#080c18', 14, 42);

    this.camera = new THREE.PerspectiveCamera(
      70, window.innerWidth / window.innerHeight, 0.1, 100
    );
    this.camera.position.set(0, 1.7, 8);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene.add(new THREE.HemisphereLight('#c8e5ff', '#172035', 2));

    const light = new THREE.DirectionalLight('#ffffff', 2.5);
    light.position.set(4, 9, 5);
    light.castShadow = true;
    this.scene.add(light);

    this.addBox(0, -0.15, 0, 24, 0.3, 24, '#172237');
    this.addBox(0, 3, -12, 24, 6, 0.3, '#121b30');
    this.addBox(-12, 3, 0, 0.3, 6, 24, '#10192c');
    this.addBox(12, 3, 0, 0.3, 6, 24, '#10192c');

    // Glowing grid on the floor.
    const grid = new THREE.GridHelper(24, 24, '#2979a8', '#23304a');
    grid.position.y = 0.02;
    this.scene.add(grid);

    // Three project stations.
    this.addStation(-6, -3, '#34cfff', 'DRIVEAI');
    this.addStation(0, -5, '#b58aff', 'BAKERY-HUB');
    this.addStation(6, -3, '#4be0ae', 'AI PROJECTS');

    // Central desk and computer monitors.
    this.addBox(0, 0.85, 2, 4.5, 0.18, 1.5, '#33435e');
    this.addBox(0, 1.65, 1.5, 1.4, 1.2, 0.12, '#273b58');
    this.addBox(-1.6, 1.45, 1.5, 0.8, 0.8, 0.1, '#1b9cc4');
    this.addBox(1.6, 1.45, 1.5, 0.8, 0.8, 0.1, '#8764df');

    // Ceiling light strips.
    this.addBox(0, 5.7, -3, 12, 0.06, 0.12, '#38bdf8');
    this.addBox(0, 5.7, 4, 8, 0.06, 0.12, '#9b8aff');
  }

  private addBox(
    x: number, y: number, z: number,
    width: number, height: number, depth: number,
    color: string
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.65,
        metalness: 0.2,
      })
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene!.add(mesh);
    return mesh;
  }

  private addStation(x: number, z: number, color: string, label: string): void {
    this.addBox(x, 0.8, z, 3.3, 1.6, 0.25, '#24334d');
    this.addBox(x, 1.8, z + 0.02, 2.8, 0.08, 0.12, color);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = color;
      context.font = 'bold 42px Arial';
      context.textAlign = 'center';
      context.fillText(label, 256, 78);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 0.7),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      })
    );
    sign.position.set(x, 1.4, z + 0.15);
    this.scene!.add(sign);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    if (!this.camera || !this.renderer || !this.scene) return;

    if (this.keys.has('arrowleft')) this.yaw += 0.035;
    if (this.keys.has('arrowright')) this.yaw -= 0.035;

    const forward = this.keys.has('w') || this.keys.has('arrowup');
    const backward = this.keys.has('s') || this.keys.has('arrowdown');
    const left = this.keys.has('a');
    const right = this.keys.has('d');

    const direction = new THREE.Vector3(
      -Math.sin(this.yaw), 0, -Math.cos(this.yaw)
    );
    const side = new THREE.Vector3(
      Math.cos(this.yaw), 0, -Math.sin(this.yaw)
    );

    if (forward) this.camera.position.addScaledVector(direction, this.moveSpeed);
    if (backward) this.camera.position.addScaledVector(direction, -this.moveSpeed);
    if (left) this.camera.position.addScaledVector(side, -this.moveSpeed);
    if (right) this.camera.position.addScaledVector(side, this.moveSpeed);

    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -10, 10);
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, -10, 10);
    this.camera.position.y = 1.7;

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;

    this.renderer.render(this.scene, this.camera);
  };

  private resize(): void {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
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
    this.renderer?.dispose();
    this.scene?.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material : [object.material];
        materials.forEach(material => {
          if ('map' in material && material.map) material.map.dispose();
          material.dispose();
        });
      }
    });
  }
}

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

export class App {
  rotationX = 0.01;
  rotationY = 0.01;
  cubeWidth = 1;
  cubeHeight = 1;
  cubeDepth = 1;

  private constructor(
    private readonly _renderer: THREE.Renderer,
    private readonly _scene: THREE.Scene,
    private readonly _camera: THREE.PerspectiveCamera,
    private readonly _cube: THREE.Mesh,
    private readonly _orbitControls: OrbitControls,
    private readonly _stats: Stats,
    private readonly _gui: GUI
  ) {
    this._scene.add(this._cube);
  }

  private _onWindowResize() {
    const [w, h] = [window.innerWidth, Math.max(1, window.innerHeight)];
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(w, h);
    this._render();
  }

  private _render() {
    this._renderer.render(this._scene, this._camera);
  }

  private _proccessFrame(t: number) {
    requestAnimationFrame(this._proccessFrame.bind(this));
    this._cube.rotation.x += this.rotationX;
    this._cube.rotation.z += this.rotationY;
    this._cube.scale.x = this.cubeWidth;
    this._cube.scale.y = this.cubeHeight;
    this._cube.scale.z = this.cubeDepth;
    this._render();
    this._stats.update();
  }

  run() {
    this._proccessFrame(0);
  }

  static create(): App {
    const [w, h] = [window.innerWidth, Math.max(1, window.innerHeight)];
    const renderer: THREE.Renderer = new THREE.WebGL1Renderer();
    renderer.setSize(w, h);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, w / h, 0.1, 1000);
    camera.position.z = 2;
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      })
    );
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    const stats = Stats();
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(stats.dom);
    const gui = new GUI();
    const res = new App(
      renderer,
      scene,
      camera,
      cube,
      orbitControls,
      stats,
      gui
    );
    const rotationFolder = gui.addFolder("Cube rotation");
    rotationFolder.add(res, "rotationX", 0, 1, 0.01);
    rotationFolder.add(res, "rotationY", 0, 1, 0.01);
    const sizeFolder = gui.addFolder("Cube size");
    sizeFolder.add(res, "cubeWidth", 0.1, 10, 0.1);
    sizeFolder.add(res, "cubeHeight", 0.1, 10, 0.1);
    sizeFolder.add(res, "cubeDepth", 0.1, 10, 0.1);
    window.addEventListener("resize", res._onWindowResize.bind(res), false);
    return res;
  }
}

import * as THREE from "three";

export class App {
  private constructor(
    private readonly _renderer: THREE.Renderer,
    private readonly _scene: THREE.Scene,
    private readonly _camera: THREE.PerspectiveCamera,
    private readonly _cube: THREE.Mesh
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
    this._cube.rotation.x += 0.01;
    this._cube.rotation.z += 0.01;
    this._render();
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
    document.body.appendChild(renderer.domElement);
    const res = new App(renderer, scene, camera, cube);
    window.addEventListener("resize", res._onWindowResize.bind(res), false);
    return res;
  }
}

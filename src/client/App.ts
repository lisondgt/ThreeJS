import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "dat.gui";

export class App {
  oldTime = 0;
  oldAMercure = 0;
  oldAVenus = 0;
  oldATerre = 0;
  oldAMars = 0;
  oldALune = 0;
  rotation = 1;
  grid = true;

  private constructor(
    private readonly _renderer: THREE.Renderer,
    private readonly _scene: THREE.Scene,
    private readonly _camera: THREE.PerspectiveCamera,
    private readonly _soleil: THREE.Mesh,
    private readonly _mercure: THREE.Mesh,
    private readonly _venus: THREE.Mesh,
    private readonly _terre: THREE.Mesh,
    private readonly _mars: THREE.Mesh,
    private readonly _lune: THREE.Mesh,
    private readonly _orbitControls: OrbitControls,
    private readonly _stats: Stats,
    private readonly _gui: GUI,
    private readonly _floor: THREE.Mesh,
    private readonly _spotlight: THREE.SpotLight,
    private readonly _axeSoleil: THREE.AxesHelper,
    private readonly _gridSoleil: THREE.GridHelper,
    private readonly _axeTerre: THREE.AxesHelper,
    private readonly _gridTerre: THREE.GridHelper
  ) {
    this._scene.add(this._soleil);
    this._scene.add(this._mercure);
    this._scene.add(this._venus);
    this._scene.add(this._terre);
    this._scene.add(this._mars);
    this._scene.add(this._axeSoleil);
    this._scene.add(this._gridSoleil);
    this._terre.add(this._axeTerre);
    this._terre.add(this._gridTerre);
    this._terre.add(this._lune);
    this._scene.add(this._floor);
    this._scene.add(this._spotlight);
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
    const dt = t - this.oldTime;

    const DAMercure = (1.003196807 * this.rotation * dt) / 1000;
    const AMercure = (this.oldAMercure - DAMercure) % (2 * Math.PI);
    this._mercure.position.x = Math.cos(AMercure) * 3.8;
    this._mercure.position.z = Math.sin(AMercure) * 3.8;
    this.oldAMercure = AMercure;
    const DAVenus = (0.302521 * this.rotation * dt) / 1000;
    const AVenus = (this.oldAVenus - DAVenus) % (2 * Math.PI);
    this._venus.position.x = Math.cos(AVenus) * 7.2;
    this._venus.position.z = Math.sin(AVenus) * 7.2;
    this.oldAVenus = AVenus;
    const DATerre = (0.159235669 * this.rotation * dt) / 1000;
    const ATerre = (this.oldATerre - DATerre) % (2 * Math.PI);
    this._terre.position.x = Math.cos(ATerre) * 10;
    this._terre.position.z = Math.sin(ATerre) * 10;
    this.oldATerre = ATerre;
    this._terre.rotation.y += (4 * this.rotation * dt) / 1000;
    const DAMars = (0.025203044 * this.rotation * dt) / 1000;
    const AMars = (this.oldAMars - DAMars) % (2 * Math.PI);
    this._mars.position.x = Math.cos(AMars) * 15.2;
    this._mars.position.z = Math.sin(AMars) * 15.2;
    this.oldAMars = AMars;
    const DALune = (5 * this.rotation * dt) / 1000;
    const ALune = (this.oldALune - DALune) % (2 * Math.PI);
    this._lune.position.x = Math.cos(ALune) * 2;
    this._lune.position.z = Math.sin(ALune) * 2;
    this.oldALune = ALune;

    this.oldTime = t;
    this._render();
    this._stats.update();
  }

  run() {
    this._proccessFrame(0);
  }

  static create(): App {
    const [w, h] = [window.innerWidth, Math.max(1, window.innerHeight)];
    const renderer = new THREE.WebGL1Renderer();
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, w / h, 0.1, 1000);
    camera.position.z = 2;
    const soleil = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshPhongMaterial({
        color: "yellow",
      })
    );
    soleil.scale.x = 1;
    soleil.scale.y = 1;
    soleil.scale.z = 1;
    soleil.castShadow = true;
    const mercure = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshPhongMaterial({
        color: "brown",
      })
    );
    mercure.scale.x = 0.5 * 0.382;
    mercure.scale.y = 0.5 * 0.382;
    mercure.scale.z = 0.5 * 0.382;
    mercure.castShadow = true;
    const venus = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshPhongMaterial({
        color: "white",
      })
    );
    venus.scale.x = 0.5 * 0.948;
    venus.scale.y = 0.5 * 0.948;
    venus.scale.z = 0.5 * 0.948;
    venus.castShadow = true;
    var material = new THREE.MeshPhongMaterial();
    material.map = new THREE.TextureLoader().load("img/earthtexture.jpg");
    material.bumpMap = new THREE.TextureLoader().load(
      "img/bumpMappingTexture.jpg"
    );
    material.bumpScale = 0.05;
    material.specularMap = new THREE.TextureLoader().load(
      "img/specularTexture.jpg"
    );
    material.specular = new THREE.Color("grey");
    const terre = new THREE.Mesh(new THREE.SphereGeometry(), material);
    terre.scale.x = 0.5;
    terre.scale.y = 0.5;
    terre.scale.z = 0.5;
    terre.castShadow = true;
    const mars = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshPhongMaterial({
        color: "red",
      })
    );
    mars.scale.x = 0.5 * 0.532;
    mars.scale.y = 0.5 * 0.532;
    mars.scale.z = 0.5 * 0.532;
    mars.castShadow = true;
    const lune = new THREE.Mesh(
      new THREE.SphereGeometry(),
      new THREE.MeshPhongMaterial({
        color: "white",
      })
    );
    lune.scale.x = 0.3;
    lune.scale.y = 0.3;
    lune.scale.z = 0.3;
    lune.castShadow = true;
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    const stats = Stats();
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshPhongMaterial({ color: "grey" })
    );
    floor.material.side = THREE.DoubleSide;
    floor.rotation.x = Math.PI * 0.5;
    floor.position.y = -3;
    floor.receiveShadow = true;
    const spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.y = 10;
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(stats.dom);
    const axeSoleil = new THREE.AxesHelper(2);
    const gridSoleil = new THREE.GridHelper(4);
    const axeTerre = new THREE.AxesHelper(2);
    const gridTerre = new THREE.GridHelper(4);
    const gui = new GUI();
    const res = new App(
      renderer,
      scene,
      camera,
      soleil,
      mercure,
      venus,
      terre,
      mars,
      lune,
      orbitControls,
      stats,
      gui,
      floor,
      spotlight,
      axeSoleil,
      gridSoleil,
      axeTerre,
      gridTerre
    );
    const rotationFolder = gui.addFolder("Vitesse de rotataion");
    rotationFolder.add(res, "rotation", 0.2, 10, 0.1);
    const settingsFolder = gui.addFolder("Réglages");
    settingsFolder.add(res, "grid");
    window.addEventListener("resize", res._onWindowResize.bind(res), false);
    return res;
  }
}

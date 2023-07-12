import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";

import Stats from "three/examples/jsm/libs/stats.module";
import * as dat from "dat.gui";

interface $Props {
  canvas?: HTMLCanvasElement;
  width?: number;
  height?: number;
  camera?: THREE.PerspectiveCamera;
  orthographicCamera?: THREE.OrthographicCamera;
  perspectiveCamera?: THREE.PerspectiveCamera;
  perspectiveCamera1?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  mesh?: THREE.Mesh;
  renderer?: THREE.WebGLRenderer;
  orbitControls?: OrbitControls;
  stats?: Stats;
  clock?: THREE.Clock;
  cameraHelper?: THREE.CameraHelper;
  gui?: dat.GUI;
  carGroup?: THREE.Group;
  texture?: THREE.Texture;
  aoMap?: THREE.Texture;
  normalMap?: THREE.Texture;
  matcap1?: THREE.Texture;
  matcap2?: THREE.Texture;
  matcap3?: THREE.Texture;
  threeToOne?: THREE.Texture;
  fiveToOne?: THREE.Texture;
  textureLoader?: THREE.TextureLoader;
  roughnessTexture?: THREE.Texture;
  metalnessMap?: THREE.Texture;
  wallTexture?: THREE.Texture;
  envTexture?: THREE.CubeTexture;
  material?: THREE.MeshToonMaterial;
  physicalMaterial?: THREE.MeshPhysicalMaterial;
  hdrMap1?: THREE.DataTexture;
  hdrMap2?: THREE.DataTexture;
  directionalLight?: THREE.DirectionalLight;
  ambientLight?: THREE.AmbientLight;
  createScene: () => void;
  createCamera: () => void;
  datGui: () => void;
  createMesh: () => void;
  createLight: () => void;
  createRenderer: () => void;
  helpers: () => void;
  controls: () => void;
  createStats: () => void;
  animate: () => void;
  fitView: () => void;
  init: () => void;
  loadTextures: () => void;
  createMeshs: () => void;
}

const $: $Props = {
  createScene() {
    const canvas = document.getElementById("c") as HTMLCanvasElement;
    const width = window.innerWidth - 200;
    const height = window.innerHeight - 70;

    // 创建3D场景
    const scene = new THREE.Scene();

    const fog = new THREE.Fog(0xe0e0e0, 0, 20);

    fog.name = "fog";

    scene.fog = fog;

    scene.background = new THREE.Color(0xe0e0e0);

    const clock = new THREE.Clock();
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.scene = scene;
    this.clock = clock;
  },
  createCamera() {
    const perspectiveCamera1 = new THREE.PerspectiveCamera(
      75,
      this.width! / this.height!,
      0.1,
      1000
    ); // 透视相机

    // 设置相机位置
    perspectiveCamera1.position.set(0, 1, 4); // 相机默认的坐标是在(0,0,0);
    // 设置相机方向
    perspectiveCamera1.lookAt(this.scene!.position); // 将相机朝向场景
    // 将相机添加到场景中
    this.scene!.add(perspectiveCamera1);
    this.perspectiveCamera1 = perspectiveCamera1;
    this.camera = perspectiveCamera1;
  },
  datGui() {
    const gui = new dat.GUI();

    gui.add(this.orbitControls!, "enabled"); //启用禁用 控制器

    gui.add(this.ambientLight!, "intensity", 0, 1, 0.1).name("环境光强度"); //环境光照强度
    gui.add(this.ambientLight!, "visible").name("环境光可见性"); //环境光可见性

    gui.addColor({ color: 0xffffff }, "color").onChange((val) => {
      this.ambientLight!.color = new THREE.Color(val);
    });

    const boxFolder = gui.addFolder("box");

    boxFolder.open();

    boxFolder
      .add(this.mesh!.material as THREE.MeshLambertMaterial, "fog")
      .onChange((val) => {
        const material = new THREE.MeshLambertMaterial({ color: 0x189ff });
        material.fog = val;
        this.mesh!.material = material;
      });
    boxFolder.add(this.mesh!.position, "z", -50, 50, 0.1);

    const fogFolder = gui.addFolder("fog");

    fogFolder.open();

    fogFolder.add(this.scene!.fog! as THREE.Fog, "near", 0, 100, 0.1);
    fogFolder.add(this.scene!.fog! as THREE.Fog, "far", 30, 100, 0.1);
    fogFolder
      .addColor(this.scene!.fog! as THREE.Fog, "color")
      .onChange((val) => {
        const color = new THREE.Color(val.r, val.g, val.b);
        this.scene!.fog!.color = color;
        this.scene!.background = color;
      });

    this.gui = gui;
  },
  createMesh() {
    for (let index = 0; index < 300; index++) {
      this.createMeshs();
    }
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0x1890ff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.5;
    this.mesh = mesh;

    const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    const floor = new THREE.Mesh(
      planeGeometry,
      new THREE.MeshLambertMaterial({
        color: 0xd0d0d0,
        side: THREE.DoubleSide,
      })
    );
    floor.rotation.x = -Math.PI / 2;

    this.scene!.add(mesh, floor);
  },
  createMeshs() {
    const geometry = new THREE.TorusGeometry(
      Math.random(),
      Math.abs(Math.random() - 0.5),
      64
    );

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshMatcapMaterial({ matcap: this.matcap1 })
    );

    this.scene?.add(mesh);

    mesh.position.set(
      (Math.random() - 0.5) * 50,
      1,
      (Math.random() - 0.5) * 50
    );
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    mesh.scale.set(
      Math.random() * 0.3 + 0.5,
      Math.random() * 0.3 + 0.5,
      Math.random() * 0.3 + 0.5
    );
  },
  loadTextures() {
    // 初始化一个加载器
    const loader = new THREE.TextureLoader();

    this.matcap1 = loader.load(
      "/src/assets/textures/textures/matcaps/BA472D_CA6E67-256px.png"
    );
  },
  createLight() {
    // 创建全局光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    this.ambientLight = ambientLight;
    this.scene!.add(ambientLight);
  },
  createRenderer() {
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true, // 抗锯齿
    });

    //开启阴影渲染
    // renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比

    // 设置渲染器大小
    renderer.setSize(this.width!, this.height!);
    this.renderer = renderer;
  },
  helpers() {
    // 创建坐标轴
    const axesHelper = new THREE.AxesHelper(3);
    //创建辅助网格
    const gridHelper = new THREE.GridHelper();
    this.scene!.add(axesHelper, gridHelper);
  },
  controls() {
    // 创建控制器
    const orbitControls = new OrbitControls(this.camera!, this.canvas!);
    orbitControls.enableDamping = true; // 开启阻尼效果
    orbitControls.dampingFactor = 0.5; // 阻尼系数
    this.orbitControls = orbitControls;

    const dragControls = new DragControls(
      [this.mesh!],
      this.camera!,
      this.canvas
    );

    dragControls.addEventListener("dragstart", () => {
      orbitControls.enabled = false;
    });
    dragControls.addEventListener("dragend", () => {
      orbitControls.enabled = true;
    });
  },
  createStats() {
    // 创建性能监控器
    const stats = new Stats();
    stats.showPanel(0);
    stats.dom.style.position = "absolute";
    stats.dom.style.left = "200px";
    stats.dom.style.top = "70px";
    document.body.appendChild(stats.dom);
    this.stats = stats;
  },

  animate() {
    this.orbitControls!.update();
    this.stats!.update();
    this.renderer!.render(this.scene!, this.camera!);
    requestAnimationFrame(this.animate.bind(this));
  },
  fitView() {
    // 监听窗口变化
    const onWindowResize = () => {
      const width = window.innerWidth - 200;
      const height = window.innerHeight - 70;
      this.width = width;
      this.height = height;

      if (this.camera?.type === "PerspectiveCamera") {
        this.camera!.aspect = this.width / this.height;
      }
      this.camera!.updateProjectionMatrix();
      this.renderer!.setSize(this.width, this.height);
    };
    window.addEventListener("resize", onWindowResize, false);
  },
  init() {
    this.createScene();
    this.loadTextures();
    this.createMesh();
    this.createCamera();
    this.controls();
    this.createLight();
    this.helpers();
    this.createRenderer();
    this.createStats();
    this.datGui();

    this.animate();
    this.fitView();
  },
};

const ReactDev = () => {
  useEffect(() => {
    $.init();
    return () => {
      $.gui?.destroy();
    };
  }, []);
  return (
    <>
      <canvas id="c" />
    </>
  );
};
ReactDev.displayName = "7-1. Fog-线性雾";
export default ReactDev;

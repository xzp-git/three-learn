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
}

const $: $Props = {
  createScene() {
    const canvas = document.getElementById("c") as HTMLCanvasElement;
    const width = window.innerWidth - 200;
    const height = window.innerHeight - 70;

    // 创建3D场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
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
    perspectiveCamera1.position.set(3, 2, 2); // 相机默认的坐标是在(0,0,0);
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

    gui.add(this.directionalLight!.position, "x", -10, 10, 0.1);
    gui.add(this.directionalLight!.position, "y", -10, 10, 0.1);
    gui.add(this.directionalLight!.position, "z", -10, 10, 0.1);

    this.gui = gui;
  },
  createMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x1890ff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true; //产生阴影
    mesh.position.x = 1.5;
    mesh.position.y = 1;

    const shadowMaterial = new THREE.ShadowMaterial();
    const shadowGeometry = new THREE.PlaneGeometry(10, 10);

    const planeShadow = new THREE.Mesh(shadowGeometry, shadowMaterial);

    planeShadow.receiveShadow = true; // 接收阴影
    planeShadow.position.x = 1.5;
    planeShadow.rotation.x = -Math.PI / 2;

    const floorMesh = new THREE.Mesh(
      shadowGeometry,
      new THREE.MeshBasicMaterial({ map: this.texture })
    );

    floorMesh.position.x = 1.5;
    floorMesh.rotation.x = -Math.PI / 2;

    const wallShadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    wallShadow.receiveShadow = true; // 接收阴影
    wallShadow.position.x = 1.5;
    wallShadow.position.z = -1;

    const wallFloor = new THREE.Mesh(
      shadowGeometry,
      new THREE.MeshBasicMaterial({ map: this.wallTexture })
    );
    wallFloor.position.x = 1.5;
    wallFloor.position.z = -1;

    this.mesh = mesh;
    this.scene!.add(mesh, planeShadow, floorMesh, wallShadow, wallFloor);
  },
  loadTextures() {
    // 初始化一个加载器
    const loader = new THREE.TextureLoader();

    this.texture = loader.load(
      "/src/assets/textures/textures/floor_tiles_06/floor_tiles_06_diff_2k.jpg"
    );

    this.wallTexture = loader.load(
      "/src/assets/textures/textures/large_sandstone_blocks/large_sandstone_blocks_diff_2k.jpg"
    );
  },
  createLight() {
    // 创建全局光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    // 创建平行光源
    const light = new THREE.DirectionalLight(0xffffff, 0.8);

    light.position.set(1, 2, 2);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 40;
    light.shadow.radius = 1.5;
    light.shadow.mapSize.x = 1024;
    light.shadow.mapSize.y = 1024;

    light.position.set(1, 2, 2);

    this.directionalLight = light;
    this.scene!.add(light, ambientLight);
  },
  createRenderer() {
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true, // 抗锯齿
    });

    //开启阴影渲染
    renderer.shadowMap.enabled = true;
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
ReactDev.displayName = "5-5. 阴影材质";
export default ReactDev;

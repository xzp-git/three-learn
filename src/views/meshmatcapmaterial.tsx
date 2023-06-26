import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

import Stats from "three/examples/jsm/libs/stats.module";
import * as dat from "dat.gui";
import { BoxGeometry } from "three";

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
  textureLoader?: THREE.TextureLoader;
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
    perspectiveCamera1.position.set(4, 4, 6); // 相机默认的坐标是在(0,0,0);
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

    this.gui = gui;
  },
  createMesh() {
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    const material = new THREE.MeshMatcapMaterial({
      matcap: this.matcap1,
    });

    const mesh = new THREE.Mesh(geometry, material);

    const boxGeometry = new THREE.SphereGeometry(1, 64, 64);
    const boxMaterial = new THREE.MeshMatcapMaterial({
      matcap: this.matcap2,
    });

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = 3.5;

    const geometry1 = new THREE.SphereGeometry(1, 64, 64);

    const material1 = new THREE.MeshMatcapMaterial({
      matcap: this.matcap3,
    });

    const mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.x = 5.5;

    this.scene!.add(mesh, box, mesh1);
    this.mesh = mesh;
  },
  loadTextures() {
    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log(
        "Started loading file: " +
          url +
          ".\nLoaded " +
          itemsLoaded +
          " of " +
          itemsTotal +
          " files."
      );
    };

    manager.onLoad = function () {
      console.log("Loading complete!");
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log(
        "Loading file: " +
          url +
          ".\nLoaded " +
          itemsLoaded +
          " of " +
          itemsTotal +
          " files."
      );
    };

    manager.onError = function (url) {
      console.log("There was an error loading " + url);
    };

    // 初始化一个加载器

    const loader = new THREE.TextureLoader(manager);
    this.textureLoader = loader;

    // 加载一个资源 颜色贴图
    this.texture = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_basecolor.jpg",
      // onLoad回调
      function (texture) {
        // in this example we create the material when the texture is loaded
      },

      // 目前暂不支持onProgress的回调
      undefined,
      // onError回调
      function (err) {
        console.error("An error happened.");
      }
    );

    // ao贴图 环境遮挡贴图
    this.aoMap = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_ambientOcclusion.jpg"
    );

    // 法线贴图
    this.normalMap = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/Wood_Ceiling_Coffers_003/Wood_Ceiling_Coffers_003_normal.jpg"
    );
    this.matcap1 = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/matcaps/6D3B1C_844C31-256px.png"
    );
    this.matcap2 = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/matcaps/54584E_A7ACA3-256px.png"
    );
    this.matcap3 = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/matcaps/BA472D_CA6E67-256px.png"
    );
  },
  createLight() {
    // 创建全局光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    // 创建平行光源
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    this.scene!.add(light, ambientLight);
  },
  createRenderer() {
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true, // 抗锯齿
    });
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
ReactDev.displayName = "5-1. 网帽材质";
export default ReactDev;

import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

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
  envTexture?: THREE.CubeTexture;
  material?: THREE.MeshToonMaterial;
  physicalMaterial?: THREE.MeshPhysicalMaterial;
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
    perspectiveCamera1.position.set(0.5, 2, 6); // 相机默认的坐标是在(0,0,0);
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

    gui.add(this.physicalMaterial!, "envMapIntensity", 0, 1, 0.1);
    gui.add(this.physicalMaterial!, "metalness", 0, 1, 0.1);
    gui.add(this.physicalMaterial!, "roughness", 0, 1, 0.1);
    gui.add(this.physicalMaterial!, "clearcoat", 0, 1, 0.1);
    gui.add(this.physicalMaterial!, "transmission", 0, 1, 0.1);
    gui.add(this.physicalMaterial!, "ior", 1, 2.33, 0.01);
    gui.add(this.physicalMaterial!, "thickness", 0, 1, 0.1);

    this.gui = gui;
  },
  createMesh() {
    const geometry = new THREE.SphereGeometry(1, 64, 16);

    const material = new THREE.MeshStandardMaterial({
      map: this.texture,
    });

    // this.material = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = -1.5;
    mesh.position.y = 1.5;

    const boxGeometry = new THREE.SphereGeometry(1, 64, 16);
    const boxMaterial = new THREE.MeshPhysicalMaterial({
      //   map: this.texture!,
      envMap: this.envTexture!,
      envMapIntensity: 1, //通过乘以环境贴图的颜色来缩放环境贴图的效果。
      roughnessMap: this.roughnessTexture!,
      roughness: 0.1,
      clearcoat: 0.1, //表示clear coat层的强度，范围从0.0到1.0m，当需要在表面加一层薄薄的半透明材质的时候，可以使用与clear coat相关的属性，默认为0.0;
      transmission: 0.8, //透光率（或者说透光性），范围从0.0到1.0。默认值是0.0。
      ior: 1.0, //s为非金属材质所设置的折射率，范围由1.0到2.333。默认为1.5。
      thickness: 1.0,
    });

    this.physicalMaterial = boxMaterial;
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = 1.5;
    box.position.y = 1.5;

    this.scene!.add(mesh, box);
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

    const cubeTextureLoader = new THREE.CubeTextureLoader(manager);

    const loader = new THREE.TextureLoader(manager);
    this.textureLoader = loader;

    // 加载一个资源 颜色贴图
    this.texture = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_basecolor.jpg",
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

    this.threeToOne = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/threeTone.jpg"
    );

    this.fiveToOne = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/fiveTone.jpg"
    );

    this.roughnessTexture = loader.setCrossOrigin("anonymous").load(
      // 资源URL
      "/src/assets/textures/textures/Warning_Sign_HighVoltage_001/Warning_Sign_HighVoltage_001_roughness.jpg"
    );

    this.envTexture = cubeTextureLoader.load([
      "/src/assets/textures/textures/fullscreen/1.left.jpg",
      "/src/assets/textures/textures/fullscreen/1.right.jpg",
      "/src/assets/textures/textures/fullscreen/1.top.jpg",
      "/src/assets/textures/textures/fullscreen/1.bottom.jpg",
      "/src/assets/textures/textures/fullscreen/1.front.jpg",
      "/src/assets/textures/textures/fullscreen/1.back.jpg",
    ]);

    //hdr加载器
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
ReactDev.displayName = "5-3. 物理网格材质";
export default ReactDev;

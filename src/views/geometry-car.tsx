import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

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
  runCar: () => void;
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
    perspectiveCamera1.position.set(2, 2, 4); // 相机默认的坐标是在(0,0,0);
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
    const carGeometry = new THREE.BoxGeometry(2, 0.2, 1);

    const material = new THREE.MeshLambertMaterial({
      color: 0x1890ff,
    });

    const mesh = new THREE.Mesh(carGeometry, material);
    mesh.position.y = 0.1;

    //车轮
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
    });
    const wheelMesh1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelMesh1.rotation.x = -Math.PI / 2;
    wheelMesh1.position.set(-0.5, 0, 0.4);
    const wheelMesh2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelMesh2.rotation.x = -Math.PI / 2;
    wheelMesh2.position.set(-0.5, 0, -0.4);
    const wheelMesh3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelMesh3.rotation.x = -Math.PI / 2;
    wheelMesh3.position.set(0.5, 0, -0.4);
    const wheelMesh4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelMesh4.rotation.x = -Math.PI / 2;
    wheelMesh4.position.set(0.5, 0, 0.4);

    wheelMesh1.name = "wheel";
    wheelMesh2.name = "wheel";
    wheelMesh3.name = "wheel";
    wheelMesh4.name = "wheel";

    const lightGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
    });

    const light1 = new THREE.Mesh(lightGeometry, lightMaterial);
    light1.position.set(-1.05, 0.1, 0.25);
    const light2 = new THREE.Mesh(lightGeometry, lightMaterial);
    light2.position.set(-1.05, 0.1, -0.25);

    // 使用group的好处是可以一起移动, group是把多个 mesh 放在一起
    const carGroup = new THREE.Group();
    carGroup.add(
      mesh,
      wheelMesh1,
      wheelMesh2,
      wheelMesh3,
      wheelMesh4,
      light1,
      light2
    );
    carGroup.position.y = 0.2;

    this.carGroup = carGroup;

    // 合并几何体 是把多个几何体合并成一个几何体 和 group 不一样, group 是把多个 mesh 放在一起
    const mergeGeometry = mergeBufferGeometries([
      carGeometry,
      wheelGeometry,
      lightGeometry,
    ]);
    const mesh1 = new THREE.Mesh(mergeGeometry, material);

    mesh1.position.y = -1;

    this.scene!.add(carGroup, mesh1);
    this.mesh = mesh;
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
  runCar() {
    const { children } = this.carGroup!;

    const detal = 4; // 一秒走多少度

    const speed = ((2 * Math.PI * 0.2) / 360) * detal; // 一度 对应的周长 是多少

    for (const i in children) {
      const mesh = children[i];
      if (mesh.name === "wheel") {
        mesh.rotation.y += THREE.MathUtils.radToDeg(detal);
      }
    }

    this.carGroup!.position.x -= speed;
    if (this.carGroup!.position.x < -10) {
      this.carGroup!.position.x = 10;
    }
  },
  animate() {
    this.orbitControls!.update();
    this.stats!.update();
    this.runCar();
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
ReactDev.displayName = "3-3.造个小车";
export default ReactDev;

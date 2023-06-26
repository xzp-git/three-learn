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
  camera?: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  orthographicCamera?: THREE.OrthographicCamera;
  thumbnailCamera?: THREE.OrthographicCamera;
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
  clipScene: () => void;
  clipThumbnail: () => void;
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
    //创建正交相机
    const frusttumSize = 2; //设置相机前方显示的高度
    const aspect = this.width! / this.height!;
    const orthographicCamera = new THREE.OrthographicCamera(
      -aspect * frusttumSize,
      aspect * frusttumSize,
      frusttumSize,
      -frusttumSize,
      0.1,
      1000
    );

    // 设置相机位置
    orthographicCamera.position.set(2, 2, 3); // 相机默认的坐标是在(0,0,0);
    // 设置相机方向
    orthographicCamera.lookAt(this.scene!.position); // 将相机朝向场景
    // 将相机添加到场景中
    this.scene!.add(orthographicCamera);
    this.orthographicCamera = orthographicCamera;
    this.camera = orthographicCamera;

    //创建正交相机
    const thumbnailCamera = new THREE.OrthographicCamera(
      -(150 / 200) * frusttumSize,
      (150 / 200) * frusttumSize,
      frusttumSize,
      -frusttumSize,
      0.1,
      1000
    );

    // 设置相机位置
    thumbnailCamera.position.set(2, 2, 3); // 相机默认的坐标是在(0,0,0);
    // 设置相机方向
    thumbnailCamera.lookAt(this.scene!.position); // 将相机朝向场景
    // 将相机添加到场景中
    this.scene!.add(thumbnailCamera);
    this.thumbnailCamera = thumbnailCamera;
  },
  datGui() {
    const gui = new dat.GUI();
    console.log(this.orbitControls);

    gui.add(this.orbitControls!, "enabled"); //启用禁用 控制器
    gui.add(this.orbitControls!, "dampingFactor", 0.01, 0.2, 0.01); //阻尼系数

    gui.add(this.orbitControls!, "enablePan"); //启用/禁用相机平移
    gui.add(this.orbitControls!, "panSpeed", 1, 10, 1); //相机平移速度

    gui.add(this.orbitControls!, "autoRotate"); //相机自动旋转
    gui.add(this.orbitControls!, "autoRotateSpeed", 1, 10, 1);

    gui.add(this.orbitControls!, "enableZoom");
    gui.add(this.orbitControls!, "zoomSpeed", 1, 10, 1);

    this.gui = gui;
  },
  createMesh() {
    // 创建立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // 创建立方体的材质
    const material = new THREE.MeshLambertMaterial({
      color: 0x1890ff,
    });
    // 创建物体对象
    const mesh = new THREE.Mesh(geometry, material);

    this.scene!.add(mesh);
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
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true, // 抗锯齿
      });
    }
    this.renderer.setScissorTest(true);

    this.clipScene();
    this.clipThumbnail();
  },
  clipScene() {
    const dpr = window.devicePixelRatio || 1;

    // 裁剪

    this.renderer!.setScissor(0, 0, this.width!, this.height!);
    this.renderer!.setClearColor(0x999999, 0.5);

    this.renderer!.setPixelRatio(dpr); // 设置像素比
    // 设置渲染器大小
    this.renderer!.setSize(this.width!, this.height!);

    this.renderer!.render(this.scene!, this.camera!);
  },
  clipThumbnail() {
    const w = this.width! - 150 - 10;

    this.thumbnailCamera!.position.copy(this.camera!.position);

    // 更新旋转
    this.thumbnailCamera!.rotation.copy(this.camera!.rotation);

    // 更新四元数 就是更新旋转
    this.thumbnailCamera!.quaternion.copy(this.camera!.quaternion);

    this.thumbnailCamera!.zoom = this.camera!.zoom;

    this.thumbnailCamera?.updateProjectionMatrix();

    this.renderer!.setScissor(w, 10, 150, 200);
    this.renderer!.setViewport(w, 10, 150, 200);
    this.renderer!.setClearColor(0x000000);
    this.renderer!.render(this.scene!, this.thumbnailCamera!);
  },
  helpers() {
    // 创建坐标轴
    const axesHelper = new THREE.AxesHelper(3);

    this.scene!.add(axesHelper);
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
    this.createRenderer();
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
ReactDev.displayName = "2-8.多相机同步渲染";
export default ReactDev;

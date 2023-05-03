import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
interface $Props {
  canvas?: HTMLCanvasElement;
  width?: number;
  height?: number;
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
  mesh?: THREE.Mesh;
  renderer?: THREE.WebGLRenderer;
  orbitControls?: OrbitControls;
  stats?: Stats;
  clock?: THREE.Clock;
  createScene: () => void;
  createCamera: () => void;
  createMesh: () => void;
  createLight: () => void;
  createRenderer: () => void;
  helpers: () => void;
  controls: () => void;
  createStats: () => void;
  animate: () => void;
  fitView: () => void;
  init: () => void;
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
    // 创建相机对象
    const camera = new THREE.PerspectiveCamera(75, this.width! / this.height!); // 透视相机

    // 设置相机位置
    camera.position.set(1, 1, 3); // 相机默认的坐标是在(0,0,0);
    // 设置相机方向
    camera.lookAt(this.scene!.position); // 将相机朝向场景
    // 将相机添加到场景中
    this.scene!.add(camera);
    this.camera = camera;
  },
  createMesh() {
    // 创建立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 创建立方体的材质
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0x1890ff,
    // });

    const faces = [];

    for (let index = 0; index < geometry.groups.length; index++) {
      const mesh = new THREE.MeshBasicMaterial({
        color: 0xffffff * Math.random(),
      });
      faces.push(mesh);
    }

    // 创建物体对象
    const mesh = new THREE.Mesh(geometry, faces);

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
  },
  createStats() {
    // 创建性能监控器
    const stats = Stats();
    stats.setMode(0);
    stats.dom.style.position = "absolute";
    stats.dom.style.left = "200px";
    stats.dom.style.top = "70px";
    document.body.appendChild(stats.dom);
    this.stats = stats;
  },
  animate() {
    const elapsedTime = this.clock!.getElapsedTime();
    this.mesh!.position.y = Math.sin(elapsedTime);
    this.mesh!.position.x = Math.cos(elapsedTime);
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
      this.camera!.aspect = this.width / this.height;
      this.camera!.updateProjectionMatrix();
      this.renderer!.setSize(this.width, this.height);
    };
    window.addEventListener("resize", onWindowResize, false);
  },
  init() {
    this.createScene();
    this.createCamera();
    this.createMesh();
    this.createLight();
    this.helpers();
    this.controls();
    this.createRenderer();
    this.createStats();
    this.animate();
    this.fitView();
  },
};

const ReactDev = () => {
  useEffect(() => {
    $.init();
  }, []);
  return (
    <>
      <canvas id="c" />
    </>
  );
};

export default ReactDev;

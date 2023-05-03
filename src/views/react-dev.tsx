import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

const ReactDev = () => {
  useEffect(() => {
    const canvas = document.getElementById("c") as HTMLCanvasElement;
    const width = window.innerWidth - 200;
    const height = window.innerHeight - 70;

    // 创建3D场景
    const scene = new THREE.Scene();
    // 创建立方体
    const box = new THREE.BoxGeometry(1, 1, 1);

    // 创建坐标轴
    const axesHelper = new THREE.AxesHelper(3);
    //创建辅助网格
    const gridHelper = new THREE.GridHelper();

    scene.add(axesHelper, gridHelper);

    // 创建立方体的材质
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0x1890ff,
    // });

    const faces = [];

    for (let index = 0; index < box.groups.length; index++) {
      const mesh = new THREE.MeshBasicMaterial({
        color: 0xffffff * Math.random(),
      });
      faces.push(mesh);
    }

    // 创建物体对象
    const mesh = new THREE.Mesh(box, faces);

    scene.add(mesh);

    // 创建全局光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    // 创建平行光源
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(light, ambientLight);

    // 创建相机对象
    const camera = new THREE.PerspectiveCamera(75, width / height); // 透视相机

    // 设置相机位置
    camera.position.set(1, 1, 3); // 相机默认的坐标是在(0,0,0);
    // 设置相机方向
    camera.lookAt(scene.position); // 将相机朝向场景
    // 将相机添加到场景中
    scene.add(camera);

    // 创建控制器
    const orbitControls = new OrbitControls(camera, canvas);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true, // 抗锯齿
    });
    renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比

    // 设置渲染器大小
    renderer.setSize(width, height);

    // 创建性能监控器
    const stats = Stats();
    stats.setMode(0);
    stats.dom.style.position = "absolute";
    stats.dom.style.left = "200px";
    stats.dom.style.top = "70px";
    document.body.appendChild(stats.dom);

    const clock = new THREE.Clock();

    // 创建动画
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      mesh.position.y = Math.sin(elapsedTime);
      mesh.position.x = Math.cos(elapsedTime);
      orbitControls.update();
      stats.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // 监听窗口变化
    const onWindowResize = () => {
      const width = window.innerWidth - 200;
      const height = window.innerHeight - 70;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onWindowResize, false);
  }, []);
  return (
    <>
      <canvas id="c" />
    </>
  );
};

export default ReactDev;

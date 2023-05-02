import { useEffect } from "react";
import * as THREE from "three";

const ReactDev = () => {
  useEffect(() => {
    const canvas = document.getElementById("c") as HTMLCanvasElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // 创建3D场景
    const scene = new THREE.Scene();
    // 创建立方体
    const box = new THREE.BoxGeometry(1, 1, 1);
    console.log(box);

    const axesHelper = new THREE.AxesHelper(1);

    scene.add(axesHelper);

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
    console.log(mesh);

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

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true, // 抗锯齿
    });
    renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比

    // 设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 执行渲染
    renderer.render(scene, camera);
  }, []);
  return (
    <>
      <canvas id="c" />
    </>
  );
};

export default ReactDev;

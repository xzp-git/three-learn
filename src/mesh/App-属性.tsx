import "./App.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";
import door from "@/assets/textures/door/color.jpg";

function renderBox(divRef: HTMLDivElement | null) {
  // 创建场景
  const scene = new THREE.Scene();

  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // 设置相机的位置
  camera.position.set(0, 0, 10);

  // 将相机添加到场景中
  scene.add(camera);

  // 导入纹理
  const textureLoader = new THREE.TextureLoader();
  const doorTexture = textureLoader.load(door, (texture) => {
    // 当纹理加载完成后，重新渲染
    render();
    console.log(texture);
  });

  // 创建几何体
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

  // 创建材质
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // 添加纹理
    map: doorTexture,
  });

  // 用几何体 和 材质 创建物体
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // 修改物体的位置
  cube.position.x = 4;
  cube.rotateX(Math.PI / 4);

  // 将物体添加到场景
  scene.add(cube);

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer();

  // 设置渲染器的大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  //将渲染元素插入页面
  divRef?.appendChild(renderer.domElement);

  // 创建控制器 控制相机的移动
  new OrbitControls(camera, renderer.domElement);

  // 设置坐标轴
  const axesHelper = new THREE.AxesHelper(5);

  // 将坐标轴添加到场景
  scene.add(axesHelper);

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
}

function App() {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    renderBox(divRef.current);
  }, []);
  return <div ref={divRef} id="three-app"></div>;
}

export default App;

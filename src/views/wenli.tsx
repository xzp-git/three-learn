import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";
import door from "@/assets/textures/door/color.jpg";
import doorAlpha from "@/assets/textures/door/alpha.jpg";
import doorAmbientOcclusion from "@/assets/textures/door/ambientOcclusion.jpg";

function renderBox(divRef: HTMLDivElement | null) {
  // 创建场景
  const scene = new THREE.Scene();
  const width = window.innerWidth - 200;
  const height = window.innerHeight - 70;
  // 创建相机
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

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
  // 导入透明纹理
  const doorAlphaTexture = textureLoader.load(doorAlpha, (texture) => {
    // 当纹理加载完成后，重新渲染
    render();
    console.log(texture);
  });
  // 导入环境遮挡纹理
  const ambientOcclusion = textureLoader.load(
    doorAmbientOcclusion,
    (texture) => {
      // 当纹理加载完成后，重新渲染
      render();
      console.log(texture);
    }
  );

  // 创建几何体
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  // 设置几何体的uv2属性
  cubeGeometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(cubeGeometry.attributes.uv.array, 2)
  );

  // 创建材质
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // 添加纹理
    map: doorTexture,
    // 添加透明纹理
    alphaMap: doorAlphaTexture,
    transparent: true,
    // 添加环境遮挡纹理
    aoMap: ambientOcclusion,
    // 设置环境遮挡纹理的强度
    // aoMapIntensity: 0.5,
  });

  // 用几何体 和 材质 创建物体
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // 将物体添加到场景
  scene.add(cube);

  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const plane = new THREE.Mesh(planeGeometry, cubeMaterial);
  plane.position.set(1, 0, 0);
  planeGeometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(planeGeometry.attributes.uv.array, 2)
  );
  scene.add(plane);

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);

  // 设置渲染器的大小
  renderer.setSize(width, height);

  //将渲染元素插入页面
  divRef?.appendChild(renderer.domElement);

  // 创建控制器 控制相机的移动
  new OrbitControls(camera, renderer.domElement);

  // 设置坐标轴
  const axesHelper = new THREE.AxesHelper(1);

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

import * as THREE from "three";
import { useEffect } from "react";

function renderBox() {
  const scene = new THREE.Scene();
  const width = window.innerWidth - 200;
  const height = window.innerHeight - 70;
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 10);

  scene.add(camera);

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  scene.add(cube);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(width, height);

  document.getElementById("three-app")?.appendChild(renderer.domElement);

  renderer.render(scene, camera);
}

function App() {
  let isExist = false;
  useEffect(() => {
    if (isExist) return;
    isExist = true;
    renderBox();
  });
  return <div id="three-app"></div>;
}

export default App;

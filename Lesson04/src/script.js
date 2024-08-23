import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");
const axesHelper = new THREE.AxesHelper(3);

// Scene
const scene = new THREE.Scene();
scene.add(axesHelper);
/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
const group = new THREE.Group();
group.add(mesh);
scene.add(group);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);
console.log(mesh.position.distanceTo(camera.position));
mesh.position.normalize();
console.log(mesh.position.length());
camera.position.set(1, 1, 3);
camera.lookAt(new THREE.Vector3(0, 0, 0));
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

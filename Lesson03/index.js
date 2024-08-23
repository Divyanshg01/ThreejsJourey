import * as THREE from "three";

const scene = new THREE.Scene();

const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "red" }),
);
scene.add(mesh);

const sizes = {
    width: 800,
    height: 600,
};

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
scene.add(camera);

camera.position.z = 3;

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({
    canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

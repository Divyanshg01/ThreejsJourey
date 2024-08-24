import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { normalize } from "three/src/math/MathUtils";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureloader = new THREE.TextureLoader();
/**
 * Object
 */

// const colorTexture = textureloader.load("/textures/door/color.jpg");

const colorTexture = textureloader.load("/textures/checkerboard-8x8.png");
const alphaTexture = textureloader.load("/textures/door/alpha.jpg");
const heightTexture = textureloader.load("/textures/door/height.jpg");
const normalTexture = textureloader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureloader.load(
    "/textures/door/ambientOcclusion.jpg",
);
const metalnessTexture = textureloader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureloader.load("/textures/door/roughness.jpg");
colorTexture.colorSpace = THREE.SRGBColorSpace;
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 2;
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;
// colorTexture.rotation = Math.PI / 4;
//
// When texture too big for its space then min filter else mag filter
colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Base
 */
// Debug
const gui = new GUI();
const global = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.material.envMapIntensity = global.envMapIntensity;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1;
gui
    .add(global, "envMapIntensity")
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(updateAllMaterials);

// HDR (RGBE) equirectangular
rgbeLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap;
    scene.environment = environmentMap;
});

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(3, 7, 6);
scene.add(directionalLight);
directionalLight.castShadow = true;
// scene.add(directionalLight.target);
directionalLight.target.position.set(0, 4, 0);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(4096, 4096);
directionalLight.shadow.bias = -0.004;
directionalLight.shadow.normalBias = 0.026;
directionalLight.updateWorldMatrix();
/**
 * Models
 */
// Helmet
// gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//     gltf.scene.scale.set(10, 10, 10);
//     scene.add(gltf.scene);
//
//     updateAllMaterials();
// });
gltfLoader.load("/models/hamburger.glb", (gltf) => {
    gltf.scene.scale.set(0.4, 0.4, 0.4);
    gltf.scene.position.set(0, 2.5, 0);
    scene.add(gltf.scene);

    updateAllMaterials();
});

const floorColorTexture = textureLoader.load(
    "/textures/w/wood_cabinet_worn_long_diff_1k.jpg",
);

const floorARMTexture = textureLoader.load(
    "/textures/w/wood_cabinet_worn_long_arm_1k.jpg",
);
const floorNormalTexture = textureLoader.load(
    "/textures/w/wood_cabinet_worn_long_nor_gl_1k.png",
);

const wallColorTexture = textureLoader.load(
    "/textures/c/castle_brick_broken_06_diff_1k.jpg",
);

const wallARMTexture = textureLoader.load(
    "/textures/c/castle_brick_broken_06_arm_1k.jpg",
);
const wallNormalTexture = textureLoader.load(
    "/textures/c/castle_brick_broken_06_nor_gl_1k.png",
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
    }),
);

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);
const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
    }),
);
wall.position.y = 4;
wall.position.z = -4;
scene.add(wall);
/**
 *
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
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Tone Mapping

// renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

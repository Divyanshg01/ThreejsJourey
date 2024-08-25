import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders///RGBELoader";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const dooralphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorambientOcclusionTexture = textureLoader.load(
    "/textures/door/ambientOcclusion.jpg",
);
const doorheightTexture = textureLoader.load("/textures/door/height.jpg");
const doormetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doornoramlTexture = textureLoader.load("/textures/door/noraml.jpg");
const doorroughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;
// const material = new THREE.MeshBasicMaterial({
//     side: THREE.DoubleSide,
// });
// material.map = doorColorTexture;
// material.color = new THREE.Color("red");
// material.transparent = true;
// material.alphaMap = dooralphaTexture;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;
//

// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
//
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;
doornoramlTexture.colorSpace = THREE.SRGBColorSpace;
// const material = new THREE.MeshStandardMaterial(); material.side = THREE.DoubleSide;
// material.roughness = 1;
// material.metalness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorheightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doormetalnessTexture;
// material.roughnessMap = doorroughnessTexture;
// material.normalMap = doornoramlTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = dooralphaTexture;
//
//
const material = new THREE.MeshPhysicalMaterial();
material.side = THREE.DoubleSide;
material.roughness = 1;
material.metalness = 1;
material.map = doorColorTexture;
material.aoMap = doorambientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = doorheightTexture;
material.displacementScale = 0.1;
material.metalnessMap = doormetalnessTexture;
material.roughnessMap = doorroughnessTexture;
material.normalMap = doornoramlTexture;
material.normalScale.set(1, 1);
material.transparent = true;
material.alphaMap = dooralphaTexture;
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 100];
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;

//
// scene.add(ambientLight, pointLight);
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material);
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5, 100, 100),
    material,
);
scene.add(plane);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = envMap;
    scene.environment = envMap;
});
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
camera.position.z = 2;
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

    plane.rotation.x = 0.1 * elapsedTime;
    plane.rotation.y = -0.15 * elapsedTime;
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

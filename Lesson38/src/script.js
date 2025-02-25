import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import earthVertexShader from "./shaders/earth/vertex.glsl";
import earthFragmentShader from "./shaders/earth/fragment.glsl";
import atmoshphereFragShader from "./shaders/atmoshphere/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmoshphere/vertex.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

/**
 * Earth
 */

const earthParameters = {
    atmoshphereDayColor: "#00aaff",
    atmoshphereTwilightColor: "#ff6600",
};

const earthDayTexture = textureLoader.load("./earth/day.jpg");
earthDayTexture.colorSpace = THREE.SRGBColorSpace;
earthDayTexture.anisotropy = 8;
const earthNightTexture = textureLoader.load("./earth/night.jpg");
earthNightTexture.colorSpace = THREE.SRGBColorSpace;
earthNightTexture.anisotropy = 8;
const specularClouds = textureLoader.load("./earth/specularClouds.jpg");
specularClouds.anisotropy = 8;

// Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms: {
        uDayTexture: {
            value: earthDayTexture,
        },
        uNightTexture: {
            value: earthNightTexture,
        },
        uSpecularCloudTexture: {
            value: specularClouds,
        },
        uSunDirection: {
            value: new THREE.Vector3(0, 0, 1),
        },
        uAtmoshphereDayColor: {
            value: new THREE.Color(earthParameters.atmoshphereDayColor),
        },
        uAtmoshphereTwilightColor: {
            value: new THREE.Color(earthParameters.atmoshphereTwilightColor),
        },
    },
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const atmoshphereMaterial = new THREE.ShaderMaterial({
    // side: THREE.DoubleSide,
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmoshphereFragShader,
    uniforms: {
        uSunDirection: {
            value: new THREE.Vector3(0, 0, 1),
        },
        uAtmoshphereDayColor: {
            value: new THREE.Color(earthParameters.atmoshphereDayColor),
        },
        uAtmoshphereTwilightColor: {
            value: new THREE.Color(earthParameters.atmoshphereTwilightColor),
        },
    },
});
const atmoshphere = new THREE.Mesh(earthGeometry, atmoshphereMaterial);

atmoshphere.scale.set(1.04, 1.04, 1.04);
scene.add(atmoshphere);
const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
const sunDirection = new THREE.Vector3();

const updateSun = () => {
    sunDirection.setFromSpherical(sunSpherical);
    debugSun.position.copy(sunDirection).multiplyScalar(5);
    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
    atmoshphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);
};

const debugSun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial(),
);
scene.add(debugSun);
updateSun();

//Tweaks
//
gui.add(sunSpherical, "phi").min(0).max(Math.PI).onChange(updateSun);
gui.add(sunSpherical, "theta").min(-Math.PI).max(Math.PI).onChange(updateSun);

/**
 *
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    25,
    sizes.width / sizes.height,
    0.1,
    100,
);
camera.position.x = 12;
camera.position.y = 5;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setClearColor("#000011");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    earth.rotation.y = elapsedTime * 0.1;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

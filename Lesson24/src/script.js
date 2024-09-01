/* Layers
 * by setting a layer on camera , this camera will only see object with same layer(obv envMap is excluded because its not an object)
 * layers.enable(1) => add a layer, disable => removes , set => sets that and disable rest of the
 *
 */

/*
 *While using blender to generate envMap, in the camera setting set 
 type = Panaromic , PanaromaType = Equirectangular
 you can also check the visibility of light in the object defineProperties(
2048 X 1024 );
 
envmap can be exr , hdr ,cubeloaded , or jpg(using textureloader)
 */
// examples/jsm => addons
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { GroundProjectedSkybox } from "three/examples/jsm/objects/GroundProjectedSkybox";
// import { GroundProjectedSkybox } from "three/examples/jsm/objects/GroundProjectedSkybox";
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();
const updateAllMaterials = () => {
  scene.traverse((child) => {
    // if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){}
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = 1;
    }
  });
};

const envMap = textureLoader.load(
  "/environmentMaps/blockadesLabsSkybox/img.jpg",
);
envMap.mapping = THREE.EquirectangularReflectionMapping;
envMap.colorSpace = THREE.SRGBColorSpace;

scene.background = envMap;
// scene.environment = envMap;
scene.backgroundBlurriness = 0;
scene.backgroundIntensity = 1;

/**
 * Holy Donut
 */
const holydonut = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 10, 10) }),
);
holydonut.position.y = 3.5;
scene.add(holydonut);
holydonut.layers.enable(1);
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.HalfFloatType,
});
scene.environment = cubeRenderTarget.texture;

// Cube Camera
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  console.log("success");
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);
  updateAllMaterials();
});
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// const environmentMap = cubeTextureLoader.load([
//     "/environmentMaps/0/px.png",
//     "/environmentMaps/0/nx.png",
//     "/environmentMaps/0/py.png",
//     "/environmentMaps/0/ny.png",
//     "/environmentMaps/0/pz.png",
//     "/environmentMaps/0/nz.png",
// ]);
// scene.background = environmentMap;
// scene.environment = environmentMap;

// rgbeLoader.load("/environmentMaps/2/2k.hdr", (envMap) => {
//     envMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = envMap;
//     // scene.background = envMap;
//     console.log(envMap);
//     const skybox = new GroundProjectedSkybox(envMap);
//     skybox.scale.setScalar(50);
//     skybox.radius = 120;
//     skybox.height = 11;
//     scene.add(skybox);
// });

// exrLoader.load("/environmentMaps/nvidiaCanvas-4k.exr", (envMap) => {
//     envMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.background = envMap;
//     scene.environment = envMap;
// });

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 1,
    color: 0xaaaaaa,
  }),
);
torusKnot.position.y = 4;
torusKnot.position.x = -4;
scene.add(torusKnot);
// torusKnot.material.envMap = environmentMap;
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
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();
  holydonut.rotation.x = Math.sin(elapsedTime) * 4;
  cubeCamera.update(renderer, scene);
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";
import {
    DotScreenPass,
    EffectComposer,
    GammaCorrectionShader,
    GlitchPass,
    RenderPass,
    RGBShiftShader,
    ShaderPass,
    SMAAPass,
    UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (
            child instanceof THREE.Mesh &&
            child.material instanceof THREE.MeshStandardMaterial
        ) {
            child.material.envMapIntensity = 2.5;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    "/textures/environmentMaps/0/px.jpg",
    "/textures/environmentMaps/0/nx.jpg",
    "/textures/environmentMaps/0/py.jpg",
    "/textures/environmentMaps/0/ny.jpg",
    "/textures/environmentMaps/0/pz.jpg",
    "/textures/environmentMaps/0/nz.jpg",
]);

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Models
 */
gltfLoader.load("/models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);

    updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

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

    effectComposer.setSize(sizes.width, sizes.height);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
camera.position.set(4, 1, -4);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
    // samples: renderer.getPixelRatio() == 1 ? 2 : 0,
});
// 0 means no antialias
//
///////////////////////////////////////////////
////   EFFECT COMPOSER
///////////////////////////////////////////////
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = false;
// glitchPass.goWild = true;
effectComposer.addPass(glitchPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

if (!renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
    const smaaPass = new SMAAPass();
    effectComposer.addPass(smaaPass);
}

// const unrealPass = new UnrealBloomPass();
// unrealPass.strength = 0.3;
// unrealPass.radius = 1;
// unrealPass.threshold = 0.6;
//
// effectComposer.addPass(unrealPass);

const TintShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTint: { value: null },
    },
    vertexShader: `
    varying vec2 vUv;
    void main()
    {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position , 1.0);
    vUv = uv;
    }
`,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;
    varying vec2 vUv;
    void main()
    {
    vec4 color = texture2D(tDiffuse , vUv);
    // color.r += 0.1;
    // color.rgb += uTint;
    // gl_FragColor = vec4(1.0 ,0.0 ,0.0, 1.0);
    gl_FragColor =color;
    }
`,
};

const DisplacementShader = {
    uniforms: {
        tDiffuse: { value: null },
        uNormalMap: { value: null },
    },
    vertexShader: `
    varying vec2 vUv;
    void main()
    {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position , 1.0);
    vUv = uv;
    }
`,
    fragmentShader: `
    uniform sampler2D uNormalMap;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main()
    {
    // vec2 newUv = vec2(
    // vUv.x,
    // vUv.y + sin(vUv.x * 10.0) * 0.1
// );
    vec3 normalMap = texture2D(uNormalMap, vUv).xyz *2.0 - 1.;
    vec2 newUv = vUv + normalMap.xy*0.1;
    vec4 color = texture2D(tDiffuse , newUv);

    // gl_FragColor = vec4(1.0 ,0.0 ,0.0, 1.0);
    // gl_FragColor = vec4(color , 1.0);
    vec3 lightDirection = normalize(vec3(-1.0 , 1.0 ,0.0));
float lightness = clamp(dot(normalMap ,  lightDirection) , 0.0 , 1.0 );
color.rgb += lightness*2.0;
    
    gl_FragColor = color;
    }
`,
};
const tintPass = new ShaderPass(TintShader);
tintPass.material.uniforms.uTint.value = new THREE.Vector3(0.2, 0, 0.1);

const displacementPass = new ShaderPass(DisplacementShader);
displacementPass.material.uniforms.uNormalMap.value = textureLoader.load(
    "/textures/interfaceNormalMap.png",
);
effectComposer.addPass(displacementPass);
effectComposer.addPass(tintPass);
// for color corrrection
const gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionShader);
/**
 *
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    effectComposer.render();
    // Render
    // renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

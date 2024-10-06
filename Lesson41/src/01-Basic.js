// Notes
/**
 * We use gpgpu(general process computing on graphics processing unit) (we can use it to do complex calculation as well) and flow fields
 * The data needs to persist(on every frame , unlike previous times where we take snapshots and be like at that time point should be there) ,
 * GPGPU utilizes FBO(to save textures(where we save renders) instead of displaying it ) ,  we use pixel of texture of one particle  where RGB coordinate will denote XYZ coordinate , so instead of using position attribute we are going to use that fbo texture to move our particles , On each frame , we update the FBO according to the previous fbo , the position of particles persist and we keep on updating them
 * First we need to create a brand new offscreen scene(not the one user sees) , in it we put a camera (orthographic) facing a plane which fills the camera view perfectly then we apply a custom shader on that plane , we send it the FBO texture containing the position of the particle , instead of displaying that texture , the custom shader will update the pixels, thus updating the particles
 * Before rendering the scene , we render that offscreen scene using the offscreen camera and save the result in an FBO, for the next frame , we send the result of the previously rendered FBO to the plane shader, we apply the flow field again and we render it in the same FBO.
 * We end up with a FBO(texture) containing particle coordinates , while the pixel coordinates are being updated on each frame
 *
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import GUI from "lil-gui";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
import gpgpuParticlesShader from "./shaders/gpgpu/particles.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
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

    // Materials
    particles.material.uniforms.uResolution.value.set(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio,
    );

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
    35,
    sizes.width / sizes.height,
    0.1,
    100,
);
camera.position.set(4.5, 4, 11);
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

debugObject.clearColor = "#29191f";
renderer.setClearColor(debugObject.clearColor);

/**
 *  Base Geometry
 */
//s1
const baseGeometry = {};

//s2
baseGeometry.instance = new THREE.SphereGeometry(3);
baseGeometry.count = baseGeometry.instance.attributes.position.count; // these are amount of particles or vertices

//s3
//GPU COMPUTE
const gpgpu = {};

//s4
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count));

//s5
gpgpu.computation = new GPUComputationRenderer(
    gpgpu.size,
    gpgpu.size,
    renderer,
);

//s6
const basePaticleTexture = gpgpu.computation.createTexture(); //texture.image.data

//s13
for (let i = 0; i < baseGeometry.count; i++) {
    const i3 = i * 3;
    const i4 = i * 4;

    //position based on geometry
    basePaticleTexture.image.data[i4 + 0] =
        baseGeometry.instance.attributes.position.array[i3 + 0];
    basePaticleTexture.image.data[i4 + 1] =
        baseGeometry.instance.attributes.position.array[i3 + 1];
    basePaticleTexture.image.data[i4 + 2] =
        baseGeometry.instance.attributes.position.array[i3 + 2];
    basePaticleTexture.image.data[i4 + 3] = 0;
}
// console.log(basePaticleTexture.image.data);
//s14 -> update the particles.glsl

//s7
gpgpu.particlesVariable = gpgpu.computation.addVariable(
    "uParticles",
    gpgpuParticlesShader,
    basePaticleTexture,
);
// we will access to this texture in particles.glsl by the name of uParticles

//s8
gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [
    gpgpu.particlesVariable,
]);

//s9
gpgpu.computation.init();

//Debug
// s11
gpgpu.debug = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({
        // s14
        map: gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable)
            .texture,
    }),
);

//s12
gpgpu.debug.position.x = 3;

//s13
scene.add(gpgpu.debug);

// gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture;

//s15 => update textures

/**
 * Particles
 */
const particles = {};

//s19
const particleUVarray = new Float32Array(baseGeometry.count * 2);
for (let y = 0; y < gpgpu.size; y++) {
    for (let x = 0; x < gpgpu.size; x++) {
        const i = y * gpgpu.size + x;
        const i2 = i * 2;

        const uvX = (x + 0.5) / gpgpu.size;
        const uvY = (y + 0.5) / gpgpu.size;

        particleUVarray[i2 + 0] = uvX;
        particleUVarray[i2 + 1] = uvY;
    }
}
// Geometry
// particles.geometry = new THREE.SphereGeometry(3);
//s16
particles.geometry = new THREE.BufferGeometry();

//s17
particles.geometry.setDrawRange(0, baseGeometry.count);

//s18
particles.geometry.setAttribute(
    "aParticlesUv",
    new THREE.BufferAttribute(particleUVarray, 2),
);

// Material
particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
        uSize: new THREE.Uniform(0.4),
        uResolution: new THREE.Uniform(
            new THREE.Vector2(
                sizes.width * sizes.pixelRatio,
                sizes.height * sizes.pixelRatio,
            ),
        ),
        // s18
        uParticlesTexture: new THREE.Uniform(),
    },
});

// Points
particles.points = new THREE.Points(particles.geometry, particles.material);
scene.add(particles.points);

/**
 * Tweaks
 */
gui.addColor(debugObject, "clearColor").onChange(() => {
    renderer.setClearColor(debugObject.clearColor);
});
gui
    .add(particles.material.uniforms.uSize, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uSize");

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update controls
    controls.update();

    //s10
    gpgpu.computation.compute();

    //s18
    particles.material.uniforms.uParticlesTexture.value =
        gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable).texture;

    // Render normal scene
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

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
    particlesMaterial.uniforms.uResolution.value.set(
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
camera.position.set(0, 0, 18);
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
renderer.setClearColor("#181818");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

const displacement = {};

displacement.canvas = document.createElement("canvas");
displacement.canvas.width = 128;
displacement.canvas.width = 128;
//css styling
displacement.canvas.style.position = "fixed";
displacement.canvas.style.width = "512px";
displacement.canvas.style.height = "512px";
displacement.canvas.style.top = 0;
displacement.canvas.style.left = 0;
displacement.canvas.style.zIndex = 20;

document.body.append(displacement.canvas);

//context
//
displacement.context = displacement.canvas.getContext("2d");
displacement.context.fillRect(
    0,
    0,
    displacement.canvas.width,
    displacement.canvas.height,
);

//Load image

displacement.glowImage = new Image();
displacement.glowImage.src = "./glow.png";
displacement.context.drawImage(displacement.glowImage, 20, 20, 32, 32);
displacement.interactivePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: "red" }),
);
displacement.interactivePlane.visible = false;
scene.add(displacement.interactivePlane);

displacement.rayCaster = new THREE.Raycaster();

displacement.screenCursor = new THREE.Vector2(9999, 9999);
displacement.canvasCursor = new THREE.Vector2(9999, 9999);
displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999);
window.addEventListener("pointermove", (e) => {
    displacement.screenCursor.x = (e.clientX / sizes.width) * 2 - 1;
    displacement.screenCursor.y = -(e.clientY / sizes.height) * 2 + 1;
});

displacement.texture = new THREE.CanvasTexture(displacement.canvas);

/**
 * Particles
 */
// particles are on each node of geometry so more divisions means more particles where as height and width of total geometry spread out to form a plane
//
//

const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
particlesGeometry.setIndex(null);
const intensityArrays = new Float32Array(
    particlesGeometry.attributes.position.count,
);
const angleArrays = new Float32Array(
    particlesGeometry.attributes.position.count,
);
for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
    intensityArrays[i] = Math.random();
    angleArrays[i] = Math.random() * Math.PI * 2;
}

particlesGeometry.setAttribute(
    "aIntensity",
    new THREE.BufferAttribute(intensityArrays, 1),
);

particlesGeometry.setAttribute(
    "aAngle",
    new THREE.BufferAttribute(angleArrays, 1),
);
const particlesMaterial = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
        uResolution: new THREE.Uniform(
            new THREE.Vector2(
                sizes.width * sizes.pixelRatio,
                sizes.height * sizes.pixelRatio,
            ),
        ),
        uPictureTexture: {
            value: textureLoader.load("./picture-1.png"),
        },
        uDisplacementTexture: {
            value: displacement.texture,
        },
    },
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    displacement.rayCaster.setFromCamera(displacement.screenCursor, camera);

    const intersections = displacement.rayCaster.intersectObject(
        displacement.interactivePlane,
    );
    //

    if (intersections.length) {
        const uv = intersections[0].uv;
        // console.log(uv);
        displacement.canvasCursor.x = uv.x * displacement.canvas.width;
        displacement.canvasCursor.y = (1.0 - uv.y) * displacement.canvas.height;
    }

    displacement.context.globalCompositeOperation = "source-over";
    displacement.context.globalAlpha = 0.1;
    displacement.context.fillRect(
        0,
        0,
        displacement.canvas.width,
        displacement.canvas.height,
    );

    const cursorDistance = displacement.canvasCursorPrevious.distanceTo(
        displacement.canvasCursor,
    );

    displacement.canvasCursorPrevious.copy(displacement.canvasCursor);

    const alpha = Math.min(1, 0.1 * cursorDistance);

    const glowSize = displacement.canvas.width * 0.25;

    displacement.context.globalCompositeOperation = "lighten";

    displacement.context.globalAlpha = alpha;
    displacement.context.drawImage(
        displacement.glowImage,
        displacement.canvasCursor.x - glowSize * 0.5,
        displacement.canvasCursor.y - glowSize * 0.5,
        glowSize,
        glowSize,
    );

    displacement.texture.needsUpdate = true;
    // Render
    //
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

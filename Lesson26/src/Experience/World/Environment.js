import Experience from "../Experience";
import * as THREE from "three";
export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder("environment");
        }

        this.setSunlight();
        this.setEnvMap();
    }
    setSunlight() {
        this.directionalLight = new THREE.DirectionalLight("#ffffff", 4);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.camera.far = 15;
        this.directionalLight.shadow.mapSize.set(1024, 1024);
        this.directionalLight.shadow.normalBias = 0.05;
        this.directionalLight.position.set(3.5, 2, -1.25);
        this.scene.add(this.directionalLight);
        if (this.debug.active) {
            this.debugFolder
                .add(this.directionalLight, "intensity")
                .name("sunLightIntensity")
                .min(0)
                .max(10)
                .step(0.001);

            this.debugFolder
                .add(this.directionalLight.position, "x")
                .name("sunLightX")
                .min(-5)
                .max(5)
                .step(0.001);

            this.debugFolder
                .add(this.directionalLight.position, "y")
                .name("sunLightY")
                .min(-5)
                .max(5)
                .step(0.001);

            this.debugFolder
                .add(this.directionalLight.position, "z")
                .name("sunLightZ")
                .min(-5)
                .max(5)
                .step(0.001);
        }
    }
    setEnvMap() {
        this.envMap = {};
        this.envMap.intensity = 0.4;
        this.envMap.texture = this.resources.items.environmentMapTexture;
        this.envMap.texture.colorSpace = THREE.SRGBColorSpace;
        this.scene.environment = this.envMap.texture;
        this.envMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                // console.log(child);
                if (
                    child instanceof THREE.Mesh &&
                    child.material instanceof THREE.MeshStandardMaterial
                ) {
                    child.material.envMap = this.envMap.texture;
                    child.material.envMapIntensity = this.envMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        };
        this.envMap.updateMaterials();

        if (this.debug.active) {
            this.debugFolder
                .add(this.environmentMap, "intensity")
                .name("envMapIntensity")
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials);
        }
    }
}

import EventEmitter from "./EventEmitter";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class Resources extends EventEmitter {
    constructor(sources) {
        console.log(sources);
        super();
        this.sources = sources;

        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }
    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    }
    startLoading() {
        for (let src of this.sources) {
            if (src.type === "gltfModel") {
                this.loaders.gltfLoader.load(src.path, (file) => {
                    this.sourceLoaded(src, file);
                });
            } else if (src.type === "texture") {
                this.loaders.textureLoader.load(src.path, (file) => {
                    this.sourceLoaded(src, file);
                });
            } else if (src.type === "cubeTexture") {
                this.loaders.cubeTextureLoader.load(src.path, (file) => {
                    this.sourceLoaded(src, file);
                });
            }
        }
    }
    sourceLoaded(source, file) {
        this.items[source.name] = file;
        this.loaded++;
        if (this.loaded == this.toLoad) {
            this.trigger("ready");
        }
    }
}

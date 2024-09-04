attribute float aRandom;
varying float vRandom;
uniform vec2 uFrequency;
uniform float uTime;
varying vec2 vUv;
varying float elevation;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    // modelPosition.z += aRandom * 0.1;

    elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    vRandom = aRandom;
    vUv = uv;
}

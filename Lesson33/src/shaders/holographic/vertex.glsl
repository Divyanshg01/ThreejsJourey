varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76);
    glitchStrength /= 3.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= 0.25;
    modelPosition.x += glitchStrength * (random2D(modelPosition.xz + uTime) - 0.5);
    modelPosition.z += glitchStrength * (random2D(modelPosition.zx + uTime) - 0.5);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    vPosition = modelPosition.xyz;
    vNormal = normal;
    vec4 modelNormal = modelMatrix * vec4(normal, .0); // to not have translation
    vNormal = modelNormal.xyz;
    gl_Position = projectionPosition;
}

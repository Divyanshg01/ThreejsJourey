varying vec2 vUV;
uniform float uTime;
uniform sampler2D tex;
#include ./rotate.glsl
void main() {
    vec3 newPosition = position;
    float twistPerlin = texture(tex, vec2(0.5, uv.y * .2 - uTime * 0.005)).r;
    // float angle = newPosition.y;
    float angle = twistPerlin * 10.0;

    newPosition.xz = rotate2D(newPosition.xz, angle);
    vec2 windOffset = vec2(
            texture(tex, vec2(0.25, uTime * 0.01)).r - 0.5,
            texture(tex, vec2(0.75, uTime * 0.01)).r - 0.5
        );
    // windOffset *= 10.0;
    // windOffset *= uv.y;
    windOffset *= pow(uv.y, 2.0) * 10.;
    newPosition.xz += windOffset;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
    vUV = uv;
}

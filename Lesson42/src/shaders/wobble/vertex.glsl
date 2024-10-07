//  we are not using the technique of raging sea lecture because its for flat surface
uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;
varying float vWobble;
varying vec2 vUv;
attribute vec4 tangent;
#include ../includes/simplexNoise4d.glsl
float getWobble(vec3 position) {
    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(
            vec4(
                position * uWarpPositionFrequency,
                uTime * uWarpTimeFrequency
            )
        ) * uWarpStrength;

    return simplexNoise4d(vec4(
            warpedPosition * uPositionFrequency, // XYZ
            uTime * uTimeFrequency // W
        )) * uStrength;
}
void main() {
    // csm_Position.y += 2.0;
    // csm_Position.y += sin(csm_Position.x * 3.0) * 0.5;
    vec3 bitangent = cross(normal, tangent.xyz);

    //Neighbours positions
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + bitangent * shift;
    float wobble = getWobble(csm_Position);

    vUv = uv;
    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    //Compute Normals
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);
    vWobble = wobble / uStrength;
}

uniform float uTime;
uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;
#include ../includes/simplexNoise2d.glsl
varying vec3 vPosition;
varying float vUpDot;

float getElevation(vec2 position) {
    // float uPositionFrequency = 0.2;
    // float uStrength = 2.0;
    // float uWarpFrequency = 5.0;
    // float uWarpStrength = 0.5;

    float elevation = 0.0;

    vec2 warpedPosition = position;
    warpedPosition += uTime * 0.2;
    warpedPosition += simplexNoise2d(warpedPosition * uWarpFrequency * uPositionFrequency) * uWarpStrength;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;

    float elevationSign = sign(elevation);
    elevation = pow(abs(elevation), 2.0) * elevationSign;
    elevation *= uStrength;
    return elevation;
}
void main() {
    float shift = 0.01;
    vec3 positionA = position.xyz + vec3(shift, 0.0, 0.0);
    vec3 positionB = position.xyz + vec3(0.0, 0.0, -shift);

    // float elevation = getElevation(csm_Position.xz)
    float elevation = getElevation(csm_Position.xz);
    csm_Position.y += elevation;
    positionA.y += getElevation(positionA.xz);
    positionB.y += getElevation(positionB.xz);

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);
    vPosition = csm_Position;
    vPosition.xz += uTime * 0.2;
    vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));

    //
}

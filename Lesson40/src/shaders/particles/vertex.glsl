uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;

attribute vec3 aPositionTarget;
attribute float aSize;

#include ../include/simplexNoise3d.glsl
varying vec3 vcolor;
void main()
{
    // Mixed Progress

    float noiseOrigin = simplexNoise3d(position * 0.2);
    float noiseTarget = simplexNoise3d(aPositionTarget * 0.2);
    float noise = mix(noiseOrigin, noiseTarget, uProgress);

    noise = smoothstep(-1.0, 1.0, noise); // smoothstep function smooths and changes the range 0 -> 1

    float duration = 0.4;
    float delay = (1.0 - duration) * noise;

    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress);
    vec3 mixPos = mix(position, aPositionTarget, progress);

    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * aSize * uResolution.y;
    gl_PointSize *= (1.0 / -viewPosition.z);
    // vcolor = vec3(noise);
    vcolor = mix(uColorA, uColorB, noise);
}

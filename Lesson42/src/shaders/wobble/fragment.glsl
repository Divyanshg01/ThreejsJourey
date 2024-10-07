uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble;
varying vec2 vUv;
void main() {
    // csm_DiffuseColor = vec4(1.);
    // csm_DiffuseColor.rgb = vec3(vUv, 0.5);
    // csm_Metalness = step(0.0, sin(vUv.x * 100. + 0.5));
    // csm_Roughness = 1.0 - csm_Metalness;

    float colorMix = smoothstep(-1.0, 1.0, vWobble);
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);

    csm_Roughness = 1.0 - colorMix;
}

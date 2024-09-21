uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;

float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
void main() {
    float stripes = mod((vPosition.y - uTime * 0.02) * 20., 1.);

    stripes = pow(stripes, 3.0);

    vec3 normal = normalize(vNormal);
    // Fresnel
    if (!gl_FrontFacing) {
        normal *= -1.0;
    }

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    // float fresnel = 1.0 - abs(dot(viewDirection, normal));
    fresnel = pow(fresnel, 2.);

    //Fall off
    float falloff = smoothstep(0.8, 0., fresnel);

    //Holographic
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    gl_FragColor = vec4(1.0, 1.0, 1.0, holographic);
    // gl_FragColor = vec4(vNormal, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

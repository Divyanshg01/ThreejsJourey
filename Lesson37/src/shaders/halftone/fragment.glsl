uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uShadowRepetition;
uniform vec3 uShadowColor;
uniform float uLightRepetition;
uniform vec3 uLightColor;

varying vec3 vNormal;
varying vec3 vPosition;

float remap(float a, float b, float t) {
    return (t - a) / (b - a);
}
vec3 halfTone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal
) {
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);
    // we can use remap to do the same like with smoothstep we make 0 before -0.8 and after that we smoothly transition to white till 1.5 but since intensity can only go upto 1 , then we don't get complete white at bottom but if we use remap then (-1 ,1 ) => (0 ,1 ) then we can use smooth step as show
    // intensity = remap(-1., 1., intensity);
    // intensity = smoothstep(0.1, 1.5, intensity);
    // intensity = remap(-1., 1., intensity) * (1.5 - 0.8);
    // vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 uv = gl_FragCoord.xy / uResolution.y; // to make squares

    uv *= repetitions;

    uv = mod(uv, 1.0);

    float point = distance(uv, vec2(0.5));
    point = 1.0 - step(0.5 * intensity, point);
    color = mix(color, pointColor, point);
    return color;
}

#include ../includes/pointLight.glsl
#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    vec3 light = vec3(0.0);
    light += ambientLight(vec3(1.0), 1.0);
    light += directionalLight(vec3(1.0, 1.0, 1.0), 1.0, normal, vec3(1.0, 1.0, 0.0), viewDirection, 1.0);
    color *= light;

    float repetitions = 50.0;
    vec3 direction = vec3(0.0, -1.0, 0.0);

    // down face has intensity 1 , middle has 0 , top has -1
    float low = -0.8;
    //  <=0 means black
    float high = 1.5; // we are making it >=1 because we want a gradient throughout and specifically a little longer gradient from black to white
    vec3 pointColor = vec3(1.0, 0.0, 0.0);

    color = halfTone(color, uShadowRepetition, direction, low, high, uShadowColor, normal);
    color = halfTone(color, uLightRepetition, vec3(1.0, 1.0, 0.0), 0.5, 1.5, uLightColor, normal);

    // Final color
    // gl_FragColor = vec4(uv, 1.0, 1.0);
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vec3(intensity), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

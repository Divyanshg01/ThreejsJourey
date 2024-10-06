#include ../includes/simplexNoise4d.glsl
uniform sampler2D uBase;
uniform float uTime;
uniform float uDeltaTime;
void main() {
    float time = uTime * 0.2;
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture(uParticles, uv);
    vec4 base = texture(uBase, uv);
    // particle.x += 0.01; // means particles will going up means green color will increase in each pixel

    // Dead
    if (particle.a >= 1.0) {
        particle.a = mod(particle.a, 1.0);
        particle.xyz = base.xyz;
    }

    //Alive

    else {
        float strength = simplexNoise4d(vec4(base.xyz * 0.2, time + 1.0));
        strength = smoothstep(-0.0, 1.0, strength);
        vec3 flowField = vec3(
                simplexNoise4d(vec4(particle.xyz, time)),
                simplexNoise4d(vec4(particle.xyz + 1.0, time)),
                simplexNoise4d(vec4(particle.xyz + 2.0, time))
            );

        flowField = normalize(flowField);
        particle.xyz += flowField * uDeltaTime * strength * 0.5;

        particle.a += uDeltaTime * 0.3;
    }

    //Flow
    gl_FragColor = particle;
    // gl_FragColor = vec4(uv, 0.0, 1.0); // means particles should be at (1, 0 , 0)
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // means particles should be at (1, 0 , 0)
}

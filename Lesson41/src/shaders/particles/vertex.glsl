uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture;

varying vec3 vColor;
attribute vec3 aColor;
attribute float aSizes;
attribute vec2 aParticlesUv;

void main()
{
    vec4 particle = texture(uParticlesTexture, aParticlesUv);

    // Final position
    // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float sizeIn = smoothstep(0., 1., particle.a);
    float sizeOut = 1.0 - smoothstep(.7, 1., particle.a);
    float size = min(sizeIn, sizeOut);

    // Point size
    gl_PointSize = aSizes * (uSize + 0.03) * size * uResolution.y;
    gl_PointSize *= (1.0 / -viewPosition.z);

    // Varyings
    vColor = aColor;
}


uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;
attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;
void main()
{
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;

    // displacementIntensity = smoothstep(0.1, 1., displacementIntensity);
    displacementIntensity = smoothstep(0.1, .3, displacementIntensity);
    vec3 displacement = vec3(cos(aAngle) * 0.2, sin(aAngle) * 0.2, 1.);

    displacement = normalize(displacement);
    displacement = displacement * displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;
    newPosition += displacement;
    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    float picture = texture(uPictureTexture, uv).r;

    // Point size
    // gl_PointSize = 0.3 * uResolution.y;
    gl_PointSize = 0.15 * picture * uResolution.y;
    gl_PointSize *= (1.0 / -viewPosition.z);

    vColor = vec3(pow(picture, 2.));
}

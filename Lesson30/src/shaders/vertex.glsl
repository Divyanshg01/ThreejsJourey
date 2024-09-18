attribute float aScale;
attribute vec3 aRandomness;
uniform float uSize;
uniform float uTime;
varying vec3 vColor;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;
    // modelPosition.xyz += aRandomness;
    vec4 viewPos = viewMatrix * modelPosition;
    vec4 projectionPos = projectionMatrix * viewPos;

    gl_PointSize = uSize * aScale;
    gl_Position = projectionPos;
    gl_PointSize *= (1.0 / -viewPos.z);
    vColor = color;
}

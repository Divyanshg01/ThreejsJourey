// #define PI 3.14159
varying vec3 vPosition;
uniform float uSliceStart;
uniform float uSliceArc;
void main() {
    //
    // float uSliceStart = 1.0;
    // float uSliceArc = 1.5;

    float angle = atan(vPosition.y, vPosition.x);
    angle -= uSliceStart;
    angle = mod(angle, PI2);

    if (angle > 0.0 && angle < uSliceArc) {
        discard;
    }
    // csm_FragColor = vec4(, 1.0);
    // if (!gl_FrontFacing) {
    //     csm_FragColor = vec4(0.75, 0.15, 0.3, 1.0);
    float csm_Slice;
}

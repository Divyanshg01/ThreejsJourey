precision mediump float;
varying float vRandom;
uniform sampler2D uTexture;
uniform vec3 uColor;
varying vec2 vUv;
varying float elevation;
void main() {
    // gl_FragColor = vec4(vRandom, 0.0, vRandom, 1.0);
    vec4 texture = texture2D(uTexture, vUv);
    // col = col * elevation * 2.0;
    texture.rgb *= 2.0 * elevation + 0.5;
    gl_FragColor = texture;
}

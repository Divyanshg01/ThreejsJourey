uniform sampler2D tex;
uniform float uTime;
varying vec2 vUV;
void main() {
    vec2 smokeuv = vUV;
    smokeuv.x *= 0.5;
    smokeuv.y *= 0.3;
    smokeuv.y -= uTime * 0.03;
    float smoke = texture(tex, smokeuv).r;
    smoke = smoothstep(0.4, 1.0, smoke);
    //edges
    // smoke = 1.0;
    smoke *= smoothstep(0.0, .1, vUV.x);
    smoke *= smoothstep(1.0, .9, vUV.x);
    smoke *= smoothstep(.0, .4, vUV.y);
    smoke *= smoothstep(1.0, .9, vUV.y);
    // gl_FragColor = vec4(vUV, 1.0, 1.0);
    gl_FragColor = vec4(.6, .3, .2, smoke);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

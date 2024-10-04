varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uAtmoshphereDayColor;
uniform vec3 uAtmoshphereTwilightColor;
// uniform sampler2D uDayTexture;
// uniform sampler2D uNightTexture;
// uniform sampler2D uSpecularCloudTexture;
uniform vec3 uSunDirection;
void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    //Sun Orientation
    // vec3 uSunDirection = vec3(0.0, 0.0, 1.0);
    float sunOrientation = dot(uSunDirection, normal);
    // color = vec3(sunOrientation);

    // Day/night color
    // float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
    // vec3 dayColor = texture(uDayTexture, vUv).xyz;
    // vec3 nightColor = texture(uNightTexture, vUv).xyz;
    //
    // color = mix(nightColor, dayColor, dayMix);

    // vec2 specularCloudsColor = texture(uSpecularCloudTexture, vUv).xy;
    //
    // //clouds
    // float cloudsMix = smoothstep(0.5, 1.0, specularCloudsColor.g);
    // cloudsMix *= dayMix;
    // color = mix(color, vec3(1.0), cloudsMix);

    // fresnel
    // float fresnel = dot(viewDirection, normal) + 1.0;
    // fresnel = pow(fresnel, 2.0);

    /// Atmoshphere

    float atmoshphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
    // color = vec3(sunOrientation);
    vec3 atmoshpherColor = mix(uAtmoshphereTwilightColor, uAtmoshphereDayColor, atmoshphereDayMix);
    // color = mix(color, atmoshpherColor, fresnel);
    // color = mix(color, atmoshpherColor, atmoshphereDayMix);
    color += atmoshpherColor;

    float edgeAlpha = dot(viewDirection, normal);
    edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha);
    float dayAlpha = smoothstep(-0.5, 0.0, sunOrientation);
    //
    float alpha = edgeAlpha * dayAlpha;
    //
    // color = vec3(dayAlpha);
    //Specular

    // vec3 reflection = reflect(-uSunDirection, normal);
    // float specular = -dot(reflection, viewDirection);
    // specular = max(specular, 0.0);
    // specular = pow(specular, 32.0);
    // specular *= specularCloudsColor.r;
    // vec3 specularColor = mix(vec3(1.0), atmoshpherColor, fresnel);
    // color += specular * specularColor;

    // Final color
    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

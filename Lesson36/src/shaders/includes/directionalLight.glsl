

vec3 directionLight(vec3 lightColor, float lightIntensity, vec3 vNormal, vec3 lightPos, vec3 viewDirection, float specularPower) {
    vec3 lightDirection = normalize(lightPos);
    vec3 lightReflection = reflect(-lightDirection, vNormal);

    float shading = dot(vNormal, lightDirection);
    shading = max(0.0, shading);

    float specular = -dot(lightReflection, viewDirection);

    specular = max(0.0, specular);
    specular = pow(specular, specularPower);
    return lightColor * lightIntensity * (shading + specular);
    // return vec3(shading);
}

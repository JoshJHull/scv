#pragma glslify: noise = require('glsl-noise/classic/3d')

precision mediump float;

varying vec2 uUv;

uniform float uTime;
uniform vec3 uColourPalette[4];

float uUvDistortionIterations = 1.0; // 4.0
float uUvDistortionIntensity = 0.1; // 0.2

//calculate single color from the cosine gradient
vec3 cosineGradientColour(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return clamp(a + b * cos(6.28318 * (c * t + d)), 0.0, 1.0);
}

void main() {
    vec2 uv = uUv;
    uv *= 1.5;
    //vec3 colour = cosineGradientColour(uUv.y, uColourPalette[0], uColourPalette[1], uColourPalette[2], uColourPalette[3]);

    float colourInput = noise(vec3(uv, uTime * 0.05)) * 0.5 + 0.5;
    vec3 colour = cosineGradientColour(colourInput, uColourPalette[0], uColourPalette[1], uColourPalette[2], uColourPalette[3]);

    gl_FragColor = vec4(colour, 1.0);
}
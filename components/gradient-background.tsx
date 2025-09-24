"use client";

import { Canvas, extend, ThreeElement, useFrame} from "@react-three/fiber";
import { ScreenQuad, shaderMaterial } from "@react-three/drei";
import { ShaderMaterial, Vector3 } from "three";
import { COSINE_GRADIENTS } from "@thi.ng/color";

import vertex from "./shaders/gradient_background.vert";
import fragment from "./shaders/gradient_background.frag";
import {useRef} from "react";

// const colourPalette = COSINE_GRADIENTS["cyan-magenta"].map(
//     (color) => new Vector3(...color),
// );

const colourPalette: Vector3[] = [
    new Vector3(0.578, 0.268,0.465),
    new Vector3(0.785, 0.300, 0.156),
    new Vector3(0.108, 1.349, 0.651),
    new Vector3(0.438, 1.248, 5.687)
];

type Uniforms = {
    uTime: number
    uColourPalette: Vector3[]
}

const INIT_UNIFORMS: Uniforms = {
    uTime: 0,
    uColourPalette: colourPalette
}

const BackgroundMaterial = shaderMaterial(
    INIT_UNIFORMS, vertex, fragment,
);
extend({BackgroundMaterial});

declare module '@react-three/fiber' {
    interface ThreeElements {
        backgroundMaterial: ThreeElement<typeof BackgroundMaterial>
    }
}

const Background = (() => {
    const gradientShader = useRef<ShaderMaterial & Partial<Uniforms>>(null!);

    useFrame(({clock}) => {
        gradientShader.current.uTime = clock.elapsedTime;
    });

    return (
        <ScreenQuad>
            <backgroundMaterial ref={gradientShader} uTime={0} uColourPalette={colourPalette}/>
        </ScreenQuad>
    )
})

export default function GradientBackground() {
    return (
        <Canvas>
            <Background/>
        </Canvas>
    );
}

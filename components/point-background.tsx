"use client"

import { Canvas, extend, ThreeElement, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import {useRef} from "react";
import { BufferGeometry, ShaderMaterial, Vector3 } from "three";

import vertex from "./shaders/points_background.vert";
import fragment from "./shaders/points_background.frag";

type Uniforms = {
    colour: Vector3
}

const INIT_UNIFORMS: Uniforms = {
    colour: new Vector3(0.227, 0.349, 0.949)
}

const PointMaterial = shaderMaterial(
    INIT_UNIFORMS, vertex, fragment,
);
extend({PointMaterial});

declare module '@react-three/fiber' {
    interface ThreeElements {
        pointMaterial: ThreeElement<typeof PointMaterial>
    }
}

const SEPERATION = 1, NUMX = 200, NUMZ = 200;

const pointNum = NUMX * NUMZ;

const positions = new Float32Array( pointNum * 3 );
const scales = new Float32Array(pointNum);

let i = 0, j= 0;
for (let ix = 0; ix < NUMX; ix++) {
    for (let iz = 0; iz < NUMZ; iz++) {
        positions[i] = ix * SEPERATION - ((NUMX * SEPERATION) / 2);
        positions[i+1] = 0;
        positions[i+2] = iz * SEPERATION - ((NUMZ * SEPERATION) / 2);
        i += 3;

        scales[j] = 1;
        j++;
    }
}

const Background = (() => {
    const pointsRef = useRef<BufferGeometry>(null!);
    const pointsShader = useRef<ShaderMaterial & Partial<Uniforms>>(null!);

    useFrame(({clock}) => {
        i = 0;
        j = 0;
        for (let ix = 0; ix < NUMX; ix++) {
            for (let iz = 0; iz < NUMZ; iz++) {
                positions[i+1] = (Math.sin((ix + clock.elapsedTime * 2) / 10)) +
                    (Math.sin((iz + clock.elapsedTime * 2) / 10));
                i += 3;

                scales[j] = ((Math.sin((ix + clock.elapsedTime * 2) / 10) + 2) ) +
                    ((Math.sin((iz + clock.elapsedTime * 2) / 10) + 2) );
                j++;
            }
        }

        pointsRef.current.getAttribute("position").needsUpdate = true;
        pointsRef.current.getAttribute("scale").needsUpdate = true;
    })

    return (
        <points>
            <bufferGeometry ref={pointsRef}>
                <bufferAttribute
                    args={[positions, 3]}
                    attach={"attributes-position"}
                />
                <bufferAttribute
                    args={[scales, 1]}
                    attach={"attributes-scale"}
                />
            </bufferGeometry>
            <pointMaterial/>
        </points>
    )
})

export default function PointBackground() {
    return (
        <Canvas camera={{fov:40, position:[10,40,30]}}>
            <Background/>
        </Canvas>
    )
}
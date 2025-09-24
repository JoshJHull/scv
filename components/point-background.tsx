"use client"

import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import {useRef} from "react";
import { PointsMaterial,} from "three";

const SEPERATION = 1, NUMX = 200, NUMZ = 200;

const pointNum = NUMX * NUMZ;

const positions = new Float32Array( pointNum * 3 );

let i = 0
for (let ix = 0; ix < NUMX; ix++) {
    for (let iz = 0; iz < NUMZ; iz++) {
        positions[i] = ix * SEPERATION - ((NUMX * SEPERATION) / 2);
        positions[i+1] = 0;
        positions[i+2] = iz * SEPERATION - ((NUMZ * SEPERATION) / 2);
        i += 3;
    }
}

const Background = (() => {
    const pointShader = useRef<PointsMaterial>(null!);

    useFrame(({clock}) => {
        i = 0;
        for (let ix = 0; ix < NUMX; ix++) {
            for (let iz = 0; iz < NUMZ; iz++) {
                positions[i+1] = (Math.sin((ix + clock.elapsedTime * 1.5) / 10)) +
                    (Math.sin((iz + clock.elapsedTime * 1.5) / 10));
                i += 3;
            }
        }
    })

    return (
            <Points positions={positions}>
                <PointMaterial ref={pointShader} size={0.6} color={"white"} transparent opacity={0.1}/>
            </Points>
    )
})

export default function PointBackground() {
    return (
        <Canvas camera={{fov:40, position:[10,40,30]}}>
            <Background/>
        </Canvas>
    )
}
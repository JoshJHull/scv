"use client"

import {Canvas} from "@react-three/fiber";
import PointBackground from "@/components/point-background";

export default function HomeScene() {

    return(
        <Canvas camera={{fov:40, position:[10,40,30]}}>
            <PointBackground/>
        </Canvas>
    )
}
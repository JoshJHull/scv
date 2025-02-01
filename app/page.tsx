"use client";

import {Canvas} from "@react-three/fiber";
import {ContactShadows, Environment, OrbitControls} from "@react-three/drei";

export default function Home() {
    return (
        <div className={"flex justify-center h-screen w-full"}>
            <Canvas shadows frameloop={"demand"}>
                <OrbitControls />
                <ambientLight intensity={0.1} />
                <directionalLight position={[0, 1, 1]} color="red"/>
                <mesh position={[0, 2, 0]}>
                    <sphereGeometry args={[2, 64, 32]} />
                    <meshStandardMaterial metalness={1} roughness={0.1} />
                </mesh>
                <ContactShadows blur={10} />
                <Environment preset={"sunset"}/>
            </Canvas>
        </div>

      )
}


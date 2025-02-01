"use client";

import {Canvas, useFrame} from "@react-three/fiber";
import {Bounds} from "@react-three/drei";
import {useRef, useState} from "react";
import {Mesh} from "three";
import {Button} from "@/components/ui/button";
import ShipsCombo from "@/components/ui/race/ships-combo";
import DrivesCombo from "@/components/ui/race/drives-combo";
import RouteCombo from "@/components/ui/race/route-combo";
import {Separator} from "@/components/ui/separator";
import {AnimatePresence, motion} from "motion/react";

const MotionButton = motion.create(Button);

const RaceSettings = () => {
    const [openMenu, setOpenMenu] = useState(false);

    const [ship1, setShip1] = useState("");
    const [drive1, setDrive1] = useState("");
    const [ship2, setShip2] = useState("");
    const [drive2, setDrive2] = useState("");
    const [route, setRoute] = useState("");

    return (
        <div className={"absolute flex w-full p-10 justify-end"}>
            <div className={"flex flex-col space-y-5"}>
                <div className={"flex justify-end"}>
                    <MotionButton whileHover={{scale: 1.1}} onClick={() => setOpenMenu(!openMenu)}>Select Ships</MotionButton>
                </div>
                <AnimatePresence>
                    {openMenu &&
                        <motion.div initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className={"flex flex-col space-y-5 p-5 bg-gray-300 rounded-md"}>
                            <div className={"flex flex-col space-y-3"}>
                                <h1>Ship 1</h1>
                                <ShipsCombo value={ship1} setValue={setShip1} />
                                <DrivesCombo value={drive1} setValue={setDrive1} />
                            </div>
                            <Separator />
                            <div className={"flex flex-col space-y-3"}>
                                <h1>Ship 2</h1>
                                <ShipsCombo value={ship2} setValue={setShip2} />
                                <DrivesCombo value={drive2} setValue={setDrive2} />
                            </div>
                            <Separator />
                            <RouteCombo value={route} setValue={setRoute} />
                        </motion.div>}
                </AnimatePresence>

            </div>
        </div>

    )
}

const Objects = () => {
    const sphere1 = useRef<Mesh>(null!);

    useFrame((state, delta) => {
        //sphere1.current.position.z += 0.5 * delta;
    })

    return (
        <>
            <ambientLight intensity={0.25} />
            <pointLight intensity={100} position={[0, 0, 0]}/>
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial emissive={0xffffff} />
            </mesh>
            <mesh position={[5, 0, 5]} ref={sphere1}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0xeb8334} />
            </mesh>
            <mesh position={[5, 0, -5]}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0x7134eb} />
            </mesh>
            <mesh position={[-5, 0, 0]}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0x7134eb} />
            </mesh>
        </>

    )
}

export default function Race() {
    return (
        <>
            <div className={"w-full h-full bg-gray-600 overflow-hidden min-w-0 min-h-0"}>
                <Canvas camera={{fov: 60, position:[0,20,10]}}>
                    <Bounds fit clip observe margin={1.1}>
                        <Objects />
                    </Bounds>
                </Canvas>
            </div>
            <RaceSettings />
        </>

    )
}

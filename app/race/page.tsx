"use client";

import {Canvas, useFrame} from "@react-three/fiber";
import {Bounds, Line, Stars} from "@react-three/drei";
import {useMemo, useRef, useState} from "react";
import {BufferGeometry, EllipseCurve, Mesh, Vector3} from "three";
import {Button} from "@/components/ui/button";
import ShipsCombo from "@/components/ui/race/ships-combo";
import DrivesCombo from "@/components/ui/race/drives-combo";
import LocCombo from "@/components/ui/race/loc-combo";
import {Separator} from "@/components/ui/separator";
import {AnimatePresence, motion} from "motion/react";

const MotionButton = motion.create(Button);

const driveSpeed = 0.171;
const fuelUse = 0.016;
const fuelCap = 3.6;

const RunRace = () => {

}

const RaceSettings = () => {
    const [openMenu, setOpenMenu] = useState(false);

    const [ship1, setShip1] = useState("");
    const [drive1, setDrive1] = useState("");
    const [ship2, setShip2] = useState("");
    const [drive2, setDrive2] = useState("");
    const [origin, setOrigin] = useState("");
    const [dest, setDest] = useState("");

    return (
        <div className={"absolute flex w-full p-10 justify-end"}>
            <div className={"flex flex-col space-y-5"}>
                <div className={"flex justify-end"}>
                    <MotionButton whileHover={{scale: 1.1}} onClick={() => setOpenMenu(!openMenu)}
                    className={"text-black bg-white hover:text-black hover:bg-white"}>Race Setup</MotionButton>
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
                            <h1>Origin</h1>
                            <LocCombo value={origin} setValue={setOrigin} />
                            <h1>Destination</h1>
                            <LocCombo value={dest} setValue={setDest} />
                        </motion.div>}
                </AnimatePresence>

            </div>
        </div>

    )
}

const Objects = () => {
    const hurston = useRef<Mesh>(null!);
    const arccorp = useRef<Mesh>(null!);
    const microtech = useRef<Mesh>(null!);
    const crusader = useRef<Mesh>(null!);

    const shipObj1 = useRef<Mesh>(null!);
    const shipObj2 = useRef<Mesh>(null!);

    const microtechOrbit = useMemo(() => {
        return new EllipseCurve(0,0, 43.443,43.443, 0,2 * Math.PI, false, 0).getPoints(100).map((point) =>
            new Vector3(point.x, 0, point.y))
    }, []);

    const hurstonOrbit = useMemo(() => {
        return new EllipseCurve(0,0, 12.85,12.85, 0,2 * Math.PI, false, 0).getPoints(100).map((point) =>
            new Vector3(point.x, 0, point.y))
    }, []);

    const arccorpOrbit = useMemo(() => {
        return new EllipseCurve(0,0, 28.917,28.917, 0,2 * Math.PI, false, 0).getPoints(100).map((point) =>
            new Vector3(point.x, 0, point.y))
    }, []);

    const crusaderOrbit = useMemo(() => {
        return new EllipseCurve(0,0, 19.148,19.148, 0,2 * Math.PI, false, 0).getPoints(100).map((point) =>
            new Vector3(point.x, 0, point.y))
    }, []);

    useFrame((state, delta) => {
        //sphere1.current.position.z += 0.5 * delta;
    })

    return (
        <>
            <ambientLight intensity={0.25} />
            <pointLight intensity={2} decay={0} position={[0, 0, 0]}/>
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.8, 64, 32]} />
                <meshStandardMaterial emissive={0xffffff} />
            </mesh>
            <Line points={microtechOrbit} color={0xffffff} lineWidth={0.5} />
            <mesh position={[22.462, 0, -37.186]} ref={microtech}>
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0xb3ccf5} />
            </mesh>
            <Line points={hurstonOrbit} color={0xffffff} lineWidth={0.5} />
            <mesh position={[12.85, 0, 0]} ref={hurston}>
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0xeb8334} />
            </mesh>
            <Line points={arccorpOrbit} color={0xffffff} lineWidth={0.5} />
            <mesh position={[18.588, 0, 22.152]} ref={arccorp}>
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0x9aa0b5} />
            </mesh>
            <Line points={crusaderOrbit} color={0xffffff} lineWidth={0.5} />
            <mesh position={[-18.962, 0, 2.665]} ref={crusader}>
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0xf5bae3} />
            </mesh>
            <mesh position={[0, 0, -2]} ref={shipObj1}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0xff0000} />
            </mesh>
            <mesh position={[0, 0, -5]} ref={shipObj2}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0xff0000} />
            </mesh>
        </>

    )
}

export default function Race() {
    return (
        <>
            <div className={"w-full h-full bg-gray-950 overflow-hidden min-w-0 min-h-0"}>
                <Canvas camera={{fov: 60, position:[0,80,0]}}>
                    <Objects />
                    <Stars fade speed={0} />
                </Canvas>
            </div>
            <RaceSettings />
        </>

    )
}

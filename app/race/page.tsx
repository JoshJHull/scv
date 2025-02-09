"use client";

import {Canvas, useFrame} from "@react-three/fiber";
import {Bounds, Line, Stars} from "@react-three/drei";
import {RefObject, useEffect, useMemo, useRef, useState} from "react";
import {EllipseCurve, Mesh, Vector3} from "three";
import {Button} from "@/components/ui/button";
import ShipsCombo from "@/components/ui/race/ships-combo";
import DrivesCombo from "@/components/ui/race/drives-combo";
import LocCombo from "@/components/ui/race/loc-combo";
import {Separator} from "@/components/ui/separator";
import {AnimatePresence, motion} from "motion/react";

const MotionButton = motion.create(Button);

const locations: Record<string, Vector3> = {
    microtech: new Vector3(22.462, 0, -37.186),
    hurston: new Vector3(12.85, 0, 0),
    arccorp: new Vector3(18.588, 0, 22.152),
    crusader: new Vector3(-18.962, 0, 2.665),
};

enum raceStatus {
    stopped,
    running,
    paused,
}

const driveSpeed = 0.171;
const fuelUse = 0.016;
const fuelCap = 3.6;

const ShipRace = ({raceState, shipRef}:
                   {raceState: raceStatus, shipRef: RefObject<Mesh>}) => {
    useFrame((_state, delta) => {
        if(raceState === raceStatus.running) {
            shipRef.current.position.x += 0.5 * delta;
        }
    });

    return (
        <></>
    )
}

export default function Race() {
    const shipObj1 = useRef<Mesh>(null!);
    const shipObj2 = useRef<Mesh>(null!);

    const [openSetup, setOpenSetup] = useState(false);

    const [ship1, setShip1] = useState("misc_starlancer_max");
    const [drive1, setDrive1] = useState("sparkfire");
    const [ship2, setShip2] = useState("");
    const [drive2, setDrive2] = useState("");
    const [origin, setOrigin] = useState("microtech");
    const [dest, setDest] = useState("hurston");

    const [raceState, setRaceState] = useState(raceStatus.stopped);

    useEffect(() => {
        if(shipObj1.current && raceState === raceStatus.stopped) {
            shipObj1.current.position.x = locations[origin].x;
            shipObj1.current.position.y = 1;
            shipObj1.current.position.z = locations[origin].z;
        }
    }, [raceState, origin]);

    return (
        <>
            <div className={"w-full h-full bg-gray-950 overflow-hidden min-w-0 min-h-0"}>
                <Canvas camera={{fov: 60, position:[0,80,0]}}>
                    <Objects ship1={shipObj1} ship2={shipObj2} />
                    <Stars fade speed={0} />
                    <ShipRace raceState={raceState} shipRef={shipObj1}/>
                </Canvas>
            </div>
            <div className={"absolute flex w-full pt-5 pr-10 justify-end"}>
                <div className={"flex flex-col space-y-5"}>
                    <div className={"flex space-x-4 justify-end"}>
                        <div>
                            <Button onClick={() => setRaceState(raceStatus.running)} disabled={Boolean(raceState)}
                                          className={"text-white rounded-r-none bg-green-500 hover:text-white hover:bg-green-600"}>Start</Button>
                            <Button onClick={() => setRaceState(raceStatus.paused)}
                                          className={"text-black rounded-none bg-white hover:text-black hover:bg-gray-200"}>Pause</Button>
                            <Button onClick={() => setRaceState(raceStatus.stopped)}
                                          className={"text-white rounded-l-none bg-red-500 hover:text-white hover:bg-red-600"}>Reset</Button>
                        </div>
                        <MotionButton whileHover={{scale: 1.1}} onClick={() => setOpenSetup(!openSetup)} disabled={Boolean(raceState)}
                                      className={"text-black bg-white hover:text-black hover:bg-white"}>Setup</MotionButton>
                    </div>
                    <AnimatePresence>
                        {openSetup &&
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
        </>

    )
}

const Objects = ({ship1, ship2}:
                 {ship1: RefObject<Mesh>, ship2: RefObject<Mesh>}) => {

    const microtechOrbit = useMemo(() => {
        return new EllipseCurve(0,0, 43.443,43.443, 0,2 * Math.PI, false, 0).getPoints(150).map((point) =>
            new Vector3(point.x, 0, point.y))
    }, []);

    const hurstonOrbit = useMemo(() => {
        return new EllipseCurve(0,0, 12.85,12.85, 0,2 * Math.PI, false, 0).getPoints(150).map((point) =>
            new Vector3(point.x, 0, point.y))
    }, []);

    const arccorpOrbit = useMemo(() => {
        return new EllipseCurve(0,0, 28.917,28.917, 0,2 * Math.PI, false, 0).getPoints(150).map((point) =>
            new Vector3(point.x, 0, point.y))
    }, []);

    const crusaderOrbit = useMemo(() => {
        return new EllipseCurve(0,0, 19.148,19.148, 0,2 * Math.PI, false, 0).getPoints(150).map((point) =>
            new Vector3(point.x, 0, point.y))
    }, []);

    return (
        <>
            <ambientLight intensity={0.25} />
            <pointLight intensity={2} decay={0} position={[0, 0, 0]}/>
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.8, 64, 32]} />
                <meshStandardMaterial emissive={0xffffff} />
            </mesh>
            <Line points={microtechOrbit} color={0xffffff} lineWidth={0.5} opacity={0.5} transparent={true} />
            <mesh position={locations.microtech} >
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0xb3ccf5} />
            </mesh>
            <Line points={hurstonOrbit} color={0xffffff} lineWidth={0.5} opacity={0.5} transparent={true} />
            <mesh position={locations.hurston} >
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0xeb8334} />
            </mesh>
            <Line points={arccorpOrbit} color={0xffffff} lineWidth={0.5} opacity={0.5} transparent={true} />
            <mesh position={locations.arccorp} >
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0x9aa0b5} />
            </mesh>
            <Line points={crusaderOrbit} color={0xffffff} lineWidth={0.5} opacity={0.5} transparent={true} />
            <mesh position={locations.crusader} >
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0xf5bae3} />
            </mesh>
            <mesh position={[22.462, 1, -37.186]} ref={ship1}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0xff0000} />
            </mesh>
            <mesh position={[0, 0, -5]} ref={ship2}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0xff0000} />
            </mesh>
        </>

    )
}
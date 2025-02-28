"use client";

import {Canvas, useFrame} from "@react-three/fiber";
import {Bounds, Html, Line, Stars} from "@react-three/drei";
import {Dispatch, RefObject, SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {EllipseCurve, Mesh, Vector3} from "three";
import {Button} from "@/components/ui/button";
import ShipsCombo from "@/components/ui/race/ships-combo";
import DrivesCombo from "@/components/ui/race/drives-combo";
import LocCombo from "@/components/ui/race/loc-combo";
import {Separator} from "@/components/ui/separator";
import {AnimatePresence, motion} from "motion/react";
import {Pause, Play, RotateCcw, Settings} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import clsx from "clsx";

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

enum jumpPhase {
    accel,
    cruise,
    decel,
    complete,
}

const driveSpeed = 0.171;
const fuelUse = 0.016;
const fuelCap = 3.6;
const stage1accel = 0.003450;
const stage2accel = 0.017200;

let accel = 0;
let realSpeed = 0;

const ShipRace = ({raceState, setRaceState, shipRef, dest, setSpeedState, simRate}:
                   {raceState: raceStatus, setRaceState: Dispatch<SetStateAction<raceStatus>>, shipRef: RefObject<Mesh>, dest: Vector3, setSpeedState: Dispatch<SetStateAction<number>>, simRate: number}) => {
    const accelLength = 2 * driveSpeed / (stage1accel + stage2accel);
    const accelRate = (stage2accel - stage1accel) / accelLength;

    accel = stage1accel;

    const destination = dest.clone();
    destination.setY(destination.y + 1);
    let forwardVector = new Vector3(0,0,0);
    let speed = 0;

    useFrame((_state, delta) => {

        if(raceState === raceStatus.running) {
            if(realSpeed != driveSpeed) {
                accel += (accelRate * delta * simRate);
                realSpeed += (accel * delta * simRate);

            }
            if(realSpeed >= driveSpeed){
                realSpeed = driveSpeed;
                accel = 0;
            }
            speed = realSpeed * delta * simRate;
            forwardVector = forwardVector.subVectors(destination, shipRef.current.position).normalize();
            if(shipRef.current.position.equals(destination)) {
                setRaceState(raceStatus.paused);
            }
            shipRef.current.position.x += forwardVector.x * speed;
            shipRef.current.position.y += forwardVector.y * speed;
            shipRef.current.position.z += forwardVector.z * speed;
        }
    });

    useEffect(() => {
        const interval = setInterval(() => setSpeedState(realSpeed), 100);
        return () => {
            clearInterval(interval);
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
    const [nameVis, setNameVis] = useState(true);
    const [simRate, setSimRate] = useState(1);

    const [ship1, setShip1] = useState("misc_starlancer_max");
    const [drive1, setDrive1] = useState("sparkfire");
    const [ship2, setShip2] = useState("");
    const [drive2, setDrive2] = useState("");
    const [origin, setOrigin] = useState("microtech");
    const [dest, setDest] = useState("hurston");

    const [jumpState, setJumpState] = useState(jumpPhase.accel);
    const [speedState, setSpeedState] = useState(0);

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
                    <Objects ship1={shipObj1} ship2={shipObj2} speedState={speedState} nameVis={nameVis}/>
                    <Stars fade speed={0} />
                    <ShipRace raceState={raceState} setRaceState={setRaceState} shipRef={shipObj1} dest={locations[dest]} setSpeedState={setSpeedState} simRate={simRate}/>
                </Canvas>
            </div>
            <div className={"absolute flex w-full pt-5 pr-10 justify-end"}>
                <div className={"flex flex-col space-y-5"}>
                    <div className={"flex space-x-4 justify-end"}>
                        <div className={"flex"}>
                            {
                                (raceState != raceStatus.running) ?
                                <Button onClick={() => {
                                    setRaceState(raceStatus.running)
                                    setOpenSetup(false)
                                }} className={"text-white rounded-r-none bg-green-500 hover:text-white hover:bg-green-600"}>
                                    <Play />
                                </Button>
                                :
                                <Button onClick={() => setRaceState(raceStatus.paused)} disabled={!Boolean(raceState)}
                                          className={"rounded-r-none"}>
                                        <Pause />
                                </Button>
                            }
                            <Button onClick={() => setRaceState(raceStatus.stopped)} disabled={!Boolean(raceState)}
                                          className={"text-white rounded-l-none bg-red-500 hover:text-white hover:bg-red-600"}>
                                <RotateCcw />
                            </Button>
                        </div>
                        <MotionButton whileHover={{scale: 1.1}} onClick={() => setOpenSetup(!openSetup)} disabled={Boolean(raceState)}>
                            <Settings />
                        </MotionButton>
                    </div>
                    <div className={"flex"}>
                        <Button onClick={() => setSimRate(1)} className={clsx("rounded-r-none", {"bg-neutral-400": simRate == 1})}>1x</Button>
                        <Button onClick={() => setSimRate(2)} className={clsx("rounded-l-none rounded-r-none", {"text-white bg-gray-400": simRate == 2})}>2x</Button>
                        <Button onClick={() => setSimRate(4)} className={clsx("rounded-l-none", {"text-white bg-gray-400": simRate == 4})}>4x</Button>
                    </div>
                    <div className={"flex items-center space-x-2 justify-end"}>
                        <Switch checked={nameVis} onCheckedChange={() => setNameVis(!nameVis)} />
                        <Label className={"text-white"}>Location Names</Label>
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

const Objects = ({ship1, ship2, speedState, nameVis}:
                 {ship1: RefObject<Mesh>, ship2: RefObject<Mesh>, speedState: number, nameVis: boolean}) => {

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
                {nameVis &&
                    <Html>
                        <div className={"text-white pl-5 w-20 opacity-50"}>Microtech</div>
                    </Html>
                }
            </mesh>
            <Line points={hurstonOrbit} color={0xffffff} lineWidth={0.5} opacity={0.5} transparent={true} />
            <mesh position={locations.hurston} >
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0xeb8334} />
                {nameVis &&
                    <Html>
                        <div className={"text-white pl-5 w-20 opacity-50"}>Hurston</div>
                    </Html>
                }
            </mesh>
            <Line points={arccorpOrbit} color={0xffffff} lineWidth={0.5} opacity={0.5} transparent={true} />
            <mesh position={locations.arccorp} >
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0x9aa0b5} />
                {nameVis &&
                    <Html>
                        <div className={"text-white pl-5 w-20 opacity-50"}>ArcCorp</div>
                    </Html>
                }
            </mesh>
            <Line points={crusaderOrbit} color={0xffffff} lineWidth={0.5} opacity={0.5} transparent={true} />
            <mesh position={locations.crusader} >
                <sphereGeometry args={[1, 64, 32]} />
                <meshStandardMaterial color={0xf5bae3} />
                {nameVis &&
                    <Html>
                        <div className={"text-white pl-5 w-20 opacity-50"}>Crusader</div>
                    </Html>
                }
            </mesh>
            <mesh position={[22.462, 1, -37.186]} ref={ship1}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0xff0000} />
                <Html>
                    <div className={"text-white w-20"}>{(speedState * 1000).toFixed(0)} km/s</div>
                </Html>
            </mesh>
            <mesh position={[0, 0, -5]} ref={ship2}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0xff0000} />
            </mesh>
        </>

    )
}
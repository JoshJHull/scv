"use client";

import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {Suspense, useEffect, useRef, useState} from "react";
import { Mesh, Vector3 } from "three";
import {Button} from "@/components/ui/button";
import ShipsCombo from "@/components/ui/race/ships-combo";
import DrivesCombo from "@/components/ui/race/drives-combo";
import LocCombo from "@/components/ui/race/loc-combo";
import {ArrowLeft, ArrowRight, Gauge, Pause, Play, RotateCcw} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import clsx from "clsx";
import {locations} from "@/components/locations";
import {Objects} from "@/components/race-objects";
import {getCachedDrives, getCachedShips} from "@/lib/db";
import {Drive, Nullable, raceStatus, Ship} from "@/lib/definitions";
import RaceLogic, {raceInit} from "@/components/race-logic";
import {AnimatePresence, motion} from "motion/react"
import Link from "next/link";
import styles from "./race.module.css";
import RouteLines from "@/components/route-lines";
import EnterAnim from "@/components/ui/race/enter-anim";

//const MotionButton = motion.create(Button);

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const shipTarget = function (ship: number, location: Vector3): Vector3 {
    if(ship == 1)
        return new Vector3(location.x - 0.75, location.y + 1.5, location.z);
    return new Vector3(location.x + 0.75, location.y + 1.5, location.z);
}

const linePoints1 = [shipTarget(1, locations["microtech"]), shipTarget(1, locations["hurston"])];
const linePoints2 = [shipTarget(2, locations["microtech"]), shipTarget(2, locations["hurston"])];

let shipList: Ship[] = [];
let driveList: Drive[] = [];

export default function Race() {
    const shipObj1 = useRef<Mesh>(null!);
    const shipObj2 = useRef<Mesh>(null!);

    const [nameVis, setNameVis] = useState(true);
    const [simRate, setSimRate] = useState(1);

    const [ship1, setShip1] = useState<Nullable<Ship>>();
    const [drive1, setDrive1] = useState<Nullable<Drive>>();
    const [ship2, setShip2] = useState<Nullable<Ship>>();
    const [drive2, setDrive2] = useState<Nullable<Drive>>();
    const [origin, setOrigin] = useState("microtech");
    const [dest, setDest] = useState("hurston");

    const [route1, setRoute1] = useState<string[]>(["microtech"]);
    const [route2, setRoute2] = useState<string[]>(["microtech"]);

    const [speedStates, setSpeedStates] = useState<number[]>([0,0]);
    const [phaseStates, setPhaseStates] = useState<string[]>(["Accelerating", "Accelerating"]);

    const [raceState, setRaceState] = useState(raceStatus.stopped);
    const [racePanel, setRacePanel] = useState(false);

    const [driveList1, setDriveList1] = useState<Drive[]>([]);
    const [driveList2, setDriveList2] = useState<Drive[]>([]);

    useEffect(() => {
        const getData = async() => {
            shipList = await getCachedShips();
            driveList = await getCachedDrives();
        }
        const setDefaultShips = () => {
            const default1 = shipList.find(s => s.id === "misc_starlancer_max");
            const default2 = shipList.find(s => s.id === "drake_corsair");
            handleShip1(default1);
            handleShip2(default2);
        }

        getData().then(setDefaultShips);
    }, []);

    const handleRaceReset = () => {
        setRaceState(raceStatus.stopped);
        setRacePanel(false);

        shipObj1.current.position.x = locations[origin].x - 0.75;
        shipObj1.current.position.y = 1.5;
        shipObj1.current.position.z = locations[origin].z;

        shipObj2.current.position.x = locations[origin].x + 0.75;
        shipObj2.current.position.y = 1.5;
        shipObj2.current.position.z = locations[origin].z;
    }

    const handleRaceOrigin = (locID: string) => {
        setOrigin(locID);

        shipObj1.current.position.x = locations[locID].x - 0.75;
        shipObj1.current.position.y = 1.5;
        shipObj1.current.position.z = locations[locID].z;

        shipObj2.current.position.x = locations[locID].x + 0.75;
        shipObj2.current.position.y = 1.5;
        shipObj2.current.position.z = locations[locID].z;

        linePoints1[0] = shipTarget(1, locations[locID]);
        linePoints2[0] = shipTarget(2, locations[locID]);
    }

    const handleRaceDest = (locID: string) => {
        setDest(locID);

        linePoints1[1] = shipTarget(1, locations[locID]);
        linePoints2[1] = shipTarget(2, locations[locID]);
    }

    const handleShip1 = (ship: Nullable<Ship>) => {
        if(ship){
            setShip1(ship);
            const validDrives = driveList.filter(d => d.size === ship.size);
            setDriveList1(validDrives);
            const defaultDrive = driveList.find(d => d.id === ship.default_drive);
            setDrive1(defaultDrive);
        }
    }

    const handleShip2 = (ship: Nullable<Ship>) => {
        if(ship){
            setShip2(ship);
            const validDrives = driveList.filter(d => d.size === ship.size);
            setDriveList2(validDrives);
            const defaultDrive = driveList.find(d => d.id === ship.default_drive);
            setDrive2(defaultDrive);
        }
    }

    return (
        <>
            <EnterAnim/>
            <div className={"grow bg-gray-950 overflow-hidden min-w-0 min-h-0"}>
                <Suspense>
                    <Canvas camera={{fov: 60, position:[0,70,0]}}>
                        <Objects ship1={shipObj1} ship2={shipObj2} nameVis={nameVis}/>
                        <RouteLines linePoints1={linePoints1} linePoints2={linePoints2}/>
                        <RaceLogic raceState={raceState} setRaceState={setRaceState} ship1Ref={shipObj1} ship2Ref={shipObj2}
                                   dest={locations[dest]} setSpeedStates={setSpeedStates} phaseStates={phaseStates} setPhaseStates={setPhaseStates}
                                   simRate={simRate}/>
                        <OrbitControls maxPolarAngle={degToRad(90)} minPolarAngle={degToRad(20)}/>
                    </Canvas>
                </Suspense>
            </div>

            <div className={"absolute w-full h-20 top-0 bottom-auto bg-gradient-to-b from-[#171738] from-5%"}></div>

            <div className={"absolute flex w-full pt-5 pr-10 pl-10 text-white"}>
                <Link href={"/"} className={styles.underline}>
                    <div className={"flex space-x-1 items-center"}>
                        <ArrowLeft size={16}/>
                        <p>Back</p>
                    </div>
                </Link>
                <div className={"grow"}></div>
                <div className={"flex items-center space-x-2 justify-end"}>
                    <Label>Location Names</Label>
                    <Switch checked={nameVis} onCheckedChange={() => setNameVis(!nameVis)} />
                </div>
            </div>

            <div className={"absolute w-full h-auto top-auto bottom-0"}>

                <div className={"flex flex-row justify-center items-center space-x-8 p-3 bg-gradient-to-t from-[#171738]"}>

                    <div className={"flex justify-center items-center space-x-3"}>
                        <div className={"flex flex-nowrap"}>
                            {
                                (raceState != raceStatus.running) ?
                                    <Button onClick={() => {
                                        setRaceState(raceStatus.running)
                                        setRacePanel(true);
                                        if (ship1 && ship2 && drive1 && drive2 && raceState == raceStatus.stopped)
                                            raceInit(ship1, ship2, drive1, drive2, locations[dest], shipObj1, shipObj2);
                                    }}
                                            className={"rounded-r-none bg-green-500 hover:bg-green-600"}>
                                        <Play color="#ffffff"/>
                                    </Button>
                                    :
                                    <Button onClick={() => setRaceState(raceStatus.paused)}
                                            disabled={!Boolean(raceState)}
                                            className={"rounded-r-none"}>
                                        <Pause/>
                                    </Button>
                            }
                            <Button onClick={handleRaceReset} disabled={!Boolean(raceState)}
                                    className={"rounded-l-none bg-red-500 hover:bg-red-600"}>
                                <RotateCcw color="#ffffff"/>
                            </Button>
                        </div>
                        <div className={"flex flex-nowrap"}>
                            <Button onClick={() => setSimRate(1)}
                                    className={clsx("rounded-r-none", {"bg-neutral-400": simRate == 1})}>1x</Button>
                            <Button onClick={() => setSimRate(4)}
                                    className={clsx("rounded-l-none rounded-r-none", {"text-white bg-gray-400": simRate == 4})}>4x</Button>
                            <Button onClick={() => setSimRate(8)}
                                    className={clsx("rounded-l-none", {"text-white bg-gray-400": simRate == 8})}>8x</Button>
                        </div>
                    </div>

                    <div className={"flex flex-row items-center space-x-2"}>
                        <LocCombo value={origin} setValue={setOrigin} onChange={handleRaceOrigin}
                                  disabled={Boolean(raceState)}/>
                        <ArrowRight color="#ffffff" />
                        <LocCombo value={dest} setValue={setDest} onChange={handleRaceDest}
                                  disabled={Boolean(raceState)}/>
                    </div>
                </div>
            </div>

            <div className={"absolute flex justify-center items-center rounded-sm p-3 h-40 w-60 " +
                "top-auto bottom-5 left-5 outline-double outline-8 outline-indigo-500/30 bg-red-800"}>
                <AnimatePresence mode={"wait"}>
                    {racePanel
                        ? <motion.div className={"flex flex-col gap-2 text-white"}
                            key={`${racePanel}`}
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 20}}
                            transition={{duration: 0.3}}
                        >
                            {ship1?.name}
                            <div className={"flex gap-2"}>
                                <Gauge color="#ffffff" />
                                {(speedStates[0] * 1000000).toFixed(0)} km/s
                            </div>
                            {phaseStates[0]}

                        </motion.div>
                        : <motion.div className={"flex flex-col space-y-2"}
                            key={`${racePanel}`}
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 20}}
                            transition={{duration: 0.2}}
                        >
                            <ShipsCombo value={ship1} shipList={shipList} disabled={Boolean(raceState)}
                                onChange={handleShip1}/>
                            <DrivesCombo value={drive1} setValue={setDrive1} driveList={driveList1}
                                disabled={Boolean(raceState)}/>
                        </motion.div>}
                </AnimatePresence>
            </div>

            <div className={"absolute flex justify-center items-center rounded-sm p-3 h-40 w-60 " +
                "top-auto bottom-5 right-5 outline-double outline-8 outline-indigo-500/30 bg-blue-900"}>
                <AnimatePresence mode={"wait"}>
                    {racePanel
                        ? <motion.div className={"flex flex-col gap-2 text-white"}
                            key={`${racePanel}`}
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 20}}
                            transition={{duration: 0.3}}
                        >
                            {ship2?.name}
                            <div className={"flex gap-2"}>
                                <Gauge color="#ffffff" />
                                {(speedStates[1] * 1000000).toFixed(0)} km/s
                            </div>
                            {phaseStates[1]}

                        </motion.div>
                        : <motion.div className={"flex flex-col space-y-2"}
                            key={`${racePanel}`}
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 20}}
                            transition={{duration: 0.2}}
                        >
                            <ShipsCombo value={ship2} shipList={shipList} disabled={Boolean(raceState)}
                                onChange={handleShip2}/>
                            <DrivesCombo value={drive2} setValue={setDrive2} driveList={driveList2}
                                disabled={Boolean(raceState)}/>
                        </motion.div>}
                </AnimatePresence>
            </div>

        </>
    )
}

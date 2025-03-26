"use client";

import {Canvas, useFrame} from "@react-three/fiber";
import {Stars, OrbitControls} from "@react-three/drei";
import {Dispatch, RefObject, SetStateAction, useEffect, useRef, useState} from "react";
import {Mesh, Vector3} from "three";
import {Button} from "@/components/ui/button";
import ShipsCombo from "@/components/ui/race/ships-combo";
import DrivesCombo from "@/components/ui/race/drives-combo";
import LocCombo from "@/components/ui/race/loc-combo";
import {Pause, Play, RotateCcw} from "lucide-react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import clsx from "clsx";
import {locations} from "@/components/locations";
import {Objects} from "@/components/race-objects";
import {fetchShips} from "@/lib/db";
import {Ship} from "@/lib/definitions";
//import {driveList} from "@/components/drives";

//const MotionButton = motion.create(Button);

//const degToRad = (deg: number) => (deg * Math.PI) / 180;

enum raceStatus {
    stopped,
    running,
    paused,
}

/*enum jumpPhase {
    accel,
    cruise,
    decel,
    complete,
}*/

const driveSpeed = 0.171;
//const fuelUse = 0.016;
//const fuelCap = 3.6;
const stage1accel = 0.003450;
const stage2accel = 0.017200;

let accel = 0;
let realSpeed = 0;

const ShipRace = ({raceState, setRaceState, ship1Ref, ship2Ref, dest, setSpeedState, simRate}:
                   {raceState: raceStatus, setRaceState: Dispatch<SetStateAction<raceStatus>>, ship1Ref: RefObject<Mesh>, ship2Ref: RefObject<Mesh>, dest: Vector3, setSpeedState: Dispatch<SetStateAction<number>>, simRate: number}) => {
    const accelLength = 2 * driveSpeed / (stage1accel + stage2accel);
    const accelRate = (stage2accel - stage1accel) / accelLength;

    accel = stage1accel;

    const destination = dest.clone();
    destination.setY(destination.y + 1);
    let forwardVector = new Vector3(0,0,0);
    let speed = 0;

    useFrame((_state, delta) => {

        if(raceState === raceStatus.running) {
            //ship1
            if(realSpeed != driveSpeed) {
                accel += (accelRate * delta * simRate);
                realSpeed += (accel * delta * simRate);

            }
            if(realSpeed >= driveSpeed){
                realSpeed = driveSpeed;
                accel = 0;
            }
            speed = realSpeed * delta * simRate;
            forwardVector = forwardVector.subVectors(destination, ship1Ref.current.position).normalize();
            if(ship1Ref.current.position.equals(destination)) {
                setRaceState(raceStatus.paused);
            }
            ship1Ref.current.position.x += forwardVector.x * speed;
            ship1Ref.current.position.y += forwardVector.y * speed;
            ship1Ref.current.position.z += forwardVector.z * speed;

            //ship2
            ship2Ref.current.position.x += 0;
        }
        if(raceState === raceStatus.stopped) {
            accel = 0;
            realSpeed = 0;
            speed = 0;
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

    const [nameVis, setNameVis] = useState(true);
    const [simRate, setSimRate] = useState(1);

    const [ship1, setShip1] = useState("misc_starlancer_max");
    const [drive1, setDrive1] = useState("sparkfire");
    const [ship2, setShip2] = useState("");
    const [drive2, setDrive2] = useState("");
    const [origin, setOrigin] = useState("microtech");
    const [dest, setDest] = useState("hurston");

    //const [jumpState, setJumpState] = useState(jumpPhase.accel);
    const [speedState, setSpeedState] = useState(0);

    const [raceState, setRaceState] = useState(raceStatus.stopped);

    const [shipList, setShipList] = useState<Ship[]>([]);

    useEffect(() => {
        if(shipObj1.current && shipObj2.current) {
            if (raceState === raceStatus.stopped) {
                shipObj1.current.position.x = locations[origin].x - 0.75;
                shipObj1.current.position.y = 1.5;
                shipObj1.current.position.z = locations[origin].z;

                shipObj2.current.position.x = locations[origin].x + 0.75;
                shipObj2.current.position.y = 1.5;
                shipObj2.current.position.z = locations[origin].z;
            }
        }
    }, [raceState, origin]);

    useEffect(() => {
        const getShips = async() => {
            const response = await fetchShips();
            setShipList(response);
        }
        getShips();
    }, []);

    return (
        <>
            <div className={"flex flex-col w-full"}>
                <div className={"grow bg-gray-950 overflow-hidden min-w-0 min-h-0"}>
                    <Canvas camera={{fov: 60, position:[0,80,0]}}>
                        <Objects ship1={shipObj1} ship2={shipObj2} speedState={speedState} nameVis={nameVis}/>
                        <Stars fade speed={0} />
                        <ShipRace raceState={raceState} setRaceState={setRaceState} ship1Ref={shipObj1} ship2Ref={shipObj2}
                                  dest={locations[dest]} setSpeedState={setSpeedState} simRate={simRate}/>
                        <OrbitControls/>
                    </Canvas>
                </div>
                <div className={"flex flex-row justify-center items-center space-x-8 p-3 bg-gray-600"}>
                    <div className={"flex justify-center items-center space-x-3"}>
                        <div className={"flex flex-col space-y-2"}>
                            <h1 className={"text-white"}>Origin</h1>
                            <LocCombo value={origin} setValue={setOrigin} disabled={Boolean(raceState)} />
                        </div>
                        <div className={"flex flex-col space-y-2"}>
                            <h1 className={"text-white"}>Destination</h1>
                            <LocCombo value={dest} setValue={setDest} disabled={Boolean(raceState)} />
                        </div>
                    </div>
                    <div className={"flex justify-center items-center space-x-3"}>
                        <div className={"flex flex-nowrap"}>
                            {
                                (raceState != raceStatus.running) ?
                                    <Button onClick={() => {
                                        setRaceState(raceStatus.running)
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
                        <div className={"flex flex-nowrap"}>
                            <Button onClick={() => setSimRate(1)} className={clsx("rounded-r-none", {"bg-neutral-400": simRate == 1})}>1x</Button>
                            <Button onClick={() => setSimRate(2)} className={clsx("rounded-l-none rounded-r-none", {"text-white bg-gray-400": simRate == 2})}>2x</Button>
                            <Button onClick={() => setSimRate(4)} className={clsx("rounded-l-none", {"text-white bg-gray-400": simRate == 4})}>4x</Button>
                        </div>
                    </div>
                    <div className={"flex justify-center items-center space-x-3"}>
                        <h1 className={"text-white"}>Ship 1</h1>
                        <div className={"flex flex-col space-y-2"}>
                            <ShipsCombo value={ship1} setValue={setShip1} ships={shipList} disabled={Boolean(raceState)} />
                            <DrivesCombo value={drive1} setValue={setDrive1} disabled={Boolean(raceState)} />
                        </div>
                    </div>
                    <div className={"flex justify-center items-center space-x-3"}>
                        <h1 className={"text-white"}>Ship 2</h1>
                        <div className={"flex flex-col space-y-2"}>
                            <ShipsCombo value={ship2} setValue={setShip2} ships={shipList} disabled={Boolean(raceState)} />
                            <DrivesCombo value={drive2} setValue={setDrive2} disabled={Boolean(raceState)} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={"absolute flex w-full pt-5 pr-10 justify-end"}>
                    <div className={"flex items-center space-x-2 justify-end"}>
                        <Label className={"text-white"}>Location Names</Label>
                        <Switch checked={nameVis} onCheckedChange={() => setNameVis(!nameVis)} />
                </div>
            </div>
        </>

    )
}

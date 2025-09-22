import {Dispatch, RefObject, SetStateAction} from "react";
import {Mesh, Vector3} from "three";
import {useFrame} from "@react-three/fiber";
import {Drive, raceStatus, Ship} from "@/lib/definitions";

type ShipContainer = {
  shipStats: Ship;
  driveStats: Drive;
  speed: number;
  accel: number;
  accelTime: number;
  accelRate: number;
  moving: boolean;
  forwardVec: Vector3;
  totalTime: number;
  elapsedTime: number;
  firstCalc: boolean;
  phase: string;
};

let ship1: ShipContainer;
let ship2: ShipContainer;

let ship1Dest: Vector3 = new Vector3(0,0,0);
let ship2Dest: Vector3 = new Vector3(0,0,0);

const tempVec = new Vector3(0,0,0);

let moveSpeed = 0;
let timeSinceUpdate = 0;

export default function RaceLogic({raceState, setRaceState, ship1Ref, ship2Ref, setSpeedStates, phaseStates, setPhaseStates, simRate}:
                  {raceState: raceStatus, setRaceState: Dispatch<SetStateAction<raceStatus>>,
                      ship1Ref: RefObject<Mesh>, ship2Ref: RefObject<Mesh>, dest: Vector3,
                      setSpeedStates: Dispatch<SetStateAction<number[]>>,
                      phaseStates: string[], setPhaseStates: Dispatch<SetStateAction<string[]>>,
                      simRate: number}) {

    useFrame((_state, delta) => {
        if (ship1 && ship2) {
            if (raceState === raceStatus.running) {
                if (ship1.moving) {
                    raceCalc(ship1, ship1Dest, ship1Ref, simRate, delta);
                }
                if (ship2.moving) {
                    raceCalc(ship2, ship2Dest, ship2Ref, simRate, delta);
                }

                //pause if both at dest
                if (!ship1.moving && !ship2.moving) {
                    setRaceState(raceStatus.paused);

                    setSpeedStates([ship1.speed, ship2.speed]);
                    setPhaseStates([ship1.phase, ship2.phase]);
                }

                //update display
                if (timeSinceUpdate >= 0.2) {
                    setSpeedStates([ship1.speed, ship2.speed]);
                    timeSinceUpdate = 0;
                    if (ship1.phase != phaseStates[0] || ship2.phase != phaseStates[1]) {
                        setPhaseStates([ship1.phase, ship2.phase]);
                    }
                }
                else {
                    timeSinceUpdate += delta;
                }
            }
        }
    });

    if (ship1 && ship2) {
        if (raceState === raceStatus.stopped) {
            ship1.accel = (+ship1.driveStats.stage1);
            ship1.speed = 0;
            ship2.accel = (+ship2.driveStats.stage1);
            ship2.speed = 0;
            moveSpeed = 0;
        }
    }

    return (
        <></>
    )
}

const raceCalc = (ship: ShipContainer, dest: Vector3, shipRef: RefObject<Mesh>, simRate: number, delta: number) => {
    tempVec.subVectors(dest, shipRef.current.position).normalize();

    ship.elapsedTime += delta * simRate;

    if (ship.firstCalc) {
        ship.forwardVec = tempVec.clone();
        ship.firstCalc = false;
    }
    else if (ship.elapsedTime >= ship.totalTime) {
        shipRef.current.position.x = dest.x;
        shipRef.current.position.y = dest.y;
        shipRef.current.position.z = dest.z;
        ship.speed = 0;

        ship.moving = false;
        ship.firstCalc = true;
        ship.phase = "Complete"
    }
    else {
        if (ship.elapsedTime > ship.totalTime - ship.accelTime) {
            ship.accel -= (ship.accelRate * delta * simRate);
            ship.speed -= (ship.accel * delta * simRate);

            ship.phase = "Decelerating"
        }
        else if (ship.speed < ship.driveStats.speed) {
            ship.accel += (ship.accelRate * delta * simRate);
            ship.speed += (ship.accel * delta * simRate);

            ship.phase = "Accelerating"
        }
        else {
            ship.accel = ship.driveStats.stage2;
            ship.speed = ship.driveStats.speed;

            ship.phase = "Cruising";
        }

        moveSpeed = ship.speed * delta * simRate;
        shipRef.current.position.x += ship.forwardVec.x * moveSpeed;
        shipRef.current.position.y += ship.forwardVec.y * moveSpeed;
        shipRef.current.position.z += ship.forwardVec.z * moveSpeed;
    }
}

export const raceInit = (newShip1: Ship, newShip2: Ship, newDrive1: Drive, newDrive2: Drive, dest: Vector3,
                         ship1Ref: RefObject<Mesh>, ship2Ref: RefObject<Mesh>) => {
    ship1Dest = dest.clone();
    ship1Dest.setX(ship1Dest.x - 0.75);
    ship1Dest.setY(ship1Dest.y + 1.5);

    ship2Dest = dest.clone();
    ship2Dest.setX(ship2Dest.x + 0.75);
    ship2Dest.setY(ship2Dest.y + 1.5);

    let accelLength = 2 * newDrive1.speed / ((+newDrive1.stage1) + (+newDrive1.stage2));
    let accelRate = (newDrive1.stage2 - newDrive1.stage1) / accelLength;
    let accelTime = (2 * newDrive1.speed) / ((+newDrive1.stage1) + (+newDrive1.stage2));
    let cruiseTime = (ship1Ref.current.position.distanceTo(ship1Dest) / newDrive1.speed) -
        (4 * (newDrive1.speed * (2 * newDrive1.stage1 + (+newDrive1.stage2)))) / (3 * (((+newDrive1.stage1) + (+newDrive1.stage2))*((+newDrive1.stage1) + (+newDrive1.stage2))));
    let totalTime = (2 * accelTime) +  cruiseTime;
    console.log(accelTime);
    console.log(cruiseTime);
    console.log(ship1Ref.current.position.distanceTo(ship1Dest));

    ship1 = {
        shipStats: newShip1,
        driveStats: newDrive1,
        speed: 0,
        accel: (+newDrive1.stage1),
        accelRate: accelRate,
        accelTime: accelTime,
        moving: true,
        forwardVec: new Vector3(0,0,0),
        totalTime: totalTime,
        elapsedTime: 0,
        firstCalc: true,
        phase: "Accelerating"
    };

    accelLength = 2 * newDrive2.speed / ((+newDrive2.stage1) + (+newDrive2.stage2));
    accelRate = (newDrive2.stage2 - newDrive2.stage1) / accelLength;
    accelTime = (2 * newDrive2.speed) / ((+newDrive2.stage1) + (+newDrive2.stage2));
    cruiseTime = (ship2Ref.current.position.distanceTo(ship2Dest) / newDrive2.speed) -
        (4 * (newDrive2.speed * (2 * newDrive2.stage1 + (+newDrive2.stage2)))) / (3 * (((+newDrive2.stage1) + (+newDrive2.stage2))*((+newDrive2.stage1) + (+newDrive2.stage2))));
    totalTime = (2 * accelTime) +  cruiseTime;

    ship2 = {
        shipStats: newShip2,
        driveStats: newDrive2,
        speed: 0,
        accel: (+newDrive2.stage1),
        accelRate: accelRate,
        accelTime: accelTime,
        moving: true,
        forwardVec: new Vector3(0,0,0),
        totalTime: totalTime,
        elapsedTime: 0,
        firstCalc: true,
        phase: "Accelerating"
    };
}
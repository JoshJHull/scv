import {Dispatch, RefObject, SetStateAction} from "react";
import {Mesh, Vector3} from "three";
import {useFrame} from "@react-three/fiber";
import {Drive, raceStatus, Ship} from "@/lib/definitions";

type ShipContainer = {
  shipStats: Ship;
  driveStats: Drive;
  speed: number;
  accel: number;
  accelLength: number;
  accelRate: number;
  moving: boolean;
  forwardVec: Vector3;
  firstCalc: boolean;
};

let ship1: ShipContainer;
let ship2: ShipContainer;

let ship1Dest: Vector3 = new Vector3(0,0,0);
let ship2Dest: Vector3 = new Vector3(0,0,0);

const tempVec = new Vector3(0,0,0);

let moveSpeed = 0;
let timeSinceUpdate = 0;

export default function RaceLogic({raceState, setRaceState, ship1Ref, ship2Ref, setSpeedState, simRate}:
                  {raceState: raceStatus, setRaceState: Dispatch<SetStateAction<raceStatus>>,
                      ship1Ref: RefObject<Mesh>, ship2Ref: RefObject<Mesh>, dest: Vector3,
                      setSpeedState: Dispatch<SetStateAction<number[]>>, simRate: number}) {

    useFrame((_state, delta) => {
        if(ship1 && ship2) {
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
                    console.log("race finished");
                }

                //update speed display
                if(timeSinceUpdate >= 0.2) {
                    setSpeedState([ship1.speed, ship2.speed]);
                    timeSinceUpdate = 0;
                }
                else {
                    timeSinceUpdate += delta;
                }
            }
            if (raceState === raceStatus.stopped) {
                ship1.accel = 0;
                ship1.speed = 0;
                ship2.accel = 0;
                ship2.speed = 0;
                moveSpeed = 0;
                setSpeedState([ship1.speed, ship2.speed]);
            }
        }
    });

    return (
        <></>
    )
}

const raceCalc = (ship: ShipContainer, dest: Vector3, shipRef: RefObject<Mesh>, simRate: number, delta: number) => {
    tempVec.subVectors(dest, shipRef.current.position).normalize();
    //console.log(ship.forwardVec.angleTo(tempVec));

    if (ship.firstCalc) {
        ship.forwardVec = tempVec.clone();
        ship.firstCalc = false;
    }
    else if (ship.forwardVec.angleTo(tempVec) >= 1) {
        shipRef.current.position.x = dest.x;
        shipRef.current.position.y = dest.y;
        shipRef.current.position.z = dest.z;

        ship.moving = false;
        ship.firstCalc = true;
    }
    else {
        if (ship.speed >= ship.driveStats.speed) {
            ship.accel = 0;
            ship.speed = ship.driveStats.speed;
        } else {
            ship.accel += (ship.accelRate * delta * simRate);
            ship.speed += (ship.accel * delta * simRate);
        }
        moveSpeed = ship.speed * delta * simRate;
        //blah
        shipRef.current.position.x += ship.forwardVec.x * moveSpeed;
        shipRef.current.position.y += ship.forwardVec.y * moveSpeed;
        shipRef.current.position.z += ship.forwardVec.z * moveSpeed;
    }
}

export const raceInit = (newShip1: Ship, newShip2: Ship, newDrive1: Drive, newDrive2: Drive, dest: Vector3) => {
    let accelLength = 2 * newDrive1.speed / ((+newDrive1.stage1) + (+newDrive1.stage2));
    let accelRate = (newDrive1.stage2 - newDrive1.stage1) / accelLength;

    ship1 = {
        shipStats: newShip1,
        driveStats: newDrive1,
        speed: 0,
        accel: 0,
        accelLength: accelLength,
        accelRate: accelRate,
        moving: true,
        forwardVec: new Vector3(0,0,0),
        firstCalc: true
    };

    accelLength = 2 * newDrive2.speed / ((+newDrive2.stage1) + (+newDrive2.stage2));
    accelRate = (newDrive2.stage2 - newDrive2.stage1) / accelLength;

    ship2 = {
        shipStats: newShip2,
        driveStats: newDrive2,
        speed: 0,
        accel: 0,
        accelLength: accelLength,
        accelRate: accelRate,
        moving: true,
        forwardVec: new Vector3(0,0,0),
        firstCalc: true
    };

    ship1Dest = dest.clone();
    ship1Dest.setX(ship1Dest.x - 0.75);
    ship1Dest.setY(ship1Dest.y + 1.5);

    ship2Dest = dest.clone();
    ship2Dest.setX(ship2Dest.x + 0.75);
    ship2Dest.setY(ship2Dest.y + 1.5);
}
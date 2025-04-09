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
};

let ship1: ShipContainer;
let ship2: ShipContainer;

let ship1Dest: Vector3 = new Vector3(0,0,0);
let ship2Dest: Vector3 = new Vector3(0,0,0);

let forwardVector = new Vector3(0,0,0);
let moveSpeed = 0;
let timeSinceUpdate = 0;

export default function RaceLogic({raceState, setRaceState, ship1Ref, ship2Ref, setSpeedState, simRate}:
                  {raceState: raceStatus, setRaceState: Dispatch<SetStateAction<raceStatus>>,
                      ship1Ref: RefObject<Mesh>, ship2Ref: RefObject<Mesh>, dest: Vector3,
                      setSpeedState: Dispatch<SetStateAction<number[]>>, simRate: number}) {

    useFrame((_state, delta) => {
        if(ship1 && ship2) {
            if (raceState === raceStatus.running) {
                //ship1
                if (ship1.speed >= ship1.driveStats.speed) {
                    ship1.accel = 0;
                    ship1.speed = ship1.driveStats.speed;
                } else {
                    ship1.accel += (ship1.accelRate * delta * simRate);
                    ship1.speed += (ship1.accel * delta * simRate);
                }
                moveSpeed = ship1.speed * delta * simRate;
                forwardVector = forwardVector.subVectors(ship1Dest, ship1Ref.current.position).normalize();

                ship1Ref.current.position.x += forwardVector.x * moveSpeed;
                ship1Ref.current.position.y += forwardVector.y * moveSpeed;
                ship1Ref.current.position.z += forwardVector.z * moveSpeed;

                //ship2
                if (ship2.speed >= ship2.driveStats.speed) {
                    ship2.accel = 0;
                    ship2.speed = ship2.driveStats.speed;
                } else {
                    ship2.accel += (ship2.accelRate * delta * simRate);
                    ship2.speed += (ship2.accel * delta * simRate);
                }
                moveSpeed = ship2.speed * delta * simRate;
                forwardVector = forwardVector.subVectors(ship2Dest, ship2Ref.current.position).normalize();

                ship2Ref.current.position.x += forwardVector.x * moveSpeed;
                ship2Ref.current.position.y += forwardVector.y * moveSpeed;
                ship2Ref.current.position.z += forwardVector.z * moveSpeed;

                //pause if both at dest
                if (ship1Ref.current.position.equals(ship1Dest) && ship2Ref.current.position.equals(ship2Dest)) {
                    setRaceState(raceStatus.paused);
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

export const raceInit = (newShip1: Ship, newShip2: Ship, newDrive1: Drive, newDrive2: Drive, dest: Vector3) => {
    let accelLength = 2 * newDrive1.speed / ((+newDrive1.stage1) + (+newDrive1.stage2));
    let accelRate = (newDrive1.stage2 - newDrive1.stage1) / accelLength;

    ship1 = {
        shipStats: newShip1,
        driveStats: newDrive1,
        speed: 0,
        accel: 0,
        accelLength: accelLength,
        accelRate: accelRate
    };

    accelLength = 2 * newDrive2.speed / ((+newDrive2.stage1) + (+newDrive2.stage2));
    accelRate = (newDrive2.stage2 - newDrive2.stage1) / accelLength;

    ship2 = {
        shipStats: newShip2,
        driveStats: newDrive2,
        speed: 0,
        accel: 0,
        accelLength: accelLength,
        accelRate: accelRate
    };

    ship1Dest = dest.clone();
    ship1Dest.setX(ship1Dest.x - 0.75);
    ship1Dest.setY(ship1Dest.y + 1.5);

    ship2Dest = dest.clone();
    ship2Dest.setX(ship2Dest.x + 0.75);
    ship2Dest.setY(ship2Dest.y + 1.5);
}
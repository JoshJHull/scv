import {RefObject, useMemo} from "react";
import {EllipseCurve, Mesh, Vector3} from "three";
import {Html, Line} from "@react-three/drei";
import {locations} from "@/components/locations";

export const Objects = ({ship1, ship2, speedState, nameVis}:
                 {ship1: RefObject<Mesh>, ship2: RefObject<Mesh>, speedState: number[], nameVis: boolean}) => {

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
            <mesh position={[22.462 - 0.75, 1.5, -37.186]} ref={ship1}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0xff0000} />
                <Html>
                    <div className={"text-white w-20"}>{(speedState[0] * 1000).toFixed(0)}</div>
                </Html>
            </mesh>
            <mesh position={[22.462 + 0.75, 1.5, -37.186]} ref={ship2}>
                <sphereGeometry args={[0.5, 64, 32]} />
                <meshStandardMaterial color={0x0000fc} />
                <Html>
                    <div className={"text-white w-20"}>{(speedState[1] * 1000).toFixed(0)}</div>
                </Html>
            </mesh>
        </>

    )
}
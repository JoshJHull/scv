import { useRef } from "react";
import { BufferGeometry, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

const MAX_POINTS = 100;
const positions1 = new Float32Array(MAX_POINTS * 3);
const positions2 = new Float32Array(MAX_POINTS * 3);

export default function RouteLines({
    linePoints1,
    linePoints2,
}: {
    linePoints1: Vector3[];
    linePoints2: Vector3[];
}) {
    const route1Ref = useRef<BufferGeometry>(null!);
    const route2Ref = useRef<BufferGeometry>(null!);

    useFrame(() => {
        route1Ref.current.setDrawRange(0, linePoints1.length);
        route2Ref.current.setDrawRange(0, linePoints2.length);

        const positionAttribute = route1Ref.current.getAttribute("position");
        for (let i = 0; i < linePoints1.length; i++) {
            positionAttribute.setXYZ(
                i,
                linePoints1[i].x,
                linePoints1[i].y,
                linePoints1[i].z,
            );
        }
        positionAttribute.needsUpdate = true;

        const positionAttribute2 = route2Ref.current.getAttribute("position");
        for (let i = 0; i < linePoints2.length; i++) {
            positionAttribute2.setXYZ(
                i,
                linePoints2[i].x,
                linePoints2[i].y,
                linePoints2[i].z,
            );
        }
        positionAttribute2.needsUpdate = true;
    });

    return (
        <>
            <line>
                <lineBasicMaterial
                    color={"red"}
                    opacity={0.5}
                    transparent={true}
                    linewidth={2}
                />
                <bufferGeometry ref={route1Ref}>
                    <bufferAttribute
                        args={[positions1, 3]}
                        attach={"attributes-position"}
                    />
                </bufferGeometry>
            </line>
            <line>
                <lineBasicMaterial
                    color={"blue"}
                    opacity={0.5}
                    transparent={true}
                    linewidth={2}
                />
                <bufferGeometry ref={route2Ref}>
                    <bufferAttribute
                        args={[positions2, 3]}
                        attach={"attributes-position"}
                    />
                </bufferGeometry>
            </line>
        </>
    );
}

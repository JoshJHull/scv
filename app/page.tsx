"use client"

import Image from "next/image";
import * as motion from "motion/react-client";
import RaceImage from "../public/home/race.jpg";
import StatsImage from "../public/home/stats.jpg";
import styles from "./home.module.css";
import Link from "next/link";
import LeaveAnim from "@/components/ui/home/leave-anim";
import {useState} from "react";
import { useRouter } from 'next/navigation'
import {Canvas} from "@react-three/fiber";
import PointBackground from "@/components/point-background";
import {easeOut} from "motion";

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const anim = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 2.0,
            ease: easeOut,
        }
    }
}

export default function Home() {
    const [leaving, setLeaving] = useState(false);
    const router = useRouter();

    return (
            <>
                <div className={"grow bg-black"}>
                    <motion.div
                        className={"w-full h-full"}
                        initial={"initial"}
                        animate={"animate"}
                        variants={anim}
                    >
                        <Canvas camera={{ fov: 40, position: [10, 40, 30] }}>
                            <PointBackground />
                        </Canvas>
                    </motion.div>
                </div>

                <div
                    className={
                        "flex absolute w-full h-full justify-center text-white"
                    }
                >
                    {leaving ? <LeaveAnim/> :
                    <div className={"absolute overflow-hidden flex justify-center"}>
                        <p className={"text-4xl font-bold"}
                           style={{
                               transform: "translate3d(0,0.01px,0)",
                               willChange: "transform",
                           }}>
                            SC VIS
                        </p>
                    </div>
                }
                    <div className={"flex flex-col"}>
                        <div className={"flex flex-col max-w-[800] min-w-[800] pt-[200] space-y-20"}>
                            <Link href={"/race"}
                                  onNavigate={async (e) => {
                                      e.preventDefault();
                                      setLeaving(true);
                                      await sleep(800);
                                      router.push('/race')
                                  }}
                            >

                                <motion.div
                                    className={styles.border}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className={"flex bg-[#212529]"}>
                                        <div className={"w-1/2"}>
                                            <Image
                                                src={RaceImage}
                                                alt={"Picture of ships racing"}
                                            ></Image>
                                        </div>
                                        <div
                                            className={
                                                "flex-col space-y-6 w-1/2 pl-4 p-2"
                                            }
                                        >
                                            <p className={styles.underline}>
                                                Quantum Race
                                            </p>
                                            <p>
                                                Pit 2 ships against each-other in a head
                                                to head quantum travel race.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                            <Link href={"/compare"}>
                                <motion.div
                                    className={styles.border}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className={"flex bg-[#212529]"}>
                                        <div className={"w-1/2"}>
                                            <Image
                                                src={StatsImage}
                                                alt={"Picture of ships racing"}
                                            ></Image>
                                        </div>
                                        <div
                                            className={
                                                "flex-col space-y-6 w-1/2 pl-4 p-2"
                                            }
                                        >
                                            <p className={styles.underline}>
                                                Stat Visualiser
                                            </p>
                                            <p>
                                                Visualise ship stats and how they compare to other ships.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </div>
                    </div>

                </div>
            </>
    );
}

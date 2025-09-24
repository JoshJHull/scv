import Image from "next/image";
import * as motion from "motion/react-client";
import RaceImage from "../public/home/race.jpg";
import StatsImage from "../public/home/stats.jpg";
import styles from "./home.module.css";
import Link from "next/link";
import HomeScene from "@/components/home-scene";

export default function Home() {
    return (
        <>
            <div className={"grow bg-black"}>
                <HomeScene/>
            </div>

            <div
                className={
                    "flex absolute w-full justify-center text-white"
                }
            >
                <div className={"flex flex-col"}>
                    <div className={"flex flex-col max-w-[800] min-w-[800] pt-[200] space-y-20"}>
                        <Link href={"/race"}>
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

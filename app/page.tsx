import Image from "next/image";
import * as motion from "motion/react-client";
import RaceImage from "../public/home/race.jpg";
import styles from "./home.module.css";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div
                className={
                    "flex w-full justify-center text-white bg-gradient-to-t from-[#171738] to-black"
                }
            >
                <div className={"flex-col max-w-[800] min-w-[800] pt-[100]"}>
                    <Link href={"/race"}>
                        <motion.div
                            className={styles.border}
                            whileHover={{ scale: 1.03 }}
                        >
                            <div className={"flex bg-[#171738]"}>
                                <div className={"w-1/2"}>
                                    <Image
                                        src={RaceImage}
                                        alt={"Picture of ships racing"}
                                    ></Image>
                                </div>
                                <div
                                    className={
                                        "flex-col space-y-4 w-1/2 pl-4 p-2"
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
                </div>
            </div>
        </>
    );
}

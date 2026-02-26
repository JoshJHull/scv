import { AnimatePresence, motion } from "motion/react";

export default function ShipCard({racePanel, children}: {racePanel: boolean, children: React.ReactNode}) {
    return (
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
                        {children}
                    </motion.div>
                    : <motion.div className={"flex flex-col space-y-2"}
                                  key={`${racePanel}`}
                                  initial={{opacity: 0, x: -20}}
                                  animate={{opacity: 1, x: 0}}
                                  exit={{opacity: 0, x: 20}}
                                  transition={{duration: 0.2}}
                    >
                        {children}
                    </motion.div>}
            </AnimatePresence>
        </div>
    )
}
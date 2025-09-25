import * as motion from "motion/react-client";

const blackBox = {
    initial: {
        height: 0,
        bottom: 0,
    },
    animate: {
        height: "100%",
        transition: {
            duration: 0.6,
            ease: [0.87, 0, 0.13, 1],
            when: "afterChildren",
        },
    },
};

const textContainer = {
    initial: {
        lineHeight: 1,
        height: "auto",
        y: 0,
    },
    animate: {
        height: "100%",
        y: "50%",
        transition: {
            duration: 0.7,
            ease: [0.87, 0, 0.13, 1],
        },
    },
};

export default function LeaveAnim() {
    return(
        <div
            className={
                "absolute overflow-hidden inset-0 flex h-full justify-center"
            }
        >
            <motion.div
                className={"absolute z-50 w-full h-full bg-black"}
                initial={"initial"}
                animate={"animate"}
                variants={blackBox}
            ></motion.div>
            <motion.div
                className={"absolute z-50 flex justify-center"}
                initial={"initial"}
                animate={"animate"}
                variants={textContainer}
            >
                <motion.p
                    className={"text-4xl font-bold text-white"}
                    style={{
                        transform: "translate3d(0,0.01px,0)",
                        willChange: "transform",
                    }}
                >
                    SC VIS
                </motion.p>
            </motion.div>
        </div>
    )
}
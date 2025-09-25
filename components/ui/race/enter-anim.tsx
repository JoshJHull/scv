import { motion } from "motion/react";

const blackBox = {
    initial: {
        height: "100%",
        bottom: 0,
    },
    animate: {
        height: 0,
        transition: {
            delay: 0.5,
            duration: 0.6,
            ease: [0.87, 0, 0.13, 1],
            when: "afterChildren",
        },
    },
};

const textContainer = {
    initial: {
        height: "100%",
        opacity: 1,
        y: "50%"
    },
    animate: {
        height: "auto",
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.5,
            duration: 0.7,
            ease: [0.87, 0, 0.13, 1],
        },
    },
};

const text = {
    initial: {

    },
    animate: {
        transition: {
            duration: 1.0,
            ease: [0.87, 0, 0.13, 1],
        },
    },
};

const Transition = () => {
    return (
        <div
            className={
                "absolute overflow-hidden inset-0 flex justify-center"
            }
        >
            <motion.div
                className={"absolute z-50 w-full h-full bg-black"}
                initial={"initial"}
                animate={"animate"}
                variants={blackBox}
            ></motion.div>
            <motion.div
                className={"absolute z-50 flex h-full justify-center"}
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
    );
};

export default function EnterAnim() {
    return <Transition />;
}

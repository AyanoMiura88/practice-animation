import { useState } from "react";
import { useSpring, animated, useTransition, useChain, config, useSpringRef } from "react-spring";
import SpringData from "../animeData/SpringData";
import styles from "./ReactSpring.module.css";

const ReactSpring = () => {
  const [open, set] = useState(false);
  const textStyle = useSpring({
    loop: true,
    to: [
      { opacity: 1, color: "#ffaaee" },
      { opacity: 0, color: "rgb(14,26,19)" },
    ],
    from: { opacity: 0, color: "red" },
  });

  const springApi = useSpringRef();
  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: "20%", background: "hotpink" },
    to: {
      size: open ? "100%" : "20%",
      background: open ? "white" : "hotpink",
    },
  });

  const transApi = useSpringRef();
  const transition = useTransition(open ? SpringData : [], {
    ref: transApi,
    trail: 400 / SpringData.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springApi, transApi] : [transApi, springApi], [0, open ? 0.1 : 0.6]);
  return (
    <>
      <div>ReactSpring</div>
      <animated.div style={textStyle}>I will fade in and out</animated.div>
      <div>サンプルと同じにならない、、、</div>
      <animated.div
        style={{ ...rest, width: size, height: size }}
        className={styles.container}
        onClick={() => set((open) => !open)}
      >
        {transition((style, item) => (
          <animated.div className={styles.item} style={{ ...style, background: item.css }} />
        ))}
      </animated.div>
    </>
  );
};

export default ReactSpring;

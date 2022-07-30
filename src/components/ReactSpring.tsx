import { useState } from "react";
import { useSpring, animated, useTransition, useChain, config, useSpringRef } from "react-spring";
import SpringData from "../animeData/SpringData";
import springStyles from "./ReactSpring.module.css";
import useMeasure from "react-use-measure";

const ReactSpring = () => {
  // text--------------------------------------------
  const textStyle = useSpring({
    loop: true,
    to: [
      { opacity: 1, color: "#ffaaee" },
      { opacity: 0, color: "rgb(14,26,19)" },
    ],
    from: { opacity: 0, color: "red" },
  });
  // open by touch----------------------------------------------
  const [open, set] = useState(false);
  const springApi = useSpringRef();
  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: "20%", background: "hotpink" },
    to: {
      size: open ? "80%" : "20%",
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

  // meter of toggle---------------------------------------
  const [openToggle, setToggle] = useState(false);
  const [ref, { width }] = useMeasure();
  const props = useSpring({ width: openToggle ? width : 0 });

  return (
    <>
      <h1>ReactSpring</h1>
      <div>text</div>
      <animated.div style={textStyle}>I will fade in and out</animated.div>
      <div>open by touch サンプルと同じにならない、、、</div>
      <div className={springStyles.wrapper}>
        <animated.div
          style={{ ...rest, width: size, height: size }}
          className={springStyles.container}
          onClick={() => set((open) => !open)}
        >
          {transition((style, item) => (
            <animated.div
              className={springStyles.item}
              style={{ ...style, background: item.css }}
            />
          ))}
        </animated.div>
      </div>
      <div>meter of toggle</div>
      <div className={springStyles.container2}>
        <div ref={ref} className={springStyles.main2} onClick={() => setToggle(!openToggle)}>
          <animated.div className={springStyles.fill2} style={props} />
          <animated.div className={springStyles.content2}>
            {props.width.to((x: number) => x.toFixed(0))}
          </animated.div>
        </div>
      </div>
    </>
  );
};

export default ReactSpring;

import { useState, useEffect, useCallback, CSSProperties } from "react";
import {
  useSpring,
  animated,
  useTransition,
  useChain,
  config,
  useSpringRef,
  AnimatedProps,
} from "react-spring";
import SpringData from "../animeData/SpringData";
import springStyles from "./ReactSpring.module.css";
import useMeasure from "react-use-measure";

import ReactSpringDnD from "./ReactSpring-DnD";

// wave text
const AnimFeTurbulence = animated("feTurbulence");
const AnimFeDisplacementMap = animated("feDisplacementMap");

// transition object
type DirectionType = "right" | "left";
const pages: ((props: AnimatedProps<{ transitionStyle: CSSProperties }>) => React.ReactElement)[] =
  [
    ({ transitionStyle: style }) => (
      <animated.div style={{ ...style, background: "lightpink" }}>A</animated.div>
    ),
    ({ transitionStyle: style }) => (
      <animated.div style={{ ...style, background: "lightblue" }}>B</animated.div>
    ),
    ({ transitionStyle: style }) => (
      <animated.div style={{ ...style, background: "lightgreen" }}>C</animated.div>
    ),
    ({ transitionStyle: style }) => (
      <animated.div style={{ ...style, background: "lightyellow" }}>D</animated.div>
    ),
  ];
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

  // wave text---------------------------------------------
  const [waveOpen, setWaveToggle] = useState(false);
  const [{ freq, factor, scale, opacity }] = useSpring(() => ({
    reverse: waveOpen,
    from: { factor: 10, opacity: 0, scale: 0.9, freq: "0.0175, 0.0" },
    to: { factor: 150, opacity: 1, scale: 1, freq: "0.0, 0.0" },
    config: { duration: 3000 },
  }));

  // transition object------------------------------------- ＋逆回転
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<DirectionType>("right");
  const transitionOnClick = useCallback((type: DirectionType) => {
    setDirection(type);
    setIndex((state) => (type === "right" ? (state + 1) % 4 : !state ? (state = 3) : state - 1));
  }, []);
  const transRef = useSpringRef();
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: {
      opacity: 0,
      transform: direction === "right" ? "translate3d(100%,0,0)" : "translate3d(-50%,0,0)",
    },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: {
      opacity: 0,
      transform: direction === "right" ? "translate3d(-50%,0,0)" : "translate3d(100%,0,0)",
    },
  });
  useEffect(() => {
    transRef.start();
  }, [index]);

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
      <div>wave text</div>
      <div className={springStyles.container3} onClick={() => setWaveToggle(!waveOpen)}>
        <animated.svg
          className={springStyles.svg3}
          style={{ scale, opacity }}
          viewBox="0 0 1278 446"
        >
          <defs>
            <filter id="water">
              <AnimFeTurbulence
                type="fractalNoise"
                baseFrequency={freq}
                numOctaves="2"
                result="TURB"
                seed="8"
              />
              <AnimFeDisplacementMap
                xChannelSelector="R"
                yChannelSelector="G"
                in="SourceGraphic"
                in2="TURB"
                result="DISP"
                scale={factor}
              />
            </filter>
          </defs>
          <g filter="url(#water)">
            <animated.path
              d="M179.53551,113.735463 C239.115435,113.735463 292.796357,157.388081 292.796357,245.873118 L292.796357,415.764388 L198.412318,415.764388 L198.412318,255.311521 C198.412318,208.119502 171.866807,198.681098 151.220299,198.681098 C131.753591,198.681098 94.5898754,211.658904 94.5898754,264.749925 L94.5898754,415.764388 L0.205836552,415.764388 L0.205836552,0.474616471 L94.5898754,0.474616471 L94.5898754,151.489079 C114.646484,127.893069 145.321296,113.735463 179.53551,113.735463 Z M627.269795,269.469127 C627.269795,275.95803 626.679895,285.396434 626.089994,293.065137 L424.344111,293.065137 C432.012815,320.790448 457.378525,340.257156 496.901841,340.257156 C520.497851,340.257156 554.712065,333.768254 582.437376,322.560149 L608.392987,397.47748 C608.392987,397.47748 567.09997,425.202792 494.54224,425.202792 C376.562192,425.202792 325.240871,354.414762 325.240871,269.469127 C325.240871,183.343692 377.152092,113.735463 480.974535,113.735463 C574.178773,113.735463 627.269795,171.545687 627.269795,269.469127 Z M424.344111,236.434714 L528.166554,236.434714 C528.166554,216.378105 511.649347,189.242694 476.255333,189.242694 C446.17042,189.242694 424.344111,216.378105 424.344111,236.434714 Z M659.714308,0.474616471 L754.098347,0.474616471 L754.098347,415.764388 L659.714308,415.764388 L659.714308,0.474616471 Z M810.13887,0.474616471 L904.522909,0.474616471 L904.522909,415.764388 L810.13887,415.764388 L810.13887,0.474616471 Z M1097.42029,113.735463 C1191.80433,113.735463 1257.87315,183.343692 1257.87315,269.469127 C1257.87315,355.594563 1192.98413,425.202792 1097.42029,425.202792 C997.727148,425.202792 936.967423,355.594563 936.967423,269.469127 C936.967423,183.343692 996.547347,113.735463 1097.42029,113.735463 Z M1097.42029,340.257156 C1133.9941,340.257156 1163.48912,308.402543 1163.48912,269.469127 C1163.48912,230.535711 1133.9941,198.681098 1097.42029,198.681098 C1060.84647,198.681098 1031.35146,230.535711 1031.35146,269.469127 C1031.35146,308.402543 1060.84647,340.257156 1097.42029,340.257156 Z"
              fill="lightblue"
            />
          </g>
        </animated.svg>
      </div>
      <div>drag and drop</div>
      <div className={springStyles.container3}>
        <ReactSpringDnD items={"Lorem ipsum dolor sit".split(" ")} />
      </div>
      <div>transition object</div>
      <div className={`flex fill ${springStyles.container5}`}>
        <ul>
          <li className={springStyles.sideButton} onClick={() => transitionOnClick("right")}>
            right
          </li>
          <li className={springStyles.sideButton} onClick={() => transitionOnClick("left")}>
            left
          </li>
        </ul>
        {transitions((style, i) => {
          const Page = pages[i];
          return <Page transitionStyle={style} />;
        })}
      </div>
    </>
  );
};

export default ReactSpring;

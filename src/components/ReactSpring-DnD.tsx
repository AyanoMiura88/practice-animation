import { useRef } from "react";
import { useSprings, animated, config } from "react-spring";
import springStyles from "./ReactSpring.module.css";
import { useDrag } from "@use-gesture/react";
import clamp from "lodash.clamp";
import swap from "lodash-move";

// drag And Drop------------------------------------------
const ReactSpringDnD = ({ items }: { items: string[] }) => {
  const fn =
    (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
    (index: number) =>
      active && index === originalIndex
        ? {
            y: curIndex * 100 + y,
            scale: 1.1,
            zIndex: 1,
            shadow: 15,
            immediate: (key: string) => key === "zIndex",
            config: (key: string) => (key === "y" ? config.stiff : config.default),
          }
        : {
            y: order.indexOf(index) * 100,
            scale: 1,
            zIndex: 0,
            shadow: 1,
            immediate: false,
          };

  // インディケーションをローカルリファレンスとして保存
  const order = useRef(items.map((_, index) => index));
  // スプリングを作成し、それぞれがアイテムに対応し、その変形やスケールなどを制御
  const [springs, api] = useSprings(items.length, fn(order.current));
  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex);
    const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, items.length - 1);
    const newOrder = swap(order.current, curIndex, curRow);
    // 新しいスタイルデータをスプリングに供給すると、レンダリングを一度も行わずにビューをアニメーション化
    api.start(fn(newOrder, active, originalIndex, curIndex, y));
    if (!active) order.current = newOrder;
  });
  // };

  return (
    <div className={springStyles.content4} style={{ height: items.length * 100 }}>
      {springs.map(({ zIndex, shadow, y, scale }, i) => (
        <animated.div
          {...bind(i)}
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.to((s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            y,
            scale,
          }}
          children={items[i]}
        />
      ))}
    </div>
  );
};

export default ReactSpringDnD;

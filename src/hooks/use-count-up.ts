import { useState, useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export const useCountUp = (target: number) => {
  const [current, setCurrent] = useState(0);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    motionValue.set(target);
  }, [target, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setCurrent(Math.round(latest));
    });

    return () => unsubscribe();
  }, [springValue]);

  return current;
};

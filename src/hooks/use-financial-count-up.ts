import { useState, useEffect, useRef } from "react";

export const useFinancialCountUp = (target: number, duration = 1000, decimals = 2) => {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationRef = useRef<number>(0);
  const previousTarget = useRef<number>(target);

  useEffect(() => {
    // Reset animation if target changes significantly
    if (Math.abs(target - previousTarget.current) > 0.01) {
      previousTarget.current = target;
      startTime.current = null;
      setCurrent(0);
    }

    const animate = (timestamp: number) => {
      if (!startTime.current) {
        startTime.current = timestamp;
      }

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = easedProgress * target;

      setCurrent(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [target, duration]);

  // Format the number with proper financial formatting
  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(current);

  return {
    value: current,
    formattedValue,
    isAnimating: current !== target
  };
};
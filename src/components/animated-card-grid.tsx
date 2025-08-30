import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardGridProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const AnimatedCardGrid: React.FC<AnimatedCardGridProps> = ({
  children,
  className,
  staggerDelay = 0.1
}) => {
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4", className)}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};
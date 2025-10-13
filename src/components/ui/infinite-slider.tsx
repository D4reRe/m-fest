"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useEffect } from "react";
import useMeasure from "react-use-measure";

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // If we are in scrolling mode, or the container has no size, do nothing.
    if (
      isScrolling ||
      (direction === "horizontal" && !width) ||
      (direction === "vertical" && !height)
    ) {
      return;
    }

    const size = direction === "horizontal" ? width : height;
    // The distance to travel is the size of one set of children plus the gap.
    const distanceToTravel = size + gap;

    // The animation moves from 0 to the negative distance.
    const from = reverse ? -distanceToTravel : 0;
    const to = reverse ? 0 : -distanceToTravel;

    // Duration is calculated based on distance and speed.
    const duration = distanceToTravel / speed;

    const controls = animate(translation, [from, to], {
      ease: "linear",
      duration: duration,
      repeat: Infinity,
    });

    // Cleanup function to stop the animation when dependencies change or component unmounts.
    return () => controls.stop();
  }, [isScrolling, width, height, gap, speed, direction, reverse, translation]);

  return (
    <div
      className={cn(
        "overflow-hidden",
        isScrolling &&
          (direction === "horizontal"
            ? "overflow-x-auto scrollbar-hide"
            : "overflow-y-auto"),
        className
      )}
      onMouseEnter={() => setIsScrolling(true)}
      onMouseLeave={() => setIsScrolling(false)}
    >
      <motion.div
        ref={ref}
        className={cn("flex", {
          "w-max": direction === "horizontal",
          "h-max": direction === "vertical",
        })}
        style={{
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
          ...(direction === "horizontal"
            ? { x: isScrolling ? 0 : translation }
            : { y: isScrolling ? 0 : translation }),
        }}
      >
        {/* Render the first set of children always */}
        {children}
        {/* Only duplicate the children when in animation mode for the seamless loop effect */}
        {!isScrolling && children}
      </motion.div>
    </div>
  );
}

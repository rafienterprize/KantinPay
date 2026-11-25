"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
  viewportOnce?: boolean;
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  hoverEffect = true,
  viewportOnce = true,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: viewportOnce, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        hoverEffect
          ? {
              y: -5,
              transition: { duration: 0.22, ease: "easeOut" },
            }
          : undefined
      }
      className={cn("transition-shadow duration-200", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedFadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
}

export function AnimatedFadeIn({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  ...props
}: AnimatedFadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 28 };
      case "down":
        return { opacity: 0, y: -28 };
      case "left":
        return { opacity: 0, x: 36 };
      case "right":
        return { opacity: 0, x: -36 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

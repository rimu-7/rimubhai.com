"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextWritingEffect({
  text,
  fontClassName,
  speed = 2,
  color = "currentColor",
  strokeWidth = 1.5,
  className,
  ...props
}) {
  const pathLength = 1000;

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden w-full h-auto",
        className
      )}
    >
      <motion.svg
        key={`${text}-${fontClassName}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 200"
        // Changed max-w-4xl to w-full so it shrinks to fit the tooltip trigger
        className="w-full h-full overflow-visible"
        {...props}
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn("text-7xl fill-transparent", fontClassName)}
          style={{ stroke: color }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          }}
          animate={{
            strokeDashoffset: 0,
          }}
          transition={{
            duration: speed,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>

        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn("text-7xl stroke-transparent", fontClassName)}
          style={{ fill: color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: speed * 0.6, 
          }}
        >
          {text}
        </motion.text>
      </motion.svg>
    </div>
  );
}
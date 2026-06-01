"use client";

import { siteConfig } from "@/config/site";
import { runIdle } from "@/lib/utils/runIdle";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedText() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    let interval;
    runIdle(() => {
      interval = setInterval(() => {
        setWordIndex((p) => (p + 1) % siteConfig.heroWords.length);
      }, 3000);
    });
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex w-full justify-center md:justify-start overflow-hidden h-[1.3em]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={wordIndex}
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.8 }}
          className="block whitespace-nowrap text-foreground"
        >
          {siteConfig.heroWords[wordIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

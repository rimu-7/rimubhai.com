"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import TextWriting from "./TextWritting";

export function NameToolTip() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX + 16);
      mouseY.set(e.clientY + 16);
    };

    if (isOpen) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isOpen, isMobile, mouseX, mouseY]);

  return (
    <HoverCard
      openDelay={100}
      closeDelay={200}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <HoverCardTrigger asChild>
        <span
          tabIndex={0}
          role="button"
          className="cursor-pointer font-bold decoration-dashed underline-offset-4 hover:underline focus:outline-none focus:text-primary touch-manipulation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <TextWriting />
        </span>
      </HoverCardTrigger>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              x: isMobile ? "-50%" : 0,
              y: isMobile ? "-50%" : 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: isMobile ? "-50%" : 0,
              y: isMobile ? "-50%" : 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              x: isMobile ? "-50%" : 0,
              y: isMobile ? "-50%" : 0,
            }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              zIndex: 50,
              pointerEvents: "none",
              ...(isMobile
                ? { top: "50%", left: "50%" }
                : { top: 0, left: 0, x: springX, y: springY }),
            }}
            className={cn(
              "rounded-lg border-2 border-dashed border-foreground/40 bg-background p-3.5 shadow-xl outline-none",
              "w-72 sm:w-80 max-w-[90vw]",
            )}
          >
            <div className="flex flex-col gap-3">
              <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded bg-muted">
                <Image
                  src="https://res.cloudinary.com/dykqlkb3k/image/upload/v1773728820/me_ebhwqk.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 320px"
                />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold underline underline-offset-2">
                  mutasim fuad rimu
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A passionate full-stack developer with expertise in Next.js,
                  now i&apos;m doing my{" "}
                  <span className="font-semibold text-foreground">
                    masters in computer science & application technology at
                    Changchun University of Science and Technology, China.
                  </span>{" "}
                  doing research on physical-layer secret key generation with
                  Deep-learning in the field of cyber-security.
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Always eager to learn and contribute to innovative projects.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </HoverCard>
  );
}

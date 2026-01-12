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

  const springConfig = { damping: 25, stiffness: 300 };
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
      mouseX.set(e.clientX + 20);
      mouseY.set(e.clientY + 20);
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
      className="border-3 border-foreground"
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
              scale: 0.9,
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
              scale: 0.9,
              x: isMobile ? "-50%" : 0,
              y: isMobile ? "-50%" : 0,
            }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              zIndex: 50,
              pointerEvents: "none",
              ...(isMobile
                ? { top: "50%", left: "50%" }
                : { top: 0, left: 0, x: springX, y: springY }),
            }}
            className={cn(
              "rounded border-2 border-dashed border-foreground bg-white p-4 shadow-xl outline-none  dark:bg-black",
              "w-80 max-w-[120vw]"
            )}
          >
            <div className="flex flex-col gap-4">
              <div className="relative h-60 w-full overflow-hidden rounded bg-neutral-100">
                <Image
                  src="https://res.cloudinary.com/di1josexb/image/upload/v1766003422/rimu_u8mr0q.jpg"
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold underline">
                  mutasim fuad rimu
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A passionate full-stack developer with expertise in Next.js,
                  now, i&apos;m doing my{" "}
                  <span className="font-bold text-foreground">
                    masters in computer science & application technology at
                    Changchun University of Science and Technology, China.
                  </span>{" "}
                  doing research on physical-layer secret key generation with
                  Deep-learning in the field of cyber-security.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
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

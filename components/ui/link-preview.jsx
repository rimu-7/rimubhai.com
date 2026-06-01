"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { clsx } from "clsx";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const LinkPreview = ({ children, url, img_url, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Advanced Parallax Physics (X and Y axis)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Tuned for a highly premium, lightweight, and snappy feel
  const springConfig = { stiffness: 350, damping: 25, mass: 0.5 };
  const translateX = useSpring(x, springConfig);
  const translateY = useSpring(y, springConfig);

  const handleMouseMove = (event) => {
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const eventOffsetY = event.clientY - targetRect.top;

    // Divide by 5 for a subtle, high-end float effect
    x.set((eventOffsetX - targetRect.width / 2) / 5);
    y.set((eventOffsetY - targetRect.height / 2) / 5);
  };

  const handleMouseLeave = () => {
    // Smoothly snap back to absolute center when the mouse leaves
    x.set(0);
    y.set(0);
  };

  return (
    <HoverCardPrimitive.Root
      openDelay={100}
      closeDelay={150}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setTimeout(() => setIsLoading(true), 300);
        }
      }}
    >
      <HoverCardPrimitive.Trigger asChild>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative inline-block text-blue-600 font-medium transition-colors hover:text-blue-800 underline underline-offset-4 decoration-blue-600/30 hover:decoration-blue-800",
            className
          )}
        >
          {children}
        </Link>
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Content
        className="[transform-origin:var(--radix-hover-card-content-transform-origin)] z-50"
        side="top"
        align="center"
        sideOffset={16}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.95,
                filter: "blur(2px)",
                transition: { duration: 0.15, ease: "easeIn" },
              }}
              style={{ x: translateX, y: translateY }}
              // Pure Glassmorphism Container
              className="relative w-[420px] h-[240px] rounded-2xl p-2.5 bg-white/5 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.15)] border border-white/20 dark:bg-black/10 dark:border-white/10"
            >
              {/* Inner Image Area - Rounded to fit nicely inside the glass frame */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted/20">
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute inset-0 flex flex-col items-center justify-center z-10"
                    >
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/60 mb-2" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  key="image-container"
                  // Start slightly scaled up for a beautiful "settling" effect
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 1.1 : 1 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={img_url}
                    alt={`Preview of ${url}`}
                    fill
                    unoptimized // Relying on Cloudinary's native optimization
                    onLoad={() => setIsLoading(false)}
                    className="object-cover object-top block"
                    sizes="(max-width: 768px) 100vw, 420px"
                    priority={true}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};

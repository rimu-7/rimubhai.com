"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { clsx } from "clsx";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const LinkPreview = ({ children, url, img_url, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef(null);
  const hasLoadedRef = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 350, damping: 25, mass: 0.5 };
  const translateX = useSpring(x, springConfig);
  const translateY = useSpring(y, springConfig);

  const handleMouseMove = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) / 5);
    y.set((event.clientY - rect.top - rect.height / 2) / 5);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleOpenChange = useCallback((open) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsOpen(open);

    if (open) {
      if (!hasLoadedRef.current) {
        setIsLoading(true);
      }
    } else {
      timeoutRef.current = setTimeout(() => {
        hasLoadedRef.current = false;
        setIsLoading(true);
        timeoutRef.current = null;
      }, 400);
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    hasLoadedRef.current = true;
  }, []);

  return (
    <HoverCardPrimitive.Root
      openDelay={100}
      closeDelay={150}
      onOpenChange={handleOpenChange}
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
            style={{ x: translateX, y: translateY }}
            className="relative w-[420px] h-[240px] rounded-2xl p-2.5 bg-white/5 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.15)] border border-white/20 dark:bg-black/10 dark:border-white/10"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted/20">
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center z-10 bg-muted/20 transition-opacity duration-200",
                  isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/60" />
              </div>

              <div
                className={cn(
                  "w-full h-full relative transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
              >
                <Image
                  src={img_url}
                  alt={`Preview of ${url}`}
                  fill
                  unoptimized
                  onLoad={handleImageLoad}
                  className="object-cover object-top block"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
            </div>
          </motion.div>
        )}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};

"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1];

export function ProfileImage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative shrink-0 group">
      <motion.div
        aria-hidden
        className="absolute inset-0 -m-5 rounded-full border border-dashed border-foreground/10"
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 -m-2.5 rounded-full border border-dashed border-destructive/30"
        animate={prefersReducedMotion ? {} : { rotate: -360 }}
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
      />
      <motion.div
        initial={prefersReducedMotion ? undefined : { scale: 0.92, opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="relative h-36 w-36 sm:h-44 sm:w-44 md:h-52 md:w-52 rounded-full overflow-hidden z-10"
      >
        <Image
          src="https://res.cloudinary.com/di1josexb/image/upload/v1766912946/1766912597417_2_svqcrf.jpg"
          alt="Mutasim Fuad Rimu (Rimu Bhai) Profile"
          fill
          priority
          fetchPriority="high"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          sizes="(max-width: 640px) 144px, (max-width: 768px) 176px, 208px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </motion.div>
    </div>
  );
}

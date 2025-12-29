"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { ExternalLink, Clock } from "lucide-react";

// --- Sub-Component: TimeStatus ---
function TimeStatus() {
  const [mounted, setMounted] = useState(false);
  const [timeInfo, setTimeInfo] = useState({
    beijingTime: "--:--",
    diffLabel: "",
    ampm: "",
  });

  // Helper: Calculate approx hour difference
  const getOffsetDiffHours = (userTz, targetTz) => {
    try {
      const now = new Date();
      const userDate = new Date(now.toLocaleString("en-US", { timeZone: userTz }));
      const targetDate = new Date(now.toLocaleString("en-US", { timeZone: targetTz }));
      const diffMs = targetDate.getTime() - userDate.getTime();
      return Math.round(diffMs / (1000 * 60 * 60));
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    setMounted(true);
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const beijingTz = "Asia/Shanghai"; // Target Timezone

    const updateTime = () => {
      const now = new Date();
      // Format: "10:30 PM"
      const timeString = new Intl.DateTimeFormat("en-US", {
        timeZone: beijingTz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(now);

      const [time, period] = timeString.split(" ");
      const diff = getOffsetDiffHours(userTz, beijingTz);
      
      let label = "Same time zone";
      if (diff > 0) label = `${diff}h ahead`;
      if (diff < 0) label = `${Math.abs(diff)}h behind`;

      setTimeInfo({ beijingTime: time, ampm: period, diffLabel: label });
    };

    updateTime();
    const timer = setInterval(updateTime, 30000); // Update every 30s
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="h-6 w-32 animate-pulse rounded bg-muted/20" />;

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
      {/* Time Pill */}
      <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-sm backdrop-blur-sm">
        <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
        <div className="flex items-baseline gap-1">
          <span className="font-mono font-semibold text-foreground tabular-nums">
            {timeInfo.beijingTime}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            {timeInfo.ampm}
          </span>
        </div>
        <div className="h-3 w-[1px] bg-border" />
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
          CN
        </span>
      </div>
      {/* Difference Label */}
      <span className="text-[11px] font-medium text-muted-foreground/80 sm:text-xs">
        {timeInfo.diffLabel}
      </span>
    </div>
  );
}

// --- Sub-Component: MessageDialog Placeholder ---
// Replace this with your actual Dialog/Modal component
const MessageDialog = ({ children }) => (
  <>{children}</>
);

// --- Main Component: HeroSection ---
export default function HeroSection() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12"
    >
      <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-sm p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 md:gap-16 transition-colors hover:border-primary/10">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px] transition-all group-hover:bg-primary/10" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[200px] w-[200px] rounded-full bg-blue-500/5 blur-[80px]" />

        {/* --- LEFT: Avatar --- */}
        <motion.div variants={itemVariants} className="relative z-10 flex-shrink-0">
          <div className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64">
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 -m-6 rounded-full border border-dashed border-foreground/20"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
            />
            {/* Inner Ring */}
            <motion.div
              className="absolute inset-0 -m-3 rounded-full border border-dashed border-primary/40"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
            />
            {/* Image Wrapper */}
            <div className="relative h-full w-full rounded-full overflow-hidden border-4 border-background shadow-2xl">
              <Image
                src="https://res.cloudinary.com/di1josexb/image/upload/v1766912946/1766912597417_2_svqcrf.jpg"
                alt="Profile"
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 192px, 256px"
              />
            </div>
          </div>
        </motion.div>

        {/* --- RIGHT: Content --- */}
        <div className="flex flex-col gap-6 text-center md:text-left w-full z-10">
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              <span className="text-primary">I build</span>{" "}
              {/* min-h to prevent layout shift on deletion */}
              <span className="block md:inline-block min-h-[1.2em]">
                <Typewriter
                  words={[
                    "fast web apps.",
                    "clean dashboards.",
                    "secure admin panels.",
                    "beautiful UI systems.",
                  ]}
                  loop
                  cursor
                  cursorStyle="_"
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </span>
            </h1>
          </motion.div>

          {/* Time Status */}
          <motion.div variants={itemVariants} className="flex justify-center md:justify-start">
            <TimeStatus />
          </motion.div>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2"
          >
            <MessageDialog>
              <button className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-lg bg-primary px-8 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/20 hover:ring-offset-2">
                <span className="mr-2">Let&apos;s Talk</span>
                <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </MessageDialog>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
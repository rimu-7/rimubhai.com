"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { NameToolTip } from "./NameToolTip";
import { MessageDialog } from "./Message.Dialog";

import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Check,
  Copy,
  Clock,
  ExternalLink,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

/** ---------- utils ---------- */
function safeCopy(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function getOffsetDiffHours(fromTz, toTz) {
  const now = new Date();
  const from = new Date(now.toLocaleString("en-US", { timeZone: fromTz }));
  const to = new Date(now.toLocaleString("en-US", { timeZone: toTz }));
  return Math.round((to - from) / (1000 * 60 * 60));
}

/** ---------- Time Display ---------- */
function TimeStatus() {
  const [timeInfo, setTimeInfo] = useState({
    beijingTime: "--:--",
    diffLabel: "calculating...",
  });

  useEffect(() => {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const beijingTz = "Asia/Shanghai";

    const updateTime = () => {
      const now = new Date();

      const beijingString = new Intl.DateTimeFormat("en-US", {
        timeZone: beijingTz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(now);

      const diff = getOffsetDiffHours(userTz, beijingTz);
      let label = "";
      if (diff === 0) label = "Same time zone";
      else if (diff > 0) label = `Beijing is ${diff}h ahead`;
      else label = `Beijing is ${Math.abs(diff)}h behind`;

      setTimeInfo({ beijingTime: beijingString, diffLabel: label });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-muted-foreground">
      <div className="inline-flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">
          {timeInfo.beijingTime}
        </span>
        <span className="text-[10px] uppercase tracking-wider opacity-70">
          CN
        </span>
        <span className="hidden sm:inline opacity-70">
          • {timeInfo.diffLabel}
        </span>
      </div>
      <span className="sm:hidden text-[11px] opacity-70">
        {timeInfo.diffLabel}
      </span>
    </div>
  );
}

/** ---------- main ---------- */
export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [copiedText, setCopiedText] = useState(null);

  const CONTACT = useMemo(
    () => ({
      email: "rimu_mutasim@yahoo.com",
      phone: "+86 199 1724 7217",
      phoneRaw: "+8619917247217",
      location: "Changchun, Jilin, China",
    }),
    []
  );

  const handleCopy = async (text, label) => {
    try {
      await safeCopy(text);
      setCopiedText(label);
      toast.success(`${label} copied`, { description: text });
      setTimeout(() => setCopiedText(null), 1500);
    } catch {
      toast.error("Copy failed", {
        description: "Your browser blocked clipboard access.",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 14, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };
  const words = [
    "fast web apps.",
    "clean dashboards.",
    "secure admin panels.",
    "beautiful UI systems.",
  ];

  const [index, setIndex] = useState(0);

  // Cycle through words every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className="relative py-10">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8 sm:gap-10"
        >
          {/* Name / Tooltip */}
          <motion.div variants={itemVariants} className="min-h-16 sm:min-h-20">
            <NameToolTip />
          </motion.div>

          {/* Hero Row */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-10 md:gap-16">
              {/* LEFT: Avatar Section */}
              {/* On mobile, this stays on top. On desktop, it stays left. 
            If you want text left/avatar right, swap the order of these two main divs. */}
              <div className="relative flex-shrink-0 group">
                {/* Ring 1 (Outer) */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 -m-6 rounded-full border border-dashed border-foreground/20 z-0"
                  animate={prefersReducedMotion ? {} : { rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 45,
                    ease: "linear",
                  }}
                />

                {/* Ring 2 (Inner) */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 -m-3 rounded-full border border-dashed border-destructive/50 z-0"
                  animate={prefersReducedMotion ? {} : { rotate: -360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 30,
                    ease: "linear",
                  }}
                />

                {/* Avatar Image */}
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? undefined
                      : { scale: 0.9, opacity: 0 }
                  }
                  animate={
                    prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative h-48 w-48 sm:h-56 sm:w-56 rounded-full overflow-hidden border-4 border-background shadow-xl z-10"
                >
                  <Image
                    src="https://res.cloudinary.com/di1josexb/image/upload/v1766912946/1766912597417_2_svqcrf.jpg"
                    alt="Profile"
                    fill
                    priority
                    sizes="(max-width: 640px) 192px, 224px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </motion.div>
              </div>

              {/* RIGHT: Content Section */}
              <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left gap-5 pt-2 md:pt-8">
                {/* Animated Heading */}
                <motion.h1
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-center md:items-start gap-2 text-3xl font-bold tracking-tight text-foreground"
                >
                  <span className="text-primary whitespace-nowrap">
                    I build
                  </span>

                  <div className="relative flex w-full justify-center md:justify-start overflow-hidden h-[1.2em]">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={index}
                        initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
                        animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                        exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 20,
                        }}
                        className="block whitespace-nowrap text-foreground"
                      >
                        {words[index]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </motion.h1>

                {/* Time Status */}
                <motion.div variants={itemVariants} className="opacity-90">
                  <TimeStatus />
                </motion.div>

                {/* CTA Button */}
                <motion.div variants={itemVariants} className="pt-2">
                  <MessageDialog>
                    <button className="group relative inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300">
                      <span>Let&apos;s Talk</span>
                      <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />

                      {/* Underline effect */}
                      <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </MessageDialog>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Bottom: Contact + Socials */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2"
          >
            {/* Contact */}
            <div className="md:col-span-7">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary">
                  Contact
                </h4>
                <span className="text-[11px] font-mono text-muted-foreground">
                  click to copy
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <ContactRow
                  icon={Mail}
                  label="Email"
                  value={CONTACT.email}
                  onClick={() => handleCopy(CONTACT.email, "Email")}
                  isCopied={copiedText === "Email"}
                />
                <ContactRow
                  icon={Phone}
                  label="Phone"
                  value={CONTACT.phone}
                  onClick={() => handleCopy(CONTACT.phoneRaw, "Phone")}
                  isCopied={copiedText === "Phone"}
                />

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      Location
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {CONTACT.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="md:col-span-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary">
                Socials
              </h4>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SocialLink
                  icon={Twitter}
                  label="X / Twitter"
                  href="https://x.com/"
                />
                <SocialLink
                  icon={Github}
                  label="GitHub"
                  href="https://github.com/"
                />
                <SocialLink
                  icon={Linkedin}
                  label="LinkedIn"
                  href="https://linkedin.com/"
                />
              </div>

              <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
                Want something built fast and clean? Ping me.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/** ---------- Helper Components ---------- */
function ContactRow({ icon: Icon, label, value, onClick, isCopied }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 text-left"
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
    >
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-medium text-foreground truncate group-hover:underline underline-offset-4">
          {value}
        </div>
      </div>

      <div className="flex items-center pt-4">
        {isCopied ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
            <Check className="h-4 w-4" />
            Copied
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">
            <Copy className="h-4 w-4" />
            Copy
          </span>
        )}
      </div>
    </button>
  );
}

function SocialLink({ icon: Icon, href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
      aria-label={label}
      title={label}
    >
      <span className="inline-flex items-center justify-center">
        <Icon className="h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity" />
      </span>
      <span className="group-hover:underline underline-offset-4">{label}</span>
    </a>
  );
}

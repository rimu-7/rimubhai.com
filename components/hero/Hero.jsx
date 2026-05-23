"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { toast } from "next-toast";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HoverUnderline } from "../HoverUnderline";
import { MessageDialog } from "./Message.Dialog";
import { NameToolTip } from "./NameToolTip";
import { runIdle } from "@/lib/utils/runIdle";

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

function TimeStatus() {
  const [timeInfo, setTimeInfo] = useState({ beijingTime: "--:--", diffLabel: "" });

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
      if (diff === 0) label = "same time zone";
      else if (diff > 0) label = `${diff}h ahead`;
      else label = `${Math.abs(diff)}h behind`;
      setTimeInfo({ beijingTime: beijingString, diffLabel: label });
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-3.5 w-3.5 text-primary" />
      <span className="font-medium text-foreground tabular-nums">{timeInfo.beijingTime}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">CN</span>
      <span className="text-muted-foreground/40">&middot;</span>
      <span className="text-muted-foreground/60">{timeInfo.diffLabel}</span>
    </div>
  );
}

const WORDS = [
  "fast web apps.",
  "clean dashboards.",
  "secure admin panels.",
  "beautiful UI systems.",
];
const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [copiedText, setCopiedText] = useState(null);
  const [wordIndex, setWordIndex] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const CONTACT = useMemo(
    () => ({
      email: "rimu_mutasim@yahoo.com",
      phone: "+86 199 1724 7217",
      phoneRaw: "+8619917247217",
      location: "Changchun, Jilin, China",
    }),
    []
  );

  const handleCopy = useCallback(async (text, label) => {
    try {
      await safeCopy(text);
      setCopiedText(label);
      toast.success(`${label} copied`, { description: text });
      setTimeout(() => setCopiedText(null), 1500);
    } catch {
      toast.error("Copy failed");
    }
  }, []);

  useEffect(() => {
    let interval;
    runIdle(() => {
      interval = setInterval(() => setWordIndex((p) => (p + 1) % WORDS.length), 3000);
    });
    return () => clearInterval(interval);
  }, []);

  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN || "";
  const twitter = process.env.NEXT_PUBLIC_X || "";
  const GITHUB = process.env.GITHUB || "";

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const fade = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease } },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
    >
      <h1 className="sr-only">Mutasim Fuad Rimu (Rimu Bhai) - Full Stack Developer</h1>
      <motion.div variants={fade}>
        <NameToolTip />
      </motion.div>

      <motion.div variants={fade} className="">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-14">
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

          <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left gap-4 md:pt-4">
            <h2 className="flex flex-col sm:flex-row items-center md:items-start gap-1.5 sm:gap-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              <span className="text-primary whitespace-nowrap">I build</span>
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
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h2>

            <TimeStatus />

            <div className="pt-1">
              <MessageDialog>
                <button className="group relative inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300">
                  <HoverUnderline>
                    <span>Let&apos;s Talk</span>
                  </HoverUnderline>
                  <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </MessageDialog>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 md:mt-12">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Contact
            </h4>
            <span className="text-[10px] font-mono text-muted-foreground/40">click to copy</span>
          </div>
          <div className="flex flex-col gap-3">
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
              <MapPin className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </div>
                <div className="text-sm text-foreground mt-0.5">{CONTACT.location}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Socials
          </h4>
          <div className="flex flex-col gap-3">
            <SocialLink icon={Twitter} label="X / Twitter" href={twitter} />
            <SocialLink icon={Github} label="GitHub" href={GITHUB} />
            <SocialLink icon={Linkedin} label="LinkedIn" href={linkedin} />
          </div>
          <p className="mt-5 text-xs text-muted-foreground/50 leading-relaxed">
            Want something built fast and clean? Ping me.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}

function ContactRow({ icon: Icon, label, value, onClick, isCopied }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 text-left"
      aria-label={`Copy ${label}`}
    >
      <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-medium text-foreground mt-0.5">
          <HoverUnderline>{value}</HoverUnderline>
        </div>
      </div>
      <div className="flex items-center">
        {isCopied ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
            <Check className="h-3.5 w-3.5" />
            Copied
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </span>
        )}
      </div>
    </button>
  );
}

function SocialLink({ icon: Icon, href, label }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
      aria-label={label}
    >
      <HoverUnderline>
        <span className="inline-flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="ml-2">{label}</span>
        </span>
      </HoverUnderline>
    </Link>
  );
}

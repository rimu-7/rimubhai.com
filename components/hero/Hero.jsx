"use client";

import { motion, useInView } from "framer-motion";
import {
  Check,
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
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { siteConfig } from "@/config/site";
import { safeCopy } from "@/lib/utils/clipboard";
import { HoverUnderline } from "../HoverUnderline";

import { NameToolTip } from "./NameToolTip";

import { AnimatedText } from "./animated-text";
import { MessageDialog } from "./Message.Dialog";
import { ProfileImage } from "./profile-image";
import { TimeStatus } from "./time-status";

const ease = [0.22, 1, 0.36, 1];
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fade = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease } },
};

export default function Hero() {
  const [copiedText, setCopiedText] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

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

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
    >
      <h1 className="sr-only">Mutasim Fuad Rimu | Rimu Bhai | Fuad Bhai | rimubhai</h1>
      <p className="sr-only">
        Official portfolio of Mutasim Fuad Rimu. Expert Full Stack Web Developer.
      </p>

      <motion.div variants={fade}>
        <NameToolTip />
      </motion.div>

      <motion.div variants={fade}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-14">
          <ProfileImage />

          <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left gap-4 md:pt-4">
            <h2 className="flex flex-col sm:flex-row items-center md:items-start gap-1.5 sm:gap-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              <span className="text-primary whitespace-nowrap">I build</span>
              <AnimatedText />
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

      <motion.div variants={fade} className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 md:mt-16">
        {/* Contact Column */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-center justify-between px-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Direct Contact
            </h4>
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground/40">
              click to copy
            </span>
          </div>

          <div className="flex flex-col gap-1 -mx-3">
            <ContactRow
              icon={Mail}
              label="Email"
              value={siteConfig.contact.email}
              onClick={() => handleCopy(siteConfig.contact.email, "Email")}
              isCopied={copiedText === "Email"}
            />
            <ContactRow
              icon={Phone}
              label="Phone"
              value={siteConfig.contact.phone}
              onClick={() => handleCopy(siteConfig.contact.phoneRaw, "Phone")}
              isCopied={copiedText === "Phone"}
            />
            <LinkRow
              icon={MapPin}
              label="Location"
              value={siteConfig.contact.location}
              href="https://maps.app.goo.gl/6DNp3GjQQp3DCFr56"
            />
          </div>
        </div>

        {/* Socials Column */}
        <div className="flex flex-col">
          <div className="mb-4 px-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Digital Presence
            </h4>
          </div>

          <div className="flex flex-col gap-1 -mx-3">
            <LinkRow
              icon={Twitter}
              label="X / Twitter"
              value="@rimubhai" // You can map this dynamically if added to siteConfig
              href={siteConfig.socials.twitter}
            />
            <LinkRow
              icon={Github}
              label="GitHub"
              value="View Profile"
              href={siteConfig.socials.github}
            />
            <LinkRow
              icon={Linkedin}
              label="LinkedIn"
              value="Connect"
              href={siteConfig.socials.linkedin}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

// --- Stateless Sub-components ---

// 1. The Interactive Copy Row (For Email & Phone)
function ContactRow({ icon: Icon, label, value, onClick, isCopied }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full items-center gap-4 rounded-md border border-transparent p-3 outline-none transition-all duration-300 hover:border-border/60 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary/50"
      aria-label={`Copy ${label}`}
    >
      {/* Elevated Icon Box */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 truncate text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
          {value}
        </div>
      </div>

      {/* Slide-in Action Text */}
      <div className="flex shrink-0 items-center overflow-hidden pr-1">
        {isCopied ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 animate-in fade-in slide-in-from-right-4 duration-300">
            <Check className="h-3.5 w-3.5" />
            Copied
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/40 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </span>
        )}
      </div>
    </button>
  );
}

// 2. The Interactive Link Row (For Location & Socials)
function LinkRow({ icon: Icon, label, value, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full items-center gap-4 rounded-md border border-transparent p-3 outline-none transition-all duration-300 hover:border-border/60 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 truncate text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
          {value}
        </div>
      </div>

      <div className="flex shrink-0 items-center overflow-hidden pr-2">
        <span className="flex items-center text-muted-foreground/40 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary">
          <ExternalLink className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}

function SocialLink({ icon: Icon, href, label }) {
  if (!href) return null; // Graceful fallback if env variables are missing
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

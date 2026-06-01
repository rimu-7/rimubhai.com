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
import { MessageDialog } from "../Message.Dialog";
import { NameToolTip } from "../NameToolTip";

import { AnimatedText } from "./AnimatedText";
import { ProfileImage } from "./ProfileImage";
import { TimeStatus } from "./TimeStatus";

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
            <div className="flex items-start gap-3">
              <MapPin className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </div>
                <div className="text-sm text-foreground mt-0.5">{siteConfig.contact.location}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Socials
          </h4>
          <div className="flex flex-col gap-3">
            <SocialLink icon={Twitter} label="X / Twitter" href={siteConfig.socials.twitter} />
            <SocialLink icon={Github} label="GitHub" href={siteConfig.socials.github} />
            <SocialLink icon={Linkedin} label="LinkedIn" href={siteConfig.socials.linkedin} />
          </div>
          <p className="mt-5 text-xs text-muted-foreground/50 leading-relaxed">
            Want something built fast and clean? Ping me.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}

// --- Stateless Sub-components ---

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
            <Check className="h-3.5 w-3.5" /> Copied
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Copy className="h-3.5 w-3.5" /> Copy
          </span>
        )}
      </div>
    </button>
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

"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

const pressFont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
  display: "swap",
});

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: process.env.NEXT_PUBLIC_GITHUB || "https://github.com/rimu-7",
    icon: <Github className="h-4 w-4" />,
  },
  {
    name: "Twitter",
    href: process.env.NEXT_PUBLIC_X || "https://twitter.com",
    icon: <Twitter className="h-4 w-4" />,
  },
  {
    name: "LinkedIn",
    href: process.env.NEXT_PUBLIC_LINKEDIN || "https://linkedin.com",
    icon: <Linkedin className="h-4 w-4" />,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-xl mt-auto">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8 py-8 md:py-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-2.5 max-w-sm">
              <Link
                href="/"
                className="group flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <span className={cn("text-xs tracking-tighter", pressFont.className)}>
                  rimu<span className="text-primary">{"</>"}</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Building digital experiences with clean code and pixel-perfect design. Based in
                Tanzania, crafting global solutions.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/40">
                Connect
              </span>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <SocialButton
                    key={social.name}
                    href={social.href}
                    icon={social.icon}
                    label={social.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-4 border-t pt-6 md:flex-row">
            <div className="flex flex-col items-center gap-1.5 md:items-start">
              <p className="text-xs text-muted-foreground">
                &copy; {currentYear} <span className="text-foreground">Rimubhai</span>. All rights
                reserved.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-tight text-muted-foreground">
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <div className="h-3.5 w-px bg-border" />
              <ModeToggle />
            </div>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}

function SocialButton({ href, icon, label }) {
  return (
    <Button
      variant="outline"
      size="icon"
      asChild
      className="h-9 w-9 rounded-lg bg-transparent border-border/40 text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
    >
      <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
        {icon}
      </a>
    </Button>
  );
}

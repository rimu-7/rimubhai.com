"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import Container from "@/components/Container";
import { Press_Start_2P } from "next/font/google";
import { cn } from "@/lib/utils";

const pressFont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
  display: "swap",
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur-xl mt-auto">
      <Container>
        <div className="flex flex-col gap-10 py-10 md:py-12">
          
          {/* --- TOP SECTION --- */}
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Left: Brand & Tagline */}
            <div className="flex flex-col gap-3 max-w-sm">
              <Link
                href="/"
                className="group flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <span className={cn("text-sm tracking-tighter", pressFont.className)}>
                  rimu<span className="text-primary">{"</>"}</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Building digital experiences with clean code and pixel-perfect design. 
                Based in Tanzania, crafting global solutions.
              </p>
            </div>

            {/* Right: Socials & Quick Connect */}
            <div className="flex flex-col gap-4 md:items-end">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Connect
              </span>
              <div className="flex items-center gap-3">
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

          {/* --- BOTTOM SECTION --- */}
          <div className="flex flex-col-reverse items-center justify-between gap-6 border-t pt-8 md:flex-row">
            {/* Copyright Info */}
            <div className="flex flex-col items-center gap-2 md:items-start md:gap-1">
              <p className="text-xs font-medium text-muted-foreground">
                © {currentYear} <span className="text-foreground">Rimubhai</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground/60">
                <span>Built with</span>
                <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
                <span>Next.js & Tailwind</span>
              </div>
            </div>

            {/* Utilities & Theme */}
            <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-tight text-muted-foreground">
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <div className="h-4 w-px bg-border" />
              <ModeToggle />
            </div>
          </div>
        </div>
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
      className="h-10 w-10 rounded-xl bg-transparent border-border/60 text-muted-foreground transition-all duration-300 hover:bg-primary/5 hover:text-primary hover:border-primary/50"
    >
      <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
        {icon}
      </a>
    </Button>
  );
}
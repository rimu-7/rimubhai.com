"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import Container from "@/components/Container";
import { Press_Start_2P } from "next/font/google";
import { cn } from "@/lib/utils";

// Initialize Pixel Font
const pressFont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
  display: "swap",
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Social Links Configuration
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
    <footer className="w-full bg-background/95 backdrop-blur-xl mt-auto pt-8 pb-6">
      <Container className="">
        <div className="flex flex-col border-t gap-8 pt-6">
          {/* --- TOP SECTION: Brand (Left) & Socials (Right) --- */}
          <div className="flex flex-row justify-between items-center gap-6">
            {/* Left: Brand & Tagline */}
            <div className="flex flex-col gap-2 items-start text-center md:text-left">
              <Link
                href="/"
                className="group flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <span
                  className={cn(
                    "text-xs md:text-sm tracking-tighter",
                    pressFont.className
                  )}
                >
                  rimu<span className="text-primary">{"</>"}</span>
                </span>
              </Link>
              <p className="text-sm text-muted-foreground text-justify text-wrap">
                Building digital experiences with clean code and pixel-perfect
                design.
              </p>
            </div>

            {/* Right: Social Icons */}
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

          {/* --- DIVIDER --- */}
          <div className="h-px w-full " />

          {/* --- BOTTOM SECTION: Copyright & Utilities --- */}
          <div className="flex flex-row border-t justify-between items-center gap-4 text-xs text-muted-foreground">
            {/* Left: Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
              <span>&copy; {currentYear} Rimubhai.</span>
              <span className="hidden md:inline text-border">|</span>
              <span className="flex items-center gap-1">
                Built with{" "}
                <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />{" "}
                using Next.js
              </span>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors"
              >
                contact
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <div className="h-3 w-px bg-border" />
              <ModeToggle />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// --- Helper Component ---
function SocialButton({ href, icon, label }) {
  return (
    <Button
      variant="outline"
      size="icon"
      asChild
      className="h-9 w-9 rounded bg-background border-border/50 text-muted-foreground transition-all duration-300 hover:text-primary hover:border-primary/50 hover:scale-105"
    >
      <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
        {icon}
      </a>
    </Button>
  );
}

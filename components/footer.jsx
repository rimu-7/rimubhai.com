"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import Container from "@/components/Container";
import { Press_Start_2P } from "next/font/google";

const pressFont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
  display: "swap",
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linkedin = process.env.LINKEDIN;
  const twitter = process.env.X;
  const GITHUB = process.env.GITHUB;

  return (
    <footer className="border-t bg-background/50 backdrop-blur-sm mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-6">
          {/* 1. Left: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="group flex items-center gap-2">
              <span
                className={`${pressFont.className} text-xs md:text-sm transition-opacity group-hover:opacity-80`}
              >
                rimu {"</>"}
              </span>
            </Link>
            <p className="text-xs text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Rimubhai. Built with Next.js.
            </p>
          </div>

          {/* 3. Right: Socials & Theme */}
          <div className="flex items-center gap-2">
            <SocialButton href={GITHUB} icon={<Github className="h-4 w-4" />} />
            <SocialButton
              href={twitter}
              icon={<Twitter className="h-4 w-4" />}
            />
            <SocialButton
              href={linkedin}
              icon={<Linkedin className="h-4 w-4" />}
            />
            <div className="h-4 w-px bg-border mx-2" />
            <ModeToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
}

// Helper for cleaner code
function SocialButton({ href, icon }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
    >
      <a href={href} target="_blank" rel="noreferrer">
        {icon}
      </a>
    </Button>
  );
}

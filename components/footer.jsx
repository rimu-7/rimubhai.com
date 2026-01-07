"use client";

import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Send,
  Code2,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
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
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);



  // Prevent hydration mismatch for theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Container>
      {/* 1. Top Section: Newsletter & Branding */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-8">
          {/* Brand Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Code2 className="h-6 w-6" />
              </div>
              <p className={`${pressFont.className}`}>rimu {"</>"} </p>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Crafting digital experiences with precision and passion.
              Specializing in Next.js, React, and modern web architecture.
            </p>
          </div>

          {/* Links Columns (Span 3) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {/* Column 1 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-tight">Platform</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-primary transition-colors"
                  >
                    Latest Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="hover:text-primary transition-colors"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/snippets"
                    className="hover:text-primary transition-colors"
                  >
                    Code Snippets
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-tight">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Me
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/uses"
                    className="hover:text-primary transition-colors"
                  >
                    Uses / Gear
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold tracking-tight">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* 2. Bottom Section: Socials & Copyright */}
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {currentYear} Rimubhai. All rights reserved. Built with
            Next.js
          </p>

          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </Container>
  );
}

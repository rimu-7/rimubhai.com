import Link from "next/link";
import { Github, Linkedin, Twitter, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import Container from "@/components/Container";
import { Press_Start_2P } from "next/font/google";
import Userinfo from "./user-info";
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

  // Configuration for Social Links
  const SOCIAL_LINKS = [
    {
      name: "GitHub",
      href: process.env.GITHUB || "https://github.com",
      icon: <Github className="h-4 w-4" />,
    },
    {
      name: "Twitter",
      href: process.env.X || "https://twitter.com",
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      name: "LinkedIn",
      href: process.env.LINKEDIN || "https://linkedin.com",
      icon: <Linkedin className="h-4 w-4" />,
    },
  ];

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur-supports-[backdrop-filter]:bg-background/60 mt-auto">
      <Container>
        <div className="flex flex-col-reverse md:flex-row justify-between items-center py-8 gap-6 md:gap-0">
          
          {/* --- LEFT: Brand & Copyright --- */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link 
              href="/" 
              className="group flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <span className={cn("text-xs md:text-sm tracking-tighter", pressFont.className)}>
                rimu<span className="text-primary">{"</>"}</span>
              </span>
            </Link>
            
            <div className="text-xs text-muted-foreground/60 text-center md:text-left space-y-1">
              <p>
                &copy; {currentYear} Rimubhai. All rights reserved.
              </p>
              <p className="flex items-center justify-center md:justify-start gap-1">
                Built with <Heart className="h-2.5 w-2.5 text-red-500 fill-red-500 animate-pulse" /> using Next.js
              </p>
            </div>
          </div>

          {/* --- RIGHT: Socials & Utilities --- */}
          <div className="flex flex-col items-center md:flex-row gap-4 md:gap-6">
            
            {/* Social Links Group */}
            <div className="flex items-center gap-1">
              {SOCIAL_LINKS.map((social) => (
                <SocialButton 
                  key={social.name} 
                  href={social.href} 
                  icon={social.icon} 
                  label={social.name}
                />
              ))}
            </div>

            {/* Divider (Desktop only) */}
            <div className="hidden md:block h-5 w-px bg-border/60" />

            {/* App Controls */}
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Userinfo />
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
      variant="ghost"
      size="icon"
      asChild
      className="h-9 w-9 text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-muted hover:-translate-y-0.5"
    >
      <a 
        href={href} 
        target="_blank" 
        rel="noreferrer" 
        aria-label={label}
      >
        {icon}
      </a>
    </Button>
  );
}
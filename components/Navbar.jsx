"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Code,
  Component,
  FileText,
  Home,
  Menu,
  Settings2,
  Sparkles,
} from "lucide-react";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore, useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";

const pressFont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
  display: "swap",
});

const menuItems = [
  { label: "Portfolio", href: "/", icon: Home },
  { label: "Components", href: "/components", icon: Component },
  { label: "Blogs", href: "/blogs", icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(pathname);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl shadow"
          : "bg-background/50 backdrop-blur-sm"
      )}
    >
      <div className="flex mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8  h-14 items-center justify-between">
        <Link href="/" className="group flex items-center" aria-label="Mutasim Fuad Rimu Portfolio Home">
          <p
            className={cn(
              pressFont.className,
              "text-[10px] sm:text-xs transition-opacity group-hover:opacity-80"
            )}
          >
            rimu <span className="text-primary">{"</>"}</span>
          </p>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="hidden md:flex items-center gap-0.5 relative"
            onMouseLeave={() => setHoveredPath(pathname)}
          >
            {menuItems.map((item) => {
              const isActive = item.href === pathname;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md z-10",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onMouseEnter={() => setHoveredPath(item.href)}
                >
                  {item.href === hoveredPath && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 rounded-md bg-muted/60 -z-10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}

            {mounted ? (
              <DropdownMenu open={isServicesOpen} onOpenChange={setIsServicesOpen}>
                <DropdownMenuTrigger
                  asChild
                  onMouseEnter={() => {
                    setHoveredPath("services");
                    setIsServicesOpen(true);
                  }}
                  className="focus:outline-none"
                >
                  <button
                    className={cn(
                      "relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md z-10 flex items-center gap-1",
                      "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {"services" === hoveredPath && (
                      <motion.div
                        layoutId="navbar-hover"
                        className="absolute inset-0 rounded-md bg-muted/60 -z-10"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    Services
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isServicesOpen && "rotate-180"
                      )}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-[200px]"
                  sideOffset={8}
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => {
                    setIsServicesOpen(false);
                    setHoveredPath(pathname);
                  }}
                >
                  <DropdownMenuItem>
                    <Link href="/services/web-development" className="flex gap-2 items-center">
                      <Code className="w-4 h-4" />
                      <span>Web Development</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/services/software-development" className="flex gap-2 items-center">
                      <Settings2 className="w-4 h-4" />
                      <span>Software Development</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md z-10 flex items-center gap-1",
                  "text-muted-foreground"
                )}
              >
                Services
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="h-5 w-px bg-border/40 mx-0.5 hidden sm:block" />

          <div className="flex items-center gap-1.5">
            <ModeToggle />
            {mounted ? (
              <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Menu className="h-4.5 w-4.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] max-w-[380px] p-0 gap-0 overflow-hidden rounded-2xl border-border/60 bg-background/95 backdrop-blur-xl">
                  <DialogTitle className="sr-only">Mobile Navigation Menu</DialogTitle>
                  <div className="p-4 border-b bg-muted/20 flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <span className={cn(pressFont.className, "text-[8px] text-primary")}>RB</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Menu</span>
                  </div>
                  <div className="p-2 flex flex-col gap-0.5">
                    {menuItems.map((item, i) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.2 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200",
                              isActive
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-4 w-4",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground group-hover:text-foreground"
                              )}
                            />
                            {item.label}
                            {isActive && (
                              <motion.div
                                layoutId="mobile-indicator"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.18, duration: 0.2 }}
                          className="group flex items-center justify-between w-full gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <div className="flex items-center gap-3">
                            <Sparkles className="h-4 w-4" />
                            Services
                          </div>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[calc(100%-2rem)] ml-4 mr-4" sideOffset={4}>
                        <DropdownMenuItem>
                          <Link href="/services/web-development" className="flex gap-2 items-center">
                            <Code className="w-4 h-4" />
                            <span>Web Development</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href="/services/software-development"
                            className="flex gap-2 items-center"
                          >
                            <Settings2 className="w-4 h-4" />
                            <span>Software Development</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="p-3 bg-muted/30 border-t text-[11px] text-center text-muted-foreground/50">
                    <p className="flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      Designed by Rimubhai
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-4.5 w-4.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

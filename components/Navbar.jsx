"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { Press_Start_2P } from "next/font/google";
import {
  Menu,
  Component,
  FileText,
  Home,
  Code,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
// Added Dropdown Menu Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Container from "./Container";
import { Settings2 } from "lucide-react";
import { BiMobile } from "react-icons/bi";

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
  // State to control Services Dropdown on Hover
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ className: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-border/50 shadow-sm"
          : "bg-background/50 backdrop-blur-sm border-transparent",
      )}
    >
      <Container className="h-16 flex items-center justify-between">
        {/* --- LEFT: LOGO --- */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <p
              className={cn(
                pressFont.className,
                "text-xs md:text-sm transition-opacity group-hover:opacity-80",
              )}
            >
              rimu <span className="text-primary">{"</>"}</span>
            </p>
          </div>
        </Link>

        {/* --- RIGHT: NAV & ACTIONS --- */}
        <div className="flex items-center gap-2">
          {/* 1. Desktop Navigation */}
          <div
            className="hidden md:flex items-center gap-1 mr-2 relative"
            onMouseLeave={() => setHoveredPath(pathname)}
          >
            {menuItems.map((item) => {
              const isActive = item.href === pathname;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-md z-10",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onMouseEnter={() => setHoveredPath(item.href)}
                >
                  {item.href === hoveredPath && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 rounded-md -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}

            {/* --- SERVICES DROPDOWN (Desktop) --- */}
            <DropdownMenu
              open={isServicesOpen}
              onOpenChange={setIsServicesOpen}
            >
              <DropdownMenuTrigger
                asChild
                onMouseEnter={() => {
                  setHoveredPath("services");
                  setIsServicesOpen(true);
                }}
                onMouseLeave={() => {
                  // Small delay or check to keep open when moving to content
                  // Usually handled by the DropdownMenuContent onMouseEnter
                }}
                className="focus:outline-none"
              >
                <button
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-md z-10 flex items-center gap-1",
                    "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {"services" === hoveredPath && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 rounded-md -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  Services
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isServicesOpen && "rotate-180",
                    )}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-[200px]"
                sideOffset={10}
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => {
                  setIsServicesOpen(false);
                  setHoveredPath(pathname);
                }}
              >
                {/* Additional Items for Demo */}
                <DropdownMenuItem>
                  <Link
                    href="/services/web-development"
                    className="flex gap-2 justify-center items-center"
                  >
                    <Code className="w-4 h-4" />
                    <span>Web Development</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/services/software-development"
                    className="flex gap-2 justify-center items-center"
                  >
                    <Settings2 className="w-4 h-4" />
                    <span>Sofware Development</span>
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Link href="/services/mobile-development" className="flex gap-2 justify-center items-center">
                    <BiMobile className="w-4 h-4" />
                    <span>Mobile Development</span>
                  </Link>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 2. Divider */}
          <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

          {/* 3. Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Mobile Menu Dialog */}
            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[90%] max-w-[400px] p-0 gap-0 overflow-hidden rounded-2xl border-border/60 bg-background/95 backdrop-blur-xl">
                {/* ACCESSIBLE TITLE FIX: Using 'sr-only' class instead of VisuallyHidden component */}
                <DialogTitle className="sr-only">
                  Mobile Navigation Menu
                </DialogTitle>

                {/* Header */}
                <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <span
                        className={cn(
                          pressFont.className,
                          "text-[10px] text-primary",
                        )}
                      >
                        RB
                      </span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Menu
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2 flex flex-col gap-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground",
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
                    );
                  })}

                  {/* --- SERVICES DROPDOWN (Mobile) --- */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "group flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                          "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-4 w-4" />
                          Services
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[calc(100%-2rem)] ml-4 mr-4" // Responsive width for mobile
                      sideOffset={5}
                    >
                      <DropdownMenuItem>
                        <Link
                          href="/services/web-development"
                          className="flex gap-2 justify-center items-center"
                        >
                          <Code className="w-4 h-4" />
                          <span>Web Development</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href="/services/software-development"
                          className="flex gap-2 justify-center items-center"
                        >
                          <Settings2 className="w-4 h-4" />
                          <span>Sofware Development</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Footer */}
                <div className="p-4 bg-muted/30 border-t text-xs text-center text-muted-foreground">
                  <p className="flex items-center justify-center gap-1 opacity-70">
                    <Sparkles className="h-3 w-3" />
                    Designed by Rimubhai
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Container>
    </motion.nav>
  );
}

"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { Press_Start_2P } from "next/font/google";
import {
  Search,
  Menu,
  User,
  Component,
  FileText,
  Home,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SearchDialog } from "./SearchDialog";

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
  const pathname = usePathname(); // Get current route
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-all duration-300 ${
        isScrolled ? "py-2 shadow-sm" : "py-2"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* LEFT SIDE: LOGO */}
        <Link href="/" className="p-2 ">
          <div className="relative h-full w-full overflow-hidden">
            {/* <Image src="/boy.png" alt="me" fill className="object-cover" /> */}
            <p className={`${pressFont.className}`}>rimu {"</>"} </p>
          </div>
        </Link>

        {/* RIGHT SIDE: NAV + ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button key={item.label} variant="ghost" asChild size="sm">
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-1 sm:gap-2 border-l pl-2 sm:pl-4">
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-106 top-[20%] translate-y-0">
                <DialogHeader>
                  <DialogTitle className="text-sm font-press-start">
                    Search
                  </DialogTitle>
                </DialogHeader>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search anything..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </DialogContent>
            </Dialog> */}
            {/* <SearchDialog/> */}

            <ModeToggle />

            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Menu className="h-5 w-5" suppressHydrationWarning/>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-86 gap-0 p-0 overflow-hidden rounded-xl">
                <div className="p-6 bg-muted/30 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 h-10 w-10 flex justify-center items-center rounded-full border bg-background text-foreground">
                      <span className={`${pressFont.className} text-xs`}>
                        rb
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 grid gap-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-accent text-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <item.icon
                          className={`h-4 w-4 ${
                            isActive ? "text-primary" : ""
                          }`}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                  
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  );
}

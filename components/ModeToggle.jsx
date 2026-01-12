"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 1. Handle Hydration Mismatch
  // We only render the UI after the client has mounted to prevent
  // the icons from flickering or showing the wrong state initially.
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Prevent Hydration Warning
  // Render a placeholder of exact same size while loading
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled className="h-9 w-9 opacity-50">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="group relative h-9 w-9 rounded bg-background/50 hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
    >
      {/* Sun Icon: Visible in Light Mode, Rotates out in Dark */}
      <Sun 
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 ease-in-out 
        text-amber-500 
        dark:-rotate-90 dark:scale-0" 
      />

      {/* Moon Icon: Hidden in Light Mode, Rotates in for Dark */}
      <Moon 
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 ease-in-out 
        text-blue-500 dark:text-blue-400
        dark:rotate-0 dark:scale-100" 
      />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
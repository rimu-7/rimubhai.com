"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" disabled className="h-8 w-8 opacity-50"><Sun className="h-4 w-4" /></Button>;
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div key="moon" initial={{ y: -8, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 8, opacity: 0, rotate: 90 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <Moon className="h-4 w-4 text-blue-400" />
          </motion.div>
        ) : (
          <motion.div key="sun" initial={{ y: 8, opacity: 0, rotate: 90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -8, opacity: 0, rotate: -90 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <Sun className="h-4 w-4 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

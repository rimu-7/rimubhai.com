"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800" />
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => {
          // Toggle between light and dark only
          setTheme(theme === "light" ? "dark" : "light");
        }}
        className="group relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:scale-105 hover:border-gray-300 hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600 dark:hover:bg-gray-800"
        aria-label={`Toggle theme. Current: ${theme}`}
        title={`Current: ${
          theme === "light" ? "Light" : "Dark"
        }. Click to switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {/* Sun icon - visible in light mode */}
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 text-amber-500 transition-all duration-300 group-hover:rotate-90 dark:scale-0 dark:-rotate-90 dark:opacity-0" />

        {/* Moon icon - visible in dark mode */}
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 text-indigo-400 transition-all duration-300 group-hover:rotate-180 dark:scale-100 dark:rotate-0 dark:opacity-100" />
      </button>

      {/* Dropdown alternative - appears on hover for desktop */}
      <div className="absolute right-0 top-full z-50 mt-2 hidden w-32 origin-top-right scale-95 rounded-xl border border-gray-200 bg-white p-1 opacity-0 shadow-lg transition-all duration-200 hover:block group-hover:scale-100 group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-900 dark:shadow-2xl sm:block">
        <div className="py-1">
          <button
            onClick={() => setTheme("light")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              theme === "light"
                ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Light</span>
            {theme === "light" && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              theme === "dark"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Dark</span>
            {theme === "dark" && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile-friendly popup on click */}
      <div className="fixed bottom-20 right-4 z-50 sm:hidden">
        <div
          className={`transform rounded-xl border border-gray-200 bg-white p-3 shadow-xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 ${
            mounted
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                theme === "light"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">Light</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                theme === "dark"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Moon className="h-5 w-5" />
              <span className="text-sm font-medium">Dark</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

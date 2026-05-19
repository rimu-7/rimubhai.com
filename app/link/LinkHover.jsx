"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// --- IndexedDB Cache System (Persistent Browser Storage) ---
const DB_NAME = "LinkHoverCacheDB";
const STORE_NAME = "screenshots";

const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
  });
};

const saveToCache = async (url, blob) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob, url);
  } catch (err) {
    console.error("Failed to save to IndexedDB:", err);
  }
};

const getFromCache = async (url) => {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(url);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

// --- In-Memory Fast Cache & Queue ---
const memoryCache = new Map();
const preloadQueue = [];
let isPreloading = false;

const processQueue = async () => {
  if (isPreloading || preloadQueue.length === 0) return;
  isPreloading = true;

  while (preloadQueue.length > 0) {
    const { url, apiUrl, resolve } = preloadQueue.shift();

    if (memoryCache.has(url)) {
      resolve(memoryCache.get(url));
      continue;
    }

    const cachedBlob = await getFromCache(url);
    if (cachedBlob) {
      const objectUrl = URL.createObjectURL(cachedBlob);
      memoryCache.set(url, objectUrl);
      resolve(objectUrl);
      continue;
    }

    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const blob = await response.blob();
        await saveToCache(url, blob); 
        const objectUrl = URL.createObjectURL(blob);
        memoryCache.set(url, objectUrl);
        resolve(objectUrl);
      } else {
        resolve(null);
      }
    } catch (error) {
      console.error("Failed to preload:", url);
      resolve(null);
    }

    await new Promise((r) => setTimeout(r, 200)); 
  }
  isPreloading = false;
};

const queuePreload = (url, apiUrl) => {
  return new Promise((resolve) => {
    preloadQueue.push({ url, apiUrl, resolve });
    processQueue();
  });
};

// --- Advanced Animation Configs ---
const macOS_ease_out = [0.23, 1, 0.32, 1]; // Premium, snappy ease-out

const containerVariants = {
  initial: ( { vertical, isInstant } ) => ({
    opacity: isInstant ? 1 : 0,
    scale: isInstant ? 1 : 0.96,
    // Shift slightly from the anchor point (e.g., up if positioned top)
    y: isInstant ? 0 : (vertical === "top" ? 8 : -8), 
    filter: isInstant ? "blur(0px)" : "blur(4px)",
  }),
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 350, // High stiffness for snap
      damping: 28,   // Slightly cushioned arrival
      mass: 0.8,
      // For elements not instant, smooth out the filter/scale
      opacity: { duration: 0.25, ease: macOS_ease_out },
      scale: { duration: 0.35, ease: macOS_ease_out },
      filter: { duration: 0.3, ease: macOS_ease_out },
    },
  },
  exit: ({ vertical }) => ({
    opacity: 0,
    scale: 0.97,
    y: vertical === "top" ? 6 : -6,
    filter: "blur(2px)",
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1], // Standard ease-in for faster exit
    },
  }),
};

// --- Main Component ---
const LinkHover = ({ link, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedUrl, setCachedUrl] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const timeoutRef = useRef(null);
  const linkRef = useRef(null);
  const hasQueued = useRef(false);

  const apiUrl = `/api/linkhover?url=${encodeURIComponent(link)}`;

  useEffect(() => {
    if (hasQueued.current) return;
    const currentLinkRef = linkRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          hasQueued.current = true;
          const doPreload = async () => {
            const objectUrl = await queuePreload(link, apiUrl);
            if (objectUrl) {
              setCachedUrl(objectUrl);
              setIsLoading(false);
            }
          };
          if ("requestIdleCallback" in window) window.requestIdleCallback(doPreload);
          else setTimeout(doPreload, 200);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" } 
    );
    if (currentLinkRef) observer.observe(currentLinkRef);
    return () => { if (currentLinkRef) observer.disconnect(); };
  }, [link, apiUrl]);

  const calculatePosition = useCallback(() => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const tooltipWidth = 400;
    const tooltipHeight = 350;
    const gap = 16; // Increased gap for premium visual padding

    const spaceTop = rect.top;
    const spaceBottom = window.innerHeight - rect.bottom;
    let vertical = spaceTop < tooltipHeight + gap && spaceBottom > spaceTop ? "bottom" : "top";

    const centerLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
    const centerRight = centerLeft + tooltipWidth;
    let horizontal = "center";

    if (centerLeft < gap) horizontal = "left";
    else if (centerRight > window.innerWidth - gap) horizontal = "right";

    if (spaceTop < tooltipHeight + gap && spaceBottom < tooltipHeight + gap) {
      vertical = "side";
      horizontal = window.innerWidth - rect.right > rect.left ? "right-side" : "left-side";
    }

    setTooltipPosition({ vertical, horizontal });
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    calculatePosition(); // Critical: Recalculate immediately
    
    // Attempt instant render from memory cache
    if (memoryCache.has(link)) {
      setCachedUrl(memoryCache.get(link));
      setIsLoading(false);
    }
    
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Shorter exit delay for perceived snappiness
    timeoutRef.current = setTimeout(() => setIsHovered(false), 120); 
  };

  const getPositionClasses = () => {
    const { vertical, horizontal } = tooltipPosition;
    // Enhanced styles: sophisticated shadow, slight gradient border for "perfect" look
    let classes = "absolute z-50 w-[400px] h-[350px] bg-popover/95 text-popover-foreground rounded-2xl flex flex-col overflow-hidden backdrop-blur-[10px] overscroll-contain ";
    // Multi-layered 'premium' shadow
    classes += "shadow-[0_20px_50px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.1)] ";
    // Subtle border glow effect
    classes += "border border-border/60 before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/5 ";

    if (vertical === "top") classes += "bottom-full mb-4 ";
    else if (vertical === "bottom") classes += "top-full mt-4 ";
    else if (vertical === "side") {
      classes += "top-1/2 -translate-y-1/2 ";
      classes += horizontal === "left-side" ? "right-full mr-4 " : "left-full ml-4 ";
      return classes;
    }

    if (horizontal === "center") classes += "left-1/2 -translate-x-1/2 ";
    else if (horizontal === "left") classes += "left-0 ";
    else if (horizontal === "right") classes += "right-0 ";

    return classes;
  };

  const isInstant = cachedUrl !== null;

  return (
    <div
      ref={linkRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Animated Link Text */}
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.015, color: "var(--blue-800, #1e40af)" }} // Subtle text response
        transition={{ duration: 0.2, ease: macOS_ease_out }}
      >
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline underline-offset-4 transition-colors"
        >
          {children}
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {isHovered && (
          <motion.div
            layout // Smoothly handles layout shifts if position changes dynamically
            custom={{ vertical: tooltipPosition.vertical, isInstant }}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={getPositionClasses()}
            // Origin logic is key for perfect "pop" effect from the anchor
            style={{ originX: 0.5, originY: tooltipPosition.vertical === "top" ? 1 : 0 }}
          >
            <div className="bg-muted/80 backdrop-blur-sm px-4 py-2.5 text-xs text-muted-foreground border-b border-border/50 flex items-center gap-3 z-20 relative">
              <div className="flex gap-1.5">
                {/* Visual refinement: subtle dots */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/90 border border-[#E0443E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/90 border border-[#DEA123]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/90 border border-[#1AAB29]" />
              </div>
              <span className="truncate font-medium tracking-tight text-foreground/70">{link}</span>
            </div>

            <div className="relative flex-1 bg-background/50 overflow-y-auto overflow-x-hidden overscroll-contain custom-scrollbar scroll-smooth">
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    key="loader"
                    initial={{ opacity: isInstant ? 0 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10"
                  >
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500/80 mb-2" />
                    <span className="text-xs text-muted-foreground font-medium mt-2">Generating preview...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {(cachedUrl || !isLoading) && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: macOS_ease_out }} // Smooth inner image load
                >
                  <Image
                    src={cachedUrl || apiUrl}
                    alt={`Preview of ${link}`}
                    width={900} // Target viewport width is 1280, 900 is good optimized width
                    height={600}
                    unoptimized={false} // Next/Image optimization is superior to unoptimized if configured
                    onLoad={() => setIsLoading(false)}
                    className="w-full h-auto object-cover object-top block"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkHover;
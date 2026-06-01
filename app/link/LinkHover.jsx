"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

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
const containerVariants = {
  initial: ({ vertical, horizontal, isInstant }) => {
    // Dynamically set origin based on position so it "grows" from the link
    let originX = 0.5;
    let originY = vertical === "top" ? 1 : 0;

    if (horizontal === "left") originX = 0.1;
    if (horizontal === "right") originX = 0.9;

    return {
      opacity: 0,
      scale: isInstant ? 0.95 : 0.85,
      y: vertical === "top" ? 12 : -12,
      rotateX: vertical === "top" ? -8 : 8, // Subtle 3D hinge effect
      filter: isInstant ? "blur(2px)" : "blur(8px)",
      transformOrigin: `${originX * 100}% ${originY * 100}%`,
    };
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 28,
      mass: 0.8,
      opacity: { duration: 0.2 },
      filter: { duration: 0.25 },
    },
  },
  exit: ({ vertical }) => ({
    opacity: 0,
    scale: 0.96,
    y: vertical === "top" ? 8 : -8,
    filter: "blur(4px)",
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  }),
};

// --- Main Component ---
const LinkHover = ({ link, url, imageSrc, isStatic, className, children }) => {
  // Support both 'url' and 'link' props for backwards compatibility
  const href = url || link;

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedUrl, setCachedUrl] = useState(null);
  const [isImageFullyLoaded, setIsImageFullyLoaded] = useState(false); // Tracks persistent load state
  const [tooltipPosition, setTooltipPosition] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const timeoutRef = useRef(null);
  const linkRef = useRef(null);
  const hasQueued = useRef(false);

  const apiUrl = `/api/linkhover?url=${encodeURIComponent(href)}`;

  // 1. Intersection Observer for API Preloading (Skipped if isStatic)
  useEffect(() => {
    if (isStatic || hasQueued.current) return;

    const currentLinkRef = linkRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          hasQueued.current = true;
          const doPreload = async () => {
            const objectUrl = await queuePreload(href, apiUrl);
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
    return () => {
      if (currentLinkRef) observer.disconnect();
    };
  }, [href, apiUrl, isStatic]);

  // 2. Position Calculation
  const calculatePosition = useCallback(() => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const tooltipWidth = 400;
    const tooltipHeight = 350;
    const gap = 16;

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

  // 3. Hover Handlers
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    calculatePosition();

    if (isStatic) {
      // If static and already loaded in a previous hover, remove loader instantly
      if (isImageFullyLoaded) setIsLoading(false);
    } else if (memoryCache.has(href)) {
      setCachedUrl(memoryCache.get(href));
      setIsLoading(false);
    }

    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsHovered(false), 120);
  };

  // 4. Class Formatting
  const getPositionClasses = () => {
    const { vertical, horizontal } = tooltipPosition;
    let classes =
      "absolute z-50 w-[400px] h-[350px] bg-popover/95 text-popover-foreground rounded-2xl flex flex-col overflow-hidden backdrop-blur-[12px] overscroll-contain ";
    classes += "shadow-[0_24px_54px_rgba(0,0,0,0.18),0_8px_16px_rgba(0,0,0,0.1)] ";
    classes +=
      "border border-border/60 before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/10 before:pointer-events-none ";

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

  const finalImageSource = isStatic && imageSrc ? imageSrc : cachedUrl || apiUrl;
  const isInstant = (isStatic && isImageFullyLoaded) || (!isStatic && cachedUrl !== null);

  return (
    <div
      ref={linkRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-800 ${className || ""}`}
        >
          {children}
        </Link>
      </motion.div>

      <AnimatePresence mode="wait">
        {isHovered && (
          <motion.div
            layout
            custom={{
              vertical: tooltipPosition.vertical,
              horizontal: tooltipPosition.horizontal,
              isInstant,
            }}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={getPositionClasses()}
            style={{ perspective: 1000 }} // Required for the 3D fold effect
          >
            {/* Top Bar matching macOS style */}
            <div className="bg-muted/90 backdrop-blur-md px-4 py-3 text-xs text-muted-foreground border-b border-border/50 flex items-center gap-3 z-20 relative shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-inner" />
              </div>
              <span className="truncate font-medium tracking-tight text-foreground/80">{href}</span>
            </div>

            <div className="relative flex-1 bg-black/5 overflow-hidden">
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    key="loader"
                    initial={{ opacity: isInstant ? 0 : 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md z-10"
                  >
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500/80 mb-3" />
                    <span className="text-xs text-muted-foreground font-medium animate-pulse">
                      Loading preview...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {(finalImageSource || !isLoading) && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full h-full"
                >
                  <Image
                    src={finalImageSource}
                    alt={`Preview of ${href}`}
                    fill // Automatically fills the container beautifully
                    unoptimized={!isStatic} // Only optimize if it's static
                    onLoad={() => {
                      setIsLoading(false);
                      if (isStatic) setIsImageFullyLoaded(true);
                    }}
                    className="object-cover object-top block"
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

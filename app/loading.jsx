// components/Loading.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // your classname utility
import Container from "@/components/Container";



export default function Loading({
  className,
  message = "Loading...",
  size = "md",
  variant = "fullscreen",
  showDelay = 0,
}) {
  const [visible, setVisible] = useState(showDelay === 0);

  useEffect(() => {
    if (showDelay > 0) {
      const timer = setTimeout(() => setVisible(true), showDelay);
      return () => clearTimeout(timer);
    }
  }, [showDelay]);

  if (!visible) return null;

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted-foreground",
        variant === "fullscreen" && "h-screen",
        className,
      )}
    >
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      <p className="text-sm font-medium tracking-wide animate-pulse">
        {message}
      </p>
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (variant === "fullscreen") {
    return <Container className={className}>{content}</Container>;
  }

  return content;
}

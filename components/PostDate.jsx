"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export default function PostDate({ dateString, className = "" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!dateString) return null;

  const dateObject = new Date(dateString);

  // Return hydration-safe static markup on the server
  if (!mounted) {
    return (
      <time dateTime={dateObject.toISOString()} className={className}>
        <Calendar className="h-3.5 w-3.5" />
        <span className="opacity-0">Loading date...</span>
      </time>
    );
  }

  // Return fully localized date on the client
  return (
    <time dateTime={dateObject.toISOString()} className={className}>
      <Calendar className="h-3.5 w-3.5" />
      {dateObject.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </time>
  );
}

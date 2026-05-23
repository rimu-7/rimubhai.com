"use client";

import Script from "next/script";

export default function UmamiAnalytics() {
  // Only execute in production to avoid polluting data during local development
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!scriptUrl || !websiteId) {
    console.warn("Umami Analytics is missing environment variables.");
    return null;
  }

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      strategy="lazyOnload" // Non-blocking: waits until main thread is free
    />
  );
}

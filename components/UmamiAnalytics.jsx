"use client";

import Script from "next/script";

export default function UmamiAnalytics() {
  // Only execute in production to avoid polluting data during local development
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!websiteId) {
    console.warn("Umami Analytics is missing the website ID environment variable.");
    return null;
  }

  return (
    <Script
      src="/stats/track.js"
      data-host-url="/stats"
      data-website-id={websiteId}
      strategy="lazyOnload" // Non-blocking: waits until main thread is free
    />
  );
}

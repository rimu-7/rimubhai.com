"use client";

import { useState, useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function Gatekeeper({ children }) {
  const [status, setStatus] = useState("");

  // 1. Check storage when the component loads
  useEffect(() => {
    const isVerified = sessionStorage.getItem("turnstile_verified");
    if (isVerified === "true") {
      setStatus("success");
    }
  }, []);

  const handleVerify = async (token) => {
    try {
      const res = await fetch("/api/fetch-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        // 2. Save the success status to sessionStorage
        sessionStorage.setItem("turnstile_verified", "true");
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">

      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        onSuccess={handleVerify}
        onError={() => setStatus("error")}
      />

      {status === "error" && (
        <p className="text-red-500">
          Verification failed. Please refresh the page.
        </p>
      )}
    </div>
  );
}

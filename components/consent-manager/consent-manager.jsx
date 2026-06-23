"use client";

import { consentDecidedAtom } from "@/lib/consent-store";
import { Provider, useAtomValue } from "jotai";
import { useLayoutEffect, useState } from "react";
import { CookieBanner } from "./cookie-banner";

function ConsentManagerContent({ children, decided }) {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    // Hydration fix: mount state is set synchronously to prevent mismatch
    // between server-rendered and client-rendered content
    // @see https://react.dev/reference/react/useLayoutEffect
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) {
    return children;
  }

  return (
    <>
      {/* Show banner only if user hasn't decided yet */}
      {!decided && <CookieBanner />}
      {children}
    </>
  );
}

export function ConsentManager({ children }) {
  const decided = useAtomValue(consentDecidedAtom);

  return (
    <Provider>
      <ConsentManagerContent decided={decided}>{children}</ConsentManagerContent>
    </Provider>
  );
}

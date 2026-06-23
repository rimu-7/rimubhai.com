"use client";

import { buttonVariants } from "@/components/ui/button";
import { consentAtom } from "@/lib/consent-store";
import { cn } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { X } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { ConsentDialog } from "./consent-dialog";

export function CookieBanner() {
  const setConsent = useSetAtom(consentAtom);
  const [state, setState] = useState({ mounted: false, bannerOpen: false, dialogOpen: false });

  // Initialize banner on client only to avoid hydration mismatch
  useLayoutEffect(() => {
    // Hydration fix: state is set synchronously to prevent mismatch
    // between server-rendered and client-rendered content
    // @see https://react.dev/reference/react/useLayoutEffect
    // eslint-disable-next-line
    setState((prev) => ({ ...prev, mounted: true, bannerOpen: true }));
  }, []);

  if (!state.mounted || !state.bannerOpen) {
    return null;
  }

  const closeBanner = () => {
    setState((prev) => ({ ...prev, bannerOpen: false }));
  };

  const acceptAll = () => {
    setConsent({ necessary: true, measurement: true });
    closeBanner();
  };

  const rejectAll = () => {
    setConsent({ necessary: true, measurement: false });
    closeBanner();
  };

  const customize = () => {
    setState((prev) => ({ ...prev, dialogOpen: true }));
  };

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2",
          "w-full sm:max-w-md lg:max-w-lg overflow-hidden rounded-t-2xl sm:rounded-2xl",
          "bg-popover text-popover-foreground shadow-2xl",
          "ring-1 ring-foreground/10 dark:ring-foreground/20",
          "animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-2 duration-300"
        )}
      >
        <div className="flex flex-col gap-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 p-4 sm:p-6 pb-2 sm:pb-4">
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-semibold leading-tight text-foreground">
                Cookie Preferences
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We use cookies to enhance your browsing experience. Necessary cookies are always
                enabled.
              </p>
            </div>
            <button
              onClick={closeBanner}
              className="mt-0.5 shrink-0 rounded-lg p-1.5 hover:bg-muted hover:dark:bg-muted/50 transition-colors"
              aria-label="Close"
            >
              <X size={18} className="sm:size-20" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 p-4 sm:p-6 pt-2 sm:pt-4 sm:flex-row">
            <button
              onClick={rejectAll}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "flex-1 text-xs sm:text-sm font-medium"
              )}
            >
              Reject
            </button>
            <button
              onClick={customize}
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "flex-1 text-xs sm:text-sm font-medium"
              )}
            >
              Customize
            </button>
            <button
              onClick={acceptAll}
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex-1 text-xs sm:text-sm font-medium"
              )}
            >
              Accept
            </button>
          </div>
        </div>
      </div>

      {state.dialogOpen && (
        <ConsentDialog
          open={state.dialogOpen}
          onOpenChange={(open) => setState((prev) => ({ ...prev, dialogOpen: open }))}
        />
      )}
    </>
  );
}

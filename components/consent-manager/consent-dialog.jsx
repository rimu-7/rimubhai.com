"use client";

import { buttonVariants } from "@/components/ui/button";
import { consentAtom } from "@/lib/consent-store";
import { cn } from "@/lib/utils";
import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { useAtom } from "jotai";
import { ChevronDown, X } from "lucide-react";

export function ConsentDialog({ open, onOpenChange }) {
  const [consent, setConsent] = useAtom(consentAtom);

  const toggleCategory = (key) => {
    setConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveAndClose = () => onOpenChange(false);

  const handleRejectAll = () => {
    setConsent({ necessary: true, measurement: false });
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    setConsent({ necessary: true, measurement: true });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed z-50 w-full max-h-[90vh] overflow-y-auto",
            "bottom-0 left-0 right-0 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
            "sm:max-w-md lg:max-w-lg max-h-[85vh]",
            "rounded-t-3xl sm:rounded-2xl border-0",
            "bg-background text-foreground shadow-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-bottom-1/2 data-[state=open]:slide-in-from-bottom-1/2",
            "sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=open]:slide-in-from-left-1/2",
            "duration-200"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border/50 p-4 sm:p-6">
              <div className="flex-1">
                <Dialog.Title className="text-lg sm:text-xl font-semibold leading-tight text-foreground">
                  Cookie Preferences
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  Customize which cookies we can use to enhance your experience.
                </Dialog.Description>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="shrink-0 rounded-lg p-2 hover:bg-muted transition-colors"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <Accordion.Root type="single" collapsible className="space-y-3">
                {/* Necessary Category - Always Enabled */}
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Necessary Cookies</h4>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        Always enabled. These cookies are essential for the website to function
                        properly.
                      </p>
                    </div>
                    <div className="ml-4 inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-primary">
                      <div className="block size-4 rounded-full bg-background transform translate-x-4" />
                    </div>
                  </div>
                </div>

                {/* Measurement Category */}
                <Accordion.Item
                  value="measurement"
                  className="rounded-lg border border-border/50 overflow-hidden"
                >
                  <Accordion.Trigger
                    className={cn(
                      "flex w-full items-center justify-between gap-4 p-4 text-left",
                      "hover:bg-muted/50 transition-colors",
                      "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
                      "dark:focus-visible:ring-offset-background"
                    )}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">Measurement Cookies</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch.Root
                        checked={consent.measurement}
                        onCheckedChange={(e) => {
                          e.stopPropagation();
                          toggleCategory("measurement");
                        }}
                        className={cn(
                          "inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent",
                          "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                          "disabled:cursor-not-allowed disabled:opacity-50",
                          "transition-colors",
                          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
                          "dark:data-[state=unchecked]:bg-input"
                        )}
                      >
                        <Switch.Thumb
                          className={cn(
                            "pointer-events-none block size-4 rounded-full bg-background ring-0",
                            "transition-transform duration-200",
                            "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5"
                          )}
                        />
                      </Switch.Root>
                      <ChevronDown
                        className="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
                        style={{
                          transform: `var(--accordion-open, rotateZ(0deg))`,
                        }}
                      />
                    </div>
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="border-t border-border/30 px-4 py-4 text-sm text-muted-foreground">
                      <p>
                        These cookies help us understand how you use our website by collecting and
                        reporting information anonymously. We use tools like Google Analytics to
                        analyze patterns and improve your experience.
                      </p>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>

            {/* Actions */}
            <div className="border-t border-border/50 bg-muted/30 p-4 sm:p-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={handleRejectAll}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "flex-1 text-sm font-medium"
                  )}
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "flex-1 text-sm font-medium"
                  )}
                >
                  Accept All
                </button>
                <button
                  onClick={saveAndClose}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "flex-1 text-sm font-medium"
                  )}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

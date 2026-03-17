"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ChevronDownIcon,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

function Accordion(props) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border/60 last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  meta,
  indicator = "plus-minus",
  ...props
}) {
  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex w-full items-center justify-between gap-4 rounded-md py-5 text-left outline-none",
          "transition-colors duration-200",
          "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        <div className="min-w-0 flex-1">{children}</div>

        <div className="flex shrink-0 items-center gap-3">
          {meta ? <div className="shrink-0">{meta}</div> : null}
          <AccordionIndicator type={indicator} />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionIndicator({ type }) {
  if (type === "plus-minus") {
    return (
      <div className="relative flex h-5 w-5 items-center justify-center text-muted-foreground">
        <ChevronsUpDown className="absolute h-4 w-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:scale-75 group-data-[state=open]:opacity-0" />
        <ChevronsDownUp className="absolute h-4 w-4 scale-75 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100" />
      </div>
    );
  }

  return (
    <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:rotate-180" />
  );
}

function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      forceMount
      data-slot="accordion-content"
      className={cn(
        "group overflow-hidden text-sm",
        "grid",
        "data-[state=open]:grid-rows-[1fr] data-[state=closed]:grid-rows-[0fr]",
        "transition-[grid-template-rows] duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        className
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "pt-1 pb-7 will-change-[opacity,transform]",
            "transition-[opacity,transform] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-data-[state=open]:translate-y-0 group-data-[state=open]:scale-100 group-data-[state=open]:opacity-100",
            "group-data-[state=closed]:-translate-y-1 group-data-[state=closed]:scale-[0.985] group-data-[state=closed]:opacity-0"
          )}
        >
          {children}
        </div>
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
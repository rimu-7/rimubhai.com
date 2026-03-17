"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const HEADER_OFFSET = 120;

export default function BlogTOC({ toc = [] }) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const items = useMemo(
    () => toc.filter((item) => item?.id && item?.text),
    [toc]
  );

  useEffect(() => {
    if (!items.length) return;

    let ticking = false;

    const updateActiveSection = () => {
      const headings = items
        .map((item) => ({
          id: item.id,
          el: document.getElementById(item.id),
        }))
        .filter((item) => item.el);

      if (!headings.length) return;

      const passedHeadings = headings.filter(
        ({ el }) => el.getBoundingClientRect().top - HEADER_OFFSET <= 0
      );

      const current =
        passedHeadings[passedHeadings.length - 1]?.id || headings[0]?.id || "";

      setActiveId(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    updateActiveSection();

    if (window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      if (items.some((item) => item.id === hashId)) {
        setActiveId(hashId);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [items]);

  const handleClick = (e, id) => {
    e.preventDefault();

    const element = document.getElementById(id);
    if (!element) return;

    const y = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
    setIsOpen(false);
  };

  if (!items.length) return null;

  const TOCList = () => (
    <nav aria-label="Table of contents" className="space-y-1.5">
      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "group relative block border-l-2 py-2 pr-3 text-sm transition-all duration-200",
              item.level === "h3" ? "ml-4 pl-4 text-[13px]" : "pl-3 font-medium",
              isActive
                ? "border-primary bg-primary/8 text-primary"
                : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <span className="line-clamp-2">{item.text}</span>
          </a>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Small + Medium Devices: sticky top TOC */}
      <div className="sticky top-20 z-30 mb-6 lg:hidden">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="overflow-hidden rounded border bg-background/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/75"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                <List className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold text-foreground">
                  Table of Contents
                </h4>
                <p className="text-xs text-muted-foreground">
                  {items.length} section{items.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle table of contents</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="border-t">
            <div className="max-h-[50vh] overflow-y-auto px-4 pb-4 pt-4">
              <TOCList />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Large Devices: sticky sidebar TOC */}
      <div className="sticky top-24 hidden self-start lg:block">
        <Card className="rounded border bg-background/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <CardHeader className="pb-4">
            <div className="mb-3 h-1 w-16 rounded-full bg-primary/70" />
            <CardTitle className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <List className="h-4 w-4 text-primary" />
                On This Page
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {items.length}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="max-h-[70vh] overflow-y-auto pt-0">
            <TOCList />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
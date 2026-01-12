"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function BlogTOC({ toc }) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false); // For mobile collapsible

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" } // Trigger when header is near top of screen
    );

    // Observe all headers found in the TOC
    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  // Helper to scroll smoothly when clicking
  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed header if you have one (adjust 100 as needed)
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setIsOpen(false); // Close mobile menu on click
    }
  };

  if (toc.length === 0) return null;

  // Render the list of links
  const TOCList = () => (
    <nav className="flex flex-col space-y-1">
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => handleClick(e, item.id)}
          className={cn(
            "text-sm transition-colors py-1 block",
            item.level === "h3" ? "pl-4" : "",
            activeId === item.id
              ? "font-medium text-primary border-l-2 border-primary pl-3 -ml-[2px]" // Active style
              : "text-muted-foreground hover:text-foreground border-l-2 border-transparent pl-3"
          )}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* --- Mobile View (Collapsible at top) --- */}
      <div className="lg:hidden mb-8">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full border rounded-lg bg-muted/30"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <List className="w-4 h-4" /> Table of Contents
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="px-4 pb-4 border-t pt-4">
            <TOCList />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* --- Desktop View (Sticky Sidebar) --- */}
      <div className="hidden lg:block sticky top-24">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
              <List className="w-4 h-4" /> On This Page
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TOCList />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
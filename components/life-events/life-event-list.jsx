"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronsUpDown,
  ChevronsDownUp,
  Plane,
  GraduationCap,
  Home,
  Flag,
  MapPin,
  Layers,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- ICONS MAPPING ---
const getTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "travel":
      return <Plane className="w-3.5 h-3.5" />;
    case "education":
      return <GraduationCap className="w-3.5 h-3.5" />;
    case "personal":
      return <Home className="w-3.5 h-3.5" />;
    case "milestone":
      return <Flag className="w-3.5 h-3.5" />;
    default:
      return <Heart className="w-3.5 h-3.5" />;
  }
};

const getTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case "travel":
      return "text-sky-500 bg-sky-500/10 border-sky-500/20";
    case "education":
      return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
    case "personal":
      return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    case "milestone":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    default:
      return "text-muted-foreground bg-secondary/50 border-transparent";
  }
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function LifeEventList({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/life-events");
      const json = await res.json();
      setEvents(json.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`/api/life-events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item._id !== id));
        toast.success("Event deleted");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    // Assuming you have an edit page or dialog logic
    window.location.href = `/admin/life-events?edit=${id}`;
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed text-sm animate-in fade-in zoom-in-95">
        <Layers className="w-8 h-8 mb-3 opacity-20" />
        <p>No life events added yet.</p>
      </div>
    );
  }

  // --- LOGIC: Split Top 5 vs Rest ---
  const visibleItems = events.slice(0, 5);
  const hiddenItems = events.slice(5);
  const hasHiddenItems = hiddenItems.length > 0;

  return (
    <div className="w-full space-y-6">
      {/* 1. Initial 5 Items */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-3"
      >
        <EventGroup
          items={visibleItems}
          user={user}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </motion.div>

      {/* 2. Hidden Items (Toggle) */}
      {hasHiddenItems && (
        <div className="space-y-4">
          {/* Divider Button */}
          <div className="relative py-2">
            <div className="relative flex justify-center text-xs uppercase">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="bg-background px-6 text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all rounded-full border-dashed shadow-sm"
              >
                {showAll ? (
                  <>
                    Show Less <ChevronsDownUp className="ml-2 h-3 w-3" />
                  </>
                ) : (
                  <>
                    View {hiddenItems.length} More{" "}
                    <ChevronsUpDown className="ml-2 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showAll && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <EventGroup
                  items={hiddenItems}
                  user={user}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: The Accordion Logic ---
function EventGroup({ items, user, handleEdit, handleDelete }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full duration-200 space-y-3"
    >
      {items.map((ev) => (
        <motion.div key={ev._id} variants={itemVariants}>
          <AccordionItem
            value={ev._id}
            className="group transition-all duration-300 overflow-hidden"
          >
            {/* Header / Trigger */}
            <AccordionTrigger className=" py-3 hover:no-underline [&>svg]:hidden">
              <div className="flex items-center justify-between w-full gap-4">
                {/* --- LEFT: Title & Type --- */}
                <div className="flex flex-col justify-start gap-3">
                  <h3 className="relative font-semibold w-fit text-base md:text-lg leading-none tracking-tight truncate group-hover:text-primary transition-colors flex items-center gap-2">
                    {ev.title}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                  </h3>

                  <div className="flex items-center gap-3">
                    {/* Category Badge */}
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded border transition-colors",
                        getTypeColor(ev.type)
                      )}
                    >
                      {getTypeIcon(ev.type)}
                      <span>{ev.type}</span>
                    </div>

                    {/* Date (Desktop) */}
                    <div className="hidden sm:flex items-center text-xs text-muted-foreground font-medium">
                      <Calendar className="w-3 h-3 mr-1.5 opacity-70" />
                      {new Date(ev.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </div>
                  </div>
                </div>

                {/* --- RIGHT: Actions & Chevron --- */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Admin Controls */}
                  {user && (
                    <div
                      className="flex items-center gap-1 pl-1 md:pl-2 md:border-l md:border-border/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                        onClick={(e) => handleEdit(ev._id, e)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDelete(ev._id, e)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  {/* Custom Animated Chevron */}
                  <div className="pl-1 text-muted-foreground/50 group-hover:text-foreground transition-colors">
                    <ChevronDown className="h-5 w-5 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            {/* Content Body */}
            <AccordionContent className="pb-4 ">
              <div className="pt-4 border-t border-dashed mt-1">
                {/* Mobile Meta (Visible only on small screens) */}
                <div className="flex sm:hidden items-center gap-2 pb-4 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(ev.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {/* Main Content */}
                <div className="flex flex-col space-y-4 animate-in slide-in-from-top-2 duration-300">
                  {/* Description */}
                  {ev.description ? (
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-muted-foreground mb-2 tracking-wider">
                        Story
                      </h4>
                      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {ev.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No additional details provided.
                    </p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
}

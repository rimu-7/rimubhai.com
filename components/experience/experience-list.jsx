"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Calendar,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronsUpDown,
  ChevronsDownUp,
  Building2,
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

export default function ExperienceList({ user }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await fetch("/api/experience");
      const json = await res.json();
      setExperiences(json.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this experience?")) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExperiences((prev) => prev.filter((item) => item._id !== id));
        toast.success("Experience deleted");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    window.location.href = `/admin/experience?edit=${id}`;
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed text-sm animate-in fade-in zoom-in-95">
        <Layers className="w-8 h-8 mb-3 opacity-20" />
        <p>No experience added yet.</p>
      </div>
    );
  }

  // --- LOGIC: Split Top 5 vs Rest ---
  const visibleItems = experiences.slice(0, 5);
  const hiddenItems = experiences.slice(5);
  const hasHiddenItems = hiddenItems.length > 0;

  return (
    <div className="w-full space-y-6 py-10">
      {/* 1. Initial 5 Items */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-3"
      >
        <ExperienceGroup
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
                <ExperienceGroup
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
function ExperienceGroup({ items, user, handleEdit, handleDelete }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full duration-200 space-y-3"
    >
      {items.map((exp) => (
        <motion.div key={exp._id} variants={itemVariants}>
          <AccordionItem
            value={exp._id}
            className="group transition-all duration-300 overflow-hidden"
          >
            {/* Header / Trigger */}
            <AccordionTrigger className="py-3 hover:no-underline [&>svg]:hidden">
              <div className="flex items-center justify-between w-full gap-4">
                {/* --- LEFT: Role & Company --- */}
                <div className="flex flex-col justify-start gap-3">
                  <h3 className="relative font-semibold w-fit text-base md:text-lg leading-none tracking-tight truncate group-hover:text-primary transition-colors flex items-center gap-2">
                    {exp.role}
                    {/* Animated Underline Effect */}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                  </h3>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Company Name */}
                    <div className="flex items-center text-xs text-muted-foreground font-medium">
                      <Building2 className="w-3 h-3 mr-1.5 opacity-70" />
                      {exp.company}
                    </div>

                    {/* Date / Current Status */}
                    <div
                      className={cn(
                        "hidden sm:flex gap-2 items-center text-xs font-medium shrink-0 py-0.5 px-2 rounded-md transition-colors",
                        exp.current
                          ? ""
                          : "bg-muted/50 text-muted-foreground border-transparent group-hover:border-border/50"
                      )}
                    >
                      {exp.current ? (
                        <span className="relative flex h-2 w-2">
                          {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span> */}
                          <span className="relative inline-flex group-hover:animate-ping rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      ) : (
                        <Calendar className="w-3 h-3 opacity-70" />
                      )}

                      <span>
                        {exp.current
                          ? ""
                          : new Date(exp.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                      </span>
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
                        onClick={(e) => handleEdit(exp._id, e)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDelete(exp._id, e)}
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
            <AccordionContent className="">
              <div className="border-t border-dashed border-border"></div>
              <div className="pt-4 mt-1">
                {/* Mobile Meta (Visible only on small screens) */}
                <div className="flex sm:hidden items-center gap-3 pb-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(exp.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                    {" - "}
                    {exp.current
                      ? "Present"
                      : new Date(exp.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                  </span>
                  {exp.current && (
                    <span className="text-green-600 font-medium flex items-center gap-1.5 ml-auto">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                      </span>
                      Current
                    </span>
                  )}
                </div>

                {/* Main Content (No Grid needed for single column text) */}
                <div className="flex flex-col space-y-6 animate-in slide-in-from-top-2 duration-300">
                  {/* Description */}
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-muted-foreground mb-2 tracking-wider">
                      Responsibilities
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  </div>

                  {/* Skills & Type */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="space-y-2 flex-1">
                        <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.skills.map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-[10px] px-2.5 py-0.5 h-6 rounded-md bg-background border-border/50 text-muted-foreground font-medium"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Employment Type Badge */}
                    <Badge
                      variant="ghost"
                      className="self-start  rounded sm:self-end text-[10px] h-6 px-3 bg-accent shrink-0"
                    >
                      {exp.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
}

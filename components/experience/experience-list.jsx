"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Calendar,
  Pencil,
  Trash2,
  ChevronDown, // Used for the "Show More" button icon
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
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 50, damping: 15 },
  },
};

// --- CUSTOM CHEVRON (Matches Project List) ---
const CustomChevron = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// --- DATE FORMATTER ---
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
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
    if (!confirm("Are you sure you want to delete this experience?")) return;

    const previous = [...experiences];
    setExperiences((prev) => prev.filter((item) => item._id !== id));

    try {
      const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Experience deleted");
    } catch (error) {
      setExperiences(previous);
      toast.error("Delete failed");
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    window.location.href = `/admin/experience?edit=${id}`;
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full rounded" />
            <Skeleton className="h-px w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-y border-dashed">
        <Briefcase className="w-12 h-12 mb-4 opacity-10" />
        <p className="font-medium">No experience added.</p>
      </div>
    );
  }

  // Logic: Split Top 5 vs Rest
  const visibleItems = experiences.slice(0, 5);
  const hiddenItems = experiences.slice(5);

  return (
    <div className="w-full space-y-16">
      {/* --- MAIN LIST --- */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
          <div className="h-px bg-border flex-1" />
          <span>Work History</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <ExperienceGroup
          items={visibleItems}
          user={user}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          defaultOpen={visibleItems[0]?._id}
        />
      </motion.div>

      {/* --- HIDDEN ITEMS (Show More) --- */}
      {hiddenItems.length > 0 && (
        <div className="space-y-8">
          {!showAll ? (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(true)}
                className="group rounded px-8 border-dashed border-border hover:border-foreground/30 transition-all"
              >
                View Older Roles ({hiddenItems.length})
                <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Button>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">
                <div className="h-px bg-border flex-1" />
                <span>Previous Roles</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <ExperienceGroup
                items={hiddenItems}
                user={user}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />

              <div className="flex justify-center mt-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Show Less
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// --- REUSABLE EXPERIENCE GROUP ---
function ExperienceGroup({
  items,
  user,
  handleEdit,
  handleDelete,
  defaultOpen,
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
    >
      {items.map((exp, index) => (
        <motion.div key={exp._id} variants={itemVariants} layout>
          <AccordionItem
            value={exp._id}
            className="group border-b border-border/40 last:border-0 data-[state=open]:border-transparent transition-colors px-0"
          >
            {/* --- TRIGGER --- */}
            <AccordionTrigger className="hover:no-underline py-5 px-0 [&[data-state=open]_.custom-chevron]:rotate-180">
              <div className="flex items-center justify-between w-full gap-4 md:gap-6 pr-2">
                {/* Left: Index & Role Info */}
                <div className="flex items-start md:items-center gap-4 text-left min-w-0 flex-1">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 overflow-hidden">
                    {/* Role Title */}
                    <h3 className="relative text-lg md:text-xl font-medium tracking-tight truncate pr-1 lowercase">
                      {exp.role}
                      <span className="absolute left-0 bottom-0 h-[1.5px] w-full bg-foreground scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                    </h3>

                    {/* Company Name */}
                    <span className="text-muted-foreground text-sm md:text-base truncate">
                      @ {exp.company}
                    </span>
                  </div>
                </div>

                {/* Right: Meta, Actions, Chevron */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  {/* Date & Current Status */}
                  <div className="hidden md:flex flex-col items-end text-xs md:text-sm text-muted-foreground font-mono">
                    <span
                      className={cn(
                        "flex items-center gap-2",
                        exp.current && "text-foreground font-medium"
                      )}
                    >
                      {exp.current && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>

                  {/* Admin Actions */}
                  {user && (
                    <div
                      className="flex items-center gap-1 pl-2 border-l border-border/50 ml-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                        onClick={(e) => handleEdit(exp._id, e)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDelete(exp._id, e)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            {/* --- CONTENT --- */}
            <AccordionContent className="pb-8 px-0">
              <div className="grid grid-cols-1 gap-4 pt-2 animate-in  duration-300">
                {/* Left Column (Empty on desktop, holds Date on mobile) */}
                <div className="flex md:hidden flex-col gap-1 mb-4 border-l-2 border-border ">
                  <span className="text-xs uppercase font-bold text-muted-foreground">
                    Duration
                  </span>
                  <span className="text-sm font-mono flex items-center gap-2">
                    {formatDate(exp.startDate)} —{" "}
                    {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="hidden md:block"></div>{" "}
                {/* Spacer for desktop grid */}
                {/* Right Column: Content */}
                <div className="space-y-6">
                  {/* Description */}
                  <div className="space-y-2">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {exp.description}
                    </p>
                  </div>

                  {/* Meta Footer: Tech Stack + Type */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    {/* Tech Stack */}
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="px-2.5 rounded py-0.5 text-xs font-normal text-muted-foreground border-border/60 bg-transparent hover:bg-foreground/10"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Employment Type & Full Date (Desktop tooltip/info) */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {/* Desktop Start Date hint */}
                      <span className="hidden md:inline-block font-mono opacity-50">
                        Started {formatDate(exp.startDate)}
                      </span>

                      <Badge
                        variant="secondary"
                        className="rounded font-normal bg-secondary/50 text-foreground/80 hover:bg-foreground/10"
                      >
                        {exp.type}
                      </Badge>
                    </div>
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

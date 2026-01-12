"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Award,
  FileText,
  GraduationCap,
  Medal,
  ExternalLink,
  Calendar,
  Pencil,
  Trash2,
  ChevronDown,
  Layers,
  Sparkles,
  Link as LinkIcon,
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

// --- CONFIG: TYPE ICONS & COLORS ---
const getTypeConfig = (type) => {
  const t = type?.toLowerCase();
  switch (t) {
    case "publication":
      return { 
        icon: FileText, 
        color: "text-blue-500", 
        bg: "bg-blue-500/10", 
        border: "border-blue-500/20" 
      };
    case "sports":
      return { 
        icon: Medal, 
        color: "text-emerald-500", 
        bg: "bg-emerald-500/10", 
        border: "border-emerald-500/20" 
      };
    case "education":
      return { 
        icon: GraduationCap, 
        color: "text-violet-500", 
        bg: "bg-violet-500/10", 
        border: "border-violet-500/20" 
      };
    case "certification":
      return { 
        icon: Award, 
        color: "text-orange-500", 
        bg: "bg-orange-500/10", 
        border: "border-orange-500/20" 
      };
    default: // Generic Award / Trophy
      return { 
        icon: Trophy, 
        color: "text-amber-500", 
        bg: "bg-amber-500/10", 
        border: "border-amber-500/20" 
      };
  }
};

// --- CUSTOM CHEVRON ---
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

export default function AwardList({ user }) {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const res = await fetch("/api/awards");
      const json = await res.json();
      setAwards(json.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load awards");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this award?")) return;
    
    const previous = [...awards];
    setAwards((prev) => prev.filter((item) => item._id !== id));

    try {
      const res = await fetch(`/api/awards/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Award deleted");
    } catch (error) {
      setAwards(previous);
      toast.error("Delete failed");
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    window.location.href = `/admin/awards?edit=${id}`;
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full rounded-none" />
            <Skeleton className="h-px w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (awards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-y border-dashed">
        <Trophy className="w-12 h-12 mb-4 opacity-10" />
        <p className="font-medium">No awards added.</p>
      </div>
    );
  }

  // Logic: Split Top 5 vs Rest
  const visibleItems = awards.slice(0, 5);
  const hiddenItems = awards.slice(5);

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
            <span>Accomplishments</span>
            <div className="h-px bg-border flex-1" />
        </div>

        <AwardGroup
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
                className="group rounded-full px-8 border-dashed border-border hover:border-foreground/30 transition-all"
              >
                View Archive ({hiddenItems.length})
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
                <span>Archive</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <AwardGroup
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

// --- SUB-COMPONENT: Accordion Group ---
function AwardGroup({ items, user, handleEdit, handleDelete, defaultOpen }) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen} className="">
      {items.map((item) => {
        const config = getTypeConfig(item.type);
        const Icon = config.icon;

        return (
          <motion.div key={item._id} variants={itemVariants} layout>
            <AccordionItem
              value={item._id}
              className="group border-b border-border/40 last:border-0 data-[state=open]:border-transparent transition-colors px-0"
            >
              {/* --- TRIGGER --- */}
              <AccordionTrigger className="hover:no-underline py-5 px-0 [&[data-state=open]_.custom-chevron]:rotate-180">
                <div className="flex items-center justify-between w-full gap-4 md:gap-6 pr-2">
                  
                  {/* Left: Icon & Content */}
                  <div className="flex items-center gap-4 text-left min-w-0 flex-1">
                    
                    {/* Type Icon */}
                    <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors duration-300",
                        "bg-secondary/50 group-hover:bg-secondary", 
                        config.color.replace('text-', 'text-opacity-80 ')
                    )}>
                        <Icon className="w-4 h-4" />
                    </div>
                    
                    {/* Title & Issuer */}
                    <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 overflow-hidden">
                      <h3 className="relative text-lg md:text-xl font-medium tracking-tight truncate pr-1">
                        {item.title}
                        <span className="absolute left-0 bottom-0 h-[1.5px] w-full bg-foreground scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                      </h3>
                      
                      {item.issuer && (
                        <span className="text-muted-foreground text-sm text-wrap truncate">
                           @ {item.issuer}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Date, Actions, Chevron */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    
                    {/* Year (Desktop) */}
                    <div className="hidden md:block text-sm text-muted-foreground font-mono">
                         {new Date(item.date).getFullYear()}
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
                          onClick={(e) => handleEdit(item._id, e)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDelete(item._id, e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}

                    {/* Custom Chevron */}
                    <div className="pl-2">
                        <CustomChevron className="custom-chevron h-5 w-5 text-muted-foreground/30 transition-transform duration-300 ease-in-out shrink-0" />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              {/* --- CONTENT --- */}
              <AccordionContent className="pb-8 px-0">
                 {/* Grid layout */}
                 <div className="grid grid-cols-1 md:grid-cols-[48px_1fr] gap-4 pt-2 animate-in slide-in-from-top-2 duration-300">
                    
                    {/* Spacer */}
                    <div className="hidden md:block"></div> 

                    {/* Content */}
                    <div className="space-y-6">
                        
                        {/* Mobile Date */}
                        <div className="flex md:hidden items-center gap-2 text-xs font-mono text-muted-foreground border-l-2 border-border pl-3">
                           <Calendar className="w-3 h-3" />
                           {new Date(item.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            {item.description ? (
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                                    {item.description}
                                </p>
                            ) : (
                                <p className="text-muted-foreground/50 italic text-sm">No additional details.</p>
                            )}
                        </div>

                        {/* Footer: Tags & Link */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                             
                             {/* Tag */}
                             <Badge 
                                variant="outline" 
                                className={cn("px-2.5 py-0.5 text-xs font-medium border capitalize", config.color, config.bg, config.border)}
                            >
                                {item.type}
                            </Badge>

                            {/* External Link */}
                            {item.link && (
                                <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-xs h-8 gap-2 rounded-full border-dashed"
                                >
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Credential <ExternalLink className="w-3 h-3" />
                                </a>
                                </Button>
                            )}
                        </div>
                    </div>
                 </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        );
      })}
    </Accordion>
  );
}
"use client";

import { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  Trash2,
  Pencil,
  Layers,
  ChevronDown,
  ArrowRight,
  Lock,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ProjectList({ user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      setProjects(json.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;

    const previousProjects = [...projects];
    setProjects((prev) => prev.filter((p) => p._id !== id));

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Project deleted");
    } catch (error) {
      setProjects(previousProjects);
      toast.error("Delete failed");
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    window.location.href = `/admin/projects?edit=${id}`;
  };

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

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

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-y border-dashed">
        <Layers className="w-12 h-12 mb-4 opacity-10" />
        <p className="font-medium">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-16">
      {/* --- FEATURED SECTION --- */}
      {featuredProjects.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            <div className="h-px bg-border flex-1" />
            <span>Featured Work</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <ProjectGroup
            items={featuredProjects}
            user={user}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            defaultOpen={featuredProjects[0]?._id}
          />
        </motion.div>
      )}

      {/* --- ARCHIVE SECTION --- */}
      {otherProjects.length > 0 && (
        <div className="space-y-8">
          {!showAll ? (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(true)}
                className="group rounded-full px-8 border-dashed border-border hover:border-foreground/30 transition-all"
              >
                View Archive ({otherProjects.length})
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

              <ProjectGroup
                items={otherProjects}
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
                  Hide Archive
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

// --- REUSABLE ACCORDION GROUP ---
function ProjectGroup({ items, user, handleEdit, handleDelete }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Accordion
        type="single"
        collapsible
        className="w-full"
      >
        {items.map((project, index) => (
          <motion.div key={project._id} variants={itemVariants} layout>
            <AccordionItem
              value={project._id}
              className="group border-b border-border/40 last:border-0 data-[state=open]:border-transparent transition-colors px-0"
            >
              {/* --- TRIGGER --- */}
              <AccordionTrigger className="hover:no-underline py-5 px-0 [&[data-state=open]>div>div>svg.chevron]:rotate-180">
                <div className="flex items-center justify-between w-full gap-4 md:gap-6 pr-2">
                  {/* Left: Index & Title */}
                  <div className="flex items-baseline gap-4 text-left min-w-0 flex-1">
                    <h3 className="relative text-lg md:text-xl font-medium tracking-tight truncate pr-4">
                      {project.title}
                      {/* Hover Underline Animation */}
                      <span className="absolute left-0 bottom-0 h-[1.5px] w-full bg-foreground scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                    </h3>
                  </div>

                  {/* Right: Actions & Chevron */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {/* Public Actions (Live / Repo) - Visible when closed */}
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Live Link */}
                      {project.liveUrl && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                              asChild
                            >
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Visit Live Site</TooltipContent>
                        </Tooltip>
                      )}

                      {/* Repo or Private Lock */}
                      {project.repoUrl ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
                              asChild
                            >
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Source Code</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center h-8 w-8 text-muted-foreground/40 cursor-not-allowed">
                              <Lock className="h-3.5 w-3.5" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Private Repository</TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    {/* Admin Actions (Separated by divider) */}
                    {user && (
                      <div
                        className="flex items-center gap-1 pl-2 border-l border-border/50 ml-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                          onClick={(e) => handleEdit(project._id, e)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDelete(project._id, e)}
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
                <div className="grid grid-cols-1 md:grid-cols-[40%_1fr] gap-8 pt-2 animate-in slide-in-from-top-2 duration-300">
                  {/* 1. Visual/Media */}
                  <div className="space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted/30">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                          No Preview
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Details */}
                  <div className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        About Project
                      </h4>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                        {project.description}
                      </p>
                    </div>

                    {project.tags && project.tags.length > 0 && (
                      <div className="space-y-3">
                        <div className="h-px w-full bg-border/50" />
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="px-2.5 py-0.5 text-xs font-normal text-muted-foreground bg-secondary/50 hover:bg-secondary transition-colors border border-transparent hover:border-border/50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Detailed Buttons inside expanded view (Optional redundancy) */}
                    <div className="flex gap-3 md:hidden">
                         {/* Only show these big buttons on mobile where hover tooltips might be harder to use */}
                         {project.liveUrl && (
                             <Button variant="outline" size="sm" asChild className="w-full">
                                 <a href={project.liveUrl} target="_blank">Live Site</a>
                             </Button>
                         )}
                         {project.repoUrl && (
                             <Button variant="outline" size="sm" asChild className="w-full">
                                 <a href={project.repoUrl} target="_blank">Code</a>
                             </Button>
                         )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </TooltipProvider>
  );
}
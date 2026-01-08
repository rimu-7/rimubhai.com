"use client";

import { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  Trash2,
  Pencil,
  Calendar,
  Layers,
  ChevronDown,
  ChevronsUpDown,
  ChevronsDownUp,
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
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        toast.success("Project deleted");
      }
    } catch (error) {
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
      <div className="space-y-4 max-w-4xl mx-auto py-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/30 rounded-xl border border-dashed animate-in fade-in zoom-in-95">
        <Layers className="w-10 h-10 mb-4 opacity-20" />
        <p>No projects found yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 py-8">
      {/* --- SECTION 1: FEATURED --- */}
      {featuredProjects.length > 0 && (
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          <ProjectGroup
            items={featuredProjects}
            user={user}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </motion.section>
      )}

      {/* --- SECTION 2: OTHER PROJECTS  --- */}
      {otherProjects.length > 0 && (
        <section className="space-y-6">
          {/* Divider with Centered Button */}
          <div className="relative py-4">
            <div className="relative flex justify-center text-xs uppercase">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="bg-background px-6 text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-all rounded-full border-dashed shadow-sm"
              >
                {showAll ? (
                  <>
                    Archive projects <ChevronsDownUp className="ml-2 h-3 w-3" />
                  </>
                ) : (
                  <>
                    View All Projects{" "}
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
                <div className="pt-2 pb-8">
                  <ProjectGroup
                    items={otherProjects}
                    user={user}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}

// --- The Accordion Group ---
function ProjectGroup({ items, user, handleEdit, handleDelete }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full  rounded-md duration-200 space-y-3"
    >
      {items.map((project) => (
        <motion.div key={project._id} variants={itemVariants}>
          <AccordionItem
            value={project._id}
            className="group px-2 md:px-0 transition-all duration-300 overflow-hidden"
          >
            {/* Header / Trigger */}
            <AccordionTrigger className="py-3 hover:no-underline [&>svg]:hidden">
              <div className="flex items-center justify-between w-full gap-4">
                {/* --- LEFT: Title & Date --- */}
                <div className="flex flex-col justify-start gap-3">
                  <h3 className="relative font-semibold w-fit text-base md:text-lg leading-none tracking-tight truncate group-hover:text-primary transition-colors">
                    {project.title.length > 30
                      ? project.title.slice(0, 30) + "..."
                      : project.title}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                  </h3>

                  {/* <div className="hidden sm:flex gap-2 items-center text-xs text-muted-foreground font-medium shrink-0 py-0.5 rounded-md group-hover:border-border/50 transition-colors">
                    <Calendar className="w-3 h-3 opacity-70" />
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </div> */}
                </div>

                {/* --- RIGHT: Actions & Chevron --- */}
                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className="hidden md:flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.liveUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Live Site"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                    {project.repoUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="GitHub"
                        >
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {user && (
                    <div
                      className="flex items-center gap-1 pl-1 md:pl-2 md:border-l md:border-border/50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                        onClick={(e) => handleEdit(project._id, e)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDelete(project._id, e)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  <div className="pl-1 text-muted-foreground/50 group-hover:text-foreground transition-colors">
                    <ChevronDown className="h-5 w-5 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            {/* Content Body */}
            <AccordionContent className="pb-4">
              <div className="pt-2 border-t border-dashed border-border/60 mt-1">
                {/* Mobile Links */}
                <div className="flex md:hidden items-center gap-3 py-3 mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Links:
                  </span>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" /> Live Demo
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-foreground bg-muted px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors"
                    >
                      <Github className="h-3 w-3" /> Source Code
                    </a>
                  )}
                </div>

                {/* Main Grid: Image + Content */}
                <div className="grid grid-cols-1 px-2 md:grid-cols-[240px_1fr] gap-6 animate-in slide-in-from-top-2 duration-300 items-start">
                  {/* --- PROJECT IMAGE --- */}
                  <div className="w-full rounded-md overflow-hidden border bg-muted shadow-sm group-hover:shadow transition-all self-start">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        width={0}
                        height={0}
                        sizes="(max-width: 768px) 100vw, 240px"
                        className="w-full h-auto transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      // Placeholder needs fixed height to look good empty
                      <div className="flex h-32 items-center justify-center text-muted-foreground text-xs bg-muted/50">
                        No Preview
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="pb-2 text-lg">{project.title}</h3>
                      <h4 className="text-[10px] uppercase font-bold text-muted-foreground mb-2 tracking-wider">
                        About Project
                      </h4>
                      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {project.description}
                      </p>
                    </div>

                    {project.tags && project.tags.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-[10px] px-2.5 py-0.5 h-6 rounded-md bg-background border-border/50 text-muted-foreground font-medium"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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

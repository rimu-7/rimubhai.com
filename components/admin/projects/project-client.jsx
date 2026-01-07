"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import Container from "../../Container";

export default function ProjectManagerClient() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Local state for Featured toggle
  const [isFeatured, setIsFeatured] = useState(false);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const json = await res.json();
      setProjects(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
        toast.success("Project deleted");
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    // Manually append the Featured state
    formData.append("featured", isFeatured);

    try {
      const url = editingProject
        ? `/api/projects/${editingProject._id}`
        : "/api/projects";

      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Operation failed");

      toast.success(editingProject ? "Project updated" : "Project created");
      setIsDialogOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setIsFeatured(project.featured || false);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingProject(null);
    setIsFeatured(false);
    setIsDialogOpen(true);
  };

  if (loading)
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <Container className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Manager</h1>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project._id}
            className="overflow-hidden flex flex-col group relative"
          >
            {/* Featured Badge */}
            {project.featured && (
              <Badge className="absolute top-2 right-2 z-10 bg-yellow-500 hover:bg-yellow-600 text-white border-0 shadow-sm">
                <Star className="w-3 h-3 mr-1 fill-current" /> Featured
              </Badge>
            )}

            <div className="relative h-48 w-full bg-muted border-b">
              {project.imageUrl && (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
              {project.tags && project.tags.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {project.tags.slice(0, 3).map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4 bg-muted/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEdit(project)}
              >
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(project._id)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* DIALOG FORM */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "New Project"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {/* Top Row */}
            <div className="grid grid-cols-[1fr,auto] gap-4 items-start">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  name="title"
                  defaultValue={editingProject?.title}
                  required
                />
              </div>

              {/* Featured Switch */}
              <div className="space-y-2 flex flex-col items-center pt-1">
                <Label className="mb-2 text-xs">Featured</Label>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Image</Label>

              <div className="flex items-center gap-4 rounded-md border bg-muted/10 p-3">
                {editingProject?.imageUrl && (
                  <div className="relative h-16 w-16 overflow-hidden rounded">
                    <Image
                      src={editingProject.imageUrl}
                      alt="Current project image"
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                )}

                <Input name="image" type="file" accept="image/*" />
              </div>

              <p className="text-xs text-muted-foreground">
                {editingProject
                  ? "Leave empty to keep existing image"
                  : "Required for new projects"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                name="tags"
                defaultValue={editingProject?.tags?.join(", ")}
                placeholder="React, Node, Tailwind"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                defaultValue={editingProject?.description}
                required
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input
                  name="liveUrl"
                  defaultValue={editingProject?.liveUrl}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub Repo</Label>
                <Input
                  name="repoUrl"
                  defaultValue={editingProject?.repoUrl}
                  placeholder="https://github.com..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="w-full md:w-auto min-w-[150px]"
                disabled={submitting}
              >
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingProject ? "Save Changes" : "Create Project"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

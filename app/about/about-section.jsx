"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Pencil, Trash2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/about/RichTextEditor";
import Container from "../../components/Container";

export default function AboutSection({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", content: "", onGoing: false });
  const [isCreating, setIsCreating] = useState(false); // Distinguish between Create and Edit
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/about");
      const json = await res.json();
      if (res.ok && json.data && json.data.length > 0) {
        setData(json.data[0]);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  // Open Dialog for Create
  const openCreateDialog = () => {
    setFormData({ name: "", content: "", onGoing: false });
    setIsCreating(true);
    setIsDialogOpen(true);
  };

  // Open Dialog for Edit
  const openEditDialog = () => {
    if (!data) return;
    setFormData({ name: data.name, content: data.content, onGoing: data.onGoing });
    setIsCreating(false);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    if (!data) return;

    try {
      const res = await fetch(`/api/about/${data._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData(null);
    } catch (error) {
      alert("Error deleting item");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isCreating ? "/api/about" : `/api/about/${data._id}`;
      const method = isCreating ? "POST" : "PUT";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      const savedItem = await res.json();
      
      // If your API returns the object directly or wrapped in { data: ... }
      // adjust accordingly. Assuming standard response here:
      setData(savedItem.data || savedItem); 
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

// Add this import at the top

// ... existing code ...

  if (loading) {
    return (
      <Container>
        <div className="w-full mx-auto py-8">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border/40">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48 md:w-64 rounded-lg" />
            </div>
            {/* Optional: Mimic the admin buttons if you want, but usually not needed for public loading */}
          </div>

          {/* Body Content Skeleton - Mimicking natural text flow */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[98%]" />
            <Skeleton className="h-4 w-[85%]" />
            
            <div className="h-4" /> {/* Spacer */}
            
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </Container>
    );
  }

// ... rest of the code ...

  // --- Empty State ---
  if (!data) {
    if (!user) return null; 
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted rounded-xl bg-muted/5">
          <Sparkles className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-muted-foreground">About Section is Empty</h3>
          <p className="text-sm text-muted-foreground/60 mb-6">Start by introducing yourself.</p>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" /> Create Introduction
          </Button>
        </div>
        {renderDialog()}
      </Container>
    );
  }

  // --- Main Display ---
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative group w-full mx-auto py-8"
      >
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="space-y-1">
            <motion.h2 
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground"
            >
              {data.name}
            </motion.h2>
            {/* Optional status indicator if needed */}
            {/* {data.onGoing && (
              <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest">
                Currently Active
              </span>
            )} */}
          </div>

          {/* Admin Controls - Visible on hover/focus if user exists */}
          {user && (
            <div className="flex items-center gap-2 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="outline"
                size="sm"
                onClick={openEditDialog}
                className="h-8 text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="relative">
          <div
            className="
              prose prose-lg prose-neutral dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-foreground/90
              prose-p:leading-8 prose-p:text-muted-foreground prose-p:font-light
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md prose-img:border prose-img:border-border/50
              prose-li:text-muted-foreground
            "
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </motion.div>

      {renderDialog()}
    </Container>
  );

  // --- Helper to render the Dialog (avoiding code duplication) ---
  function renderDialog() {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {isCreating ? "Create Introduction" : "Edit Introduction"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-6 pt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Section Title</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. About Me"
                  className="bg-muted/30"
                />
              </div>

              <div className="flex flex-col justify-end pb-1">
                <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/30">
                  <Label htmlFor="ongoing-switch" className="cursor-pointer text-sm font-medium">
                    Status: <span className="text-muted-foreground font-normal">{formData.onGoing ? "Active" : "Standard"}</span>
                  </Label>
                  <Switch
                    id="ongoing-switch"
                    checked={formData.onGoing}
                    onCheckedChange={(checked) => setFormData({ ...formData, onGoing: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Biography Content</Label>
              <div className="border rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <RichTextEditor
                  content={formData.content}
                  onChange={(html) => setFormData({ ...formData, content: html })}
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="min-w-[120px]">
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  isCreating ? "Create" : "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}
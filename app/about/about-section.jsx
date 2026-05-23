"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Loader2, Pencil, Trash2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/about/RichTextEditor";

const ease = [0.22, 1, 0.36, 1];

export default function AboutSection({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", content: "", onGoing: false });
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/about");
      const json = await res.json();
      if (res.ok && json.data?.length > 0) setData(json.data[0]);
      else setData(null);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => { setFormData({ name: "", content: "", onGoing: false }); setIsCreating(true); setIsDialogOpen(true); };
  const openEditDialog = () => { if (!data) return; setFormData({ name: data.name, content: data.content, onGoing: data.onGoing }); setIsCreating(false); setIsDialogOpen(true); };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    if (!data) return;
    try {
      const res = await fetch(`/api/about/${data._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setData(null);
    } catch { alert("Error deleting item"); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isCreating ? "/api/about" : `/api/about/${data._id}`;
      const method = isCreating ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error("Failed to save");
      const savedItem = await res.json();
      setData(savedItem.data || savedItem);
      setIsDialogOpen(false);
    } catch { alert("Save failed"); } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-border/30">
          <Skeleton className="h-8 w-48 md:w-64 rounded-lg" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[96%]" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </section>
    );
  }

  if (!data) {
    if (!user) return null;
    return (
      <section className="py-16 md:py-20">
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-muted rounded-xl bg-muted/5">
          <Sparkles className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
          <h3 className="text-base font-semibold text-muted-foreground">About Section is Empty</h3>
          <p className="text-sm text-muted-foreground/50 mb-5">Start by introducing yourself.</p>
          <Button size="sm" onClick={openCreateDialog}><Plus className="w-3.5 h-3.5 mr-1.5" />Create</Button>
        </div>
        {renderDialog()}
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 group">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{data.name}</h2>
          {user && (
            <div className="flex items-center gap-2 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button variant="outline" size="sm" onClick={openEditDialog} className="h-7 text-xs">
                <Pencil className="w-3 h-3 mr-1" />Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDelete} className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground/90 prose-p:leading-7 prose-p:text-muted-foreground prose-p:text-[15px] md:prose-p:text-base prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-border/50 prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </motion.div>
      {renderDialog()}
    </section>
  );

  function renderDialog() {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-lg">{isCreating ? "Create Introduction" : "Edit Introduction"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSave} className="space-y-5 pt-4">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Section Title</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. About Me" className="bg-muted/30" />
              </div>
              <div className="flex flex-col justify-end pb-1">
                <div className="flex items-center justify-between border p-3 rounded-lg bg-muted/30">
                  <Label htmlFor="ongoing-switch" className="cursor-pointer text-sm font-medium">
                    Status: <span className="text-muted-foreground font-normal">{formData.onGoing ? "Active" : "Standard"}</span>
                  </Label>
                  <Switch id="ongoing-switch" checked={formData.onGoing} onCheckedChange={(checked) => setFormData({ ...formData, onGoing: checked })} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Biography Content</Label>
              <div className="border rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <RichTextEditor content={formData.content} onChange={(html) => setFormData({ ...formData, content: html })} />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} className="min-w-[100px]">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : isCreating ? "Create" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

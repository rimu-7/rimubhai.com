"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/about/RichTextEditor";
import Container from "../components/Container";

export default function AboutSection({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/about/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingItem.name,
          content: editingItem.content,
          onGoing: editingItem.onGoing,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      setData(editingItem);
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    // Implement create logic here
    alert("Implement your Create POST logic here!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data && user) {
    return (
      <div className="text-center space-y-4 py-8">
        <p className="text-muted-foreground">No 'About' section found.</p>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Create About Section
        </Button>
      </div>
    );
  }

  if (!data && !user) return null;

  return (
    <Container>
      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full justify-start"
      >
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="flex flex-row items-start justify-between pt-0 px-0">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {data.name}
                </CardTitle>
                {/* {data.onGoing && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-500/30 bg-green-500/10 px-3 py-1"
                  >
                    <Sparkles className="w-3 h-3 mr-1" /> Ongoing
                  </Badge>
                )} */}
              </div>
              {/* <CardDescription className="text-sm text-muted-foreground">
                Last updated: {new Date(data.updatedAt).toLocaleDateString()}
              </CardDescription> */}
            </div>

            {/* Admin Actions */}
            {user && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingItem(data);
                    setIsEditOpen(true);
                  }}
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Pencil className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent className="px-0">
            <div
              className="
                prose prose-neutral dark:prose-invert max-w-none leading-relaxed
                prose-headings:font-bold prose-headings:text-foreground
                prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-lg
              "
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit About Section</DialogTitle>
          </DialogHeader>

          {editingItem && (
            <form onSubmit={handleUpdate} className="space-y-6 pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    placeholder="e.g. My Biography"
                  />
                </div>

                <div className="flex flex-col justify-end pb-2">
                  <div className="flex items-center justify-between border p-3 rounded-lg bg-secondary/20">
                    <Label className="cursor-pointer" htmlFor="ongoing-switch">
                      Status: {editingItem.onGoing ? "Ongoing" : "Completed"}
                    </Label>
                    <Switch
                      id="ongoing-switch"
                      checked={editingItem.onGoing}
                      onCheckedChange={(checked) =>
                        setEditingItem({ ...editingItem, onGoing: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <div className="border rounded-md overflow-hidden">
                  <RichTextEditor
                    content={editingItem.content}
                    onChange={(html) =>
                      setEditingItem({ ...editingItem, content: html })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-w-[120px]"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

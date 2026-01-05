"use client";

import { useState, useEffect } from "react";
import { 
  Loader2, 
  Plus, 
  Pencil, 
  Trash2, 
  FileText, 
  Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import RichTextEditor from "@/components/about/RichTextEditor"; // Your existing editor

export default function BlogManager() {
  // State
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Edit State (null = create mode)
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    featured: false,
  });

  // --- 1. FETCH POSTS ---
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      const json = await res.json();
      
      if (res.ok) {
        setPosts(json.data || []);
      } else {
        toast.error("Failed to fetch blogs");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- 2. HANDLERS ---
  const handleEditClick = (post) => {
    setEditingId(post._id);
    setFormData({
      name: post.name,
      content: post.content,
      featured: post.featured,
    });
    setIsDialogOpen(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({ name: "", content: "", featured: false });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      
      toast.success("Post deleted");
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      toast.error("Could not delete post");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      return toast.error("Title and Content are required");
    }

    setSaving(true);
    try {
      const isEditing = !!editingId;
      const url = isEditing ? `/api/blogs/${editingId}` : "/api/blogs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Something went wrong");

      toast.success(isEditing ? "Blog updated!" : "Blog created!");
      setIsDialogOpen(false);
      fetchPosts(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // --- 3. RENDER ---
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your articles and tutorials.</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>

      {/* Blog Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-2 text-lg font-semibold">No posts yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first blog post to get started.</p>
            <Button onClick={handleCreateClick} variant="outline">Create Post</Button>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post._id} className="flex flex-col group overflow-hidden hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="line-clamp-2 text-lg leading-tight">
                    {post.name}
                  </CardTitle>
                  {post.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 pb-3">
                <div className="text-sm text-muted-foreground line-clamp-3 opacity-80">
                  {/* Strip HTML tags for preview */}
                  {post.content.replace(/<[^>]+>/g, '')}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-2 pt-0 border-t bg-muted/20 p-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEditClick(post)}
                  className="h-8 hover:bg-background hover:text-primary"
                >
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(post._id)}
                  className="h-8 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{editingId ? "Edit Post" : "Create New Post"}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 pt-2">
            <form id="blog-form" onSubmit={handleSave} className="space-y-6">
              
              {/* Top Row: Title & Featured */}
              <div className="grid gap-6 md:grid-cols-[1fr,auto]">
                <div className="space-y-2">
                  <Label>Post Title</Label>
                  <Input 
                    placeholder="Enter blog title..." 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="text-lg font-medium"
                  />
                </div>

                <div className="flex flex-col justify-end pb-2">
                   <div className="flex items-center space-x-2 border p-2.5 rounded-lg bg-secondary/20">
                    <Switch 
                      id="featured" 
                      checked={formData.featured}
                      onCheckedChange={(c) => setFormData({...formData, featured: c})}
                    />
                    <Label htmlFor="featured" className="cursor-pointer font-normal text-sm">
                      Featured Post
                    </Label>
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <Label>Content</Label>
                <div className="min-h-[400px] border rounded-md shadow-sm">
                  <RichTextEditor 
                    content={formData.content}
                    onChange={(html) => setFormData({...formData, content: html})}
                  />
                </div>
              </div>

            </form>
          </div>

          <div className="p-4 border-t bg-muted/10 flex justify-end gap-2">
             <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">
                Cancel
             </Button>
             <Button type="submit" form="blog-form" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? "Save Changes" : "Publish Post"}
             </Button>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
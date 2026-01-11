"use client";

import { useState, useEffect } from "react";
import { Trophy, Plus, Pencil, Trash2, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AwardManager() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    link: "",
    type: "award",
  });

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const res = await fetch("/api/awards");
      const json = await res.json();
      setAwards(json.data || []);
    } catch (err) {
      toast.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditingId(item._id);
      setFormData({
        title: item.title,
        issuer: item.issuer,
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : "",
        description: item.description || "",
        link: item.link || "",
        type: item.type || "award",
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", issuer: "", date: "", description: "", link: "", type: "award" });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await fetch(`/api/awards/${id}`, { method: "DELETE" });
      setAwards(prev => prev.filter(a => a._id !== id));
      toast.success("Deleted");
    } catch (e) { toast.error("Error"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingId ? `/api/awards/${editingId}` : "/api/awards";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editingId ? "Updated" : "Created");
      setIsDialogOpen(false);
      fetchAwards();
    } catch (error) { toast.error("Failed"); } 
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" /> Honors & Awards
        </h1>
        <Button onClick={() => handleOpen(null)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="grid gap-4">
        {awards.map((item) => (
          <Card key={item._id} className="group hover:border-foreground/50 transition-all">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <span className="text-xs uppercase font-bold text-muted-foreground border px-1.5 rounded">
                     {item.type}
                   </span>
                  <h3 className="font-bold text-base">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.issuer}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpen(item)}>
                  <Pencil className="h-4 w-4 text-amber-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Award" : "Add Award"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label>Issuer / Org</Label>
                <Input value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label>Category</Label>
                 <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="award">Award 🏆</SelectItem>
                    <SelectItem value="certification">Certificate 📜</SelectItem>
                    <SelectItem value="publication">Publication 📄</SelectItem>
                    <SelectItem value="sports">Sports 🏸</SelectItem>
                    <SelectItem value="education">Education 🎓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label>Link (Optional)</Label>
                <Input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-24" />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
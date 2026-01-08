"use client";

import { useState, useEffect } from "react";
import { Heart, Calendar, Plus, Pencil, Trash2, MapPin } from "lucide-react";
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
import Container from "../Container";

export default function LifeEventManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    type: "milestone",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/life-events");
      const json = await res.json();
      setEvents(json.data || []);
    } catch (err) {
      toast.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (ev = null) => {
    if (ev) {
      setEditingId(ev._id);
      setFormData({
        title: ev.title,
        date: ev.date ? new Date(ev.date).toISOString().split("T")[0] : "",
        description: ev.description || "",
        type: ev.type || "milestone",
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", date: "", description: "", type: "milestone" });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await fetch(`/api/life-events/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Deleted");
    } catch (e) {
      toast.error("Error deleting");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingId
        ? `/api/life-events/${editingId}`
        : "/api/life-events";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success(editingId ? "Updated" : "Created");
      setIsDialogOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <Container>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500" /> Life Events
        </h1>
        <Button onClick={() => handleOpen(null)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <div className="grid gap-4">
        {events.map((ev) => (
          <Card
            key={ev._id}
            className="group hover:border-foreground/50 transition-all"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {new Date(ev.date).getFullYear()}
                  </span>
                  <h3 className="font-bold text-base">{ev.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1 max-w-lg">
                  {ev.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpen(ev)}
                >
                  <Pencil className="h-4 w-4 text-amber-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(ev._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- FORM DIALOG --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Event" : "Add Life Event"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Moved to Tokyo..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) =>
                    setFormData({ ...formData, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milestone">Milestone 🚩</SelectItem>
                    <SelectItem value="travel">Travel ✈️</SelectItem>
                    <SelectItem value="education">Education 🎓</SelectItem>
                    <SelectItem value="personal">Personal 🏠</SelectItem>
                    <SelectItem value="personal">learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Details about this memory..."
                className="h-24"
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Save Changes" : "Add Event"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

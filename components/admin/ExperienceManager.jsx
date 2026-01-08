"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, Calendar, Plus, Pencil, Trash2, Building2 
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    description: "",
    type: "Full-time",
    startDate: "",
    endDate: "",
    current: false,
    skills: ""
  });

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await fetch("/api/experience");
      const json = await res.json();
      setExperiences(json.data || []);
    } catch (err) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (exp = null) => {
    if (exp) {
      setEditingId(exp._id);
      setFormData({
        role: exp.role,
        company: exp.company,
        description: exp.description,
        type: exp.type,
        // Format dates for input type="date" (YYYY-MM-DD)
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : "",
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : "",
        current: exp.current,
        skills: exp.skills ? exp.skills.join(", ") : ""
      });
    } else {
      setEditingId(null);
      setFormData({
        role: "", company: "", description: "", type: "Full-time",
        startDate: "", endDate: "", current: false, skills: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await fetch(`/api/experience/${id}`, { method: "DELETE" });
      setExperiences(prev => prev.filter(e => e._id !== id));
      toast.success("Deleted");
    } catch (e) {
      toast.error("Error deleting");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Prepare payload
    const payload = {
      ...formData,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      // If current is true, force endDate to null
      endDate: formData.current ? null : formData.endDate
    };

    try {
      const url = editingId ? `/api/experience/${editingId}` : "/api/experience";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success(editingId ? "Updated" : "Created");
      setIsDialogOpen(false);
      fetchExperience();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-20 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="w-6 h-6" /> Experience History
        </h1>
        <Button onClick={() => handleOpen(null)}>
          <Plus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp._id} className="group hover:border-foreground/50 transition-all">
            <CardContent className="p-5 flex flex-col md:flex-row gap-4 justify-between">
              
              {/* Left: Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{exp.role}</h3>
                  {exp.current && (
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">Current</Badge>
                  )}
                  <Badge variant="outline">{exp.type}</Badge>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> {exp.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> 
                    {new Date(exp.startDate).toLocaleDateString(undefined, {month:'short', year:'numeric'})} 
                    {" - "} 
                    {exp.current ? "Present" : new Date(exp.endDate).toLocaleDateString(undefined, {month:'short', year:'numeric'})}
                  </span>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl whitespace-pre-wrap">
                  {exp.description}
                </p>

                {exp.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {exp.skills.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex items-start gap-2 pt-1">
                <Button variant="ghost" size="icon" onClick={() => handleOpen(exp)}>
                  <Pencil className="h-4 w-4 text-amber-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(exp._id)}>
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- FORM DIALOG --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role / Title</Label>
                <Input 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  placeholder="Frontend Developer" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input 
                  value={formData.company} 
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  placeholder="Company Name" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label>Type</Label>
                <Input 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  placeholder="Internship / Full-time" 
                />
              </div>
               <div className="space-y-2 flex flex-col justify-end pb-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="current-mode" 
                      checked={formData.current}
                      onCheckedChange={(checked) => setFormData({...formData, current: checked})}
                    />
                    <Label htmlFor="current-mode">I currently work here</Label>
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input 
                  type="date" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className={formData.current ? "opacity-50" : ""}>End Date</Label>
                <Input 
                  type="date" 
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  disabled={formData.current}
                  required={!formData.current}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly describe your responsibilities..." 
                className="h-32"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Tech Stack (comma separated)</Label>
              <Input 
                value={formData.skills} 
                onChange={e => setFormData({...formData, skills: e.target.value})}
                placeholder="React, SEO, Tailwind" 
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Save Changes" : "Add Experience"}
            </Button>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
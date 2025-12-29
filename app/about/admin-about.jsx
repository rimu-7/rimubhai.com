"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from "@/components/about/RichTextEditor";
import AboutSection from "./about-section";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    onGoing: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // ✅ FIX: Handle Unauthorized User
      if (res.status === 401) {
        alert("You must be logged in to save.");
        router.push("/dashboard");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("Item created successfully!");
      setFormData({ name: "", content: "", onGoing: false });
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Add New About Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Project Name"
                />
              </div>

              <div className="flex items-center justify-between border p-4 rounded-lg">
                <Label>Ongoing Status</Label>
                <Switch
                  checked={formData.onGoing}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, onGoing: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(html) =>
                    setFormData({ ...formData, content: html })
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 animate-spin" />
                  ) : (
                    <Save className="mr-2" />
                  )}
                  Save Item
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <AboutSection />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  MessageSquare,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function MessageDialog({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || response.statusText };
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to send");
      }

      setIsSuccess(true);
      toast.success("Message sent successfully!");

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-md max-h-[90vh] overflow-y-auto rounded">
        {!isSuccess ? (
          <div className="p-5 sm:p-6">
            <DialogHeader className="mb-5 sm:mb-6 text-left">
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                Let&apos;s Talk
              </DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                Have a project in mind? Fill out the form below and I&apos;ll
                get back to you within 24 hours.
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    name="name"
                    placeholder="Your Name"
                    className="pl-9 text-xs rounded bg-secondary/50 border-transparent focus:border-blue-500 focus:bg-background transition-all h-10 sm:h-11"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute  left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="pl-9 text-xs rounded bg-secondary/50 border-transparent focus:border-blue-500 focus:bg-background transition-all h-10 sm:h-11"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="relative group">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <Input
                  name="subject"
                  placeholder="Subject (e.g., Web App Project)"
                  className="pl-9 text-xs rounded bg-secondary/50 border-transparent focus:border-blue-500 focus:bg-background transition-all h-10 sm:h-11"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="relative group">
                <Textarea
                  name="message"
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="resize-none rounded bg-secondary/50 border-transparent focus:border-blue-500 focus:bg-background transition-all p-3 sm:text-sm text-xs"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full rounded" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in zoom-in duration-300 min-h-[300px]">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <CheckCircle2 className="h-16 w-16 sm:h-20 sm:w-20 text-green-500 relative z-10" />
            </div>

            <h2 className="text-2xl font-bold text-foreground">
              Message Received!
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xs text-sm sm:text-base">
              Thanks for reaching out,{" "}
              <span className="text-foreground font-semibold">
                {formData.name}
              </span>
              . I&apos;ll check your message and get back to you shortly.
            </p>

            <Button
              variant="outline"
              className="mt-8 min-w-[120px] rounded"
              onClick={() => {
                setIsOpen(false);
                setIsSuccess(false);
                setFormData({ name: "", email: "", subject: "", message: "" });
              }}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

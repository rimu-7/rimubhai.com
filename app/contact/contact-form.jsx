"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Loader2,
  User,
  Mail,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactForm() {
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

      if (!response.ok) throw new Error("Failed to send message");

      setIsSuccess(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="h-full min-h-[360px] flex flex-col items-center justify-center text-center p-8 bg-muted/30 border border-dashed rounded-lg"
      >
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
          <CheckCircle2 className="h-16 w-16 text-green-500 relative z-10" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1.5">
          Message Sent!
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          Thanks for reaching out,{" "}
          <span className="text-foreground font-semibold">{formData.name}</span>
          . I&apos;ll get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          className="rounded-lg"
          onClick={() => {
            setIsSuccess(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
          }}
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border rounded-lg p-5 sm:p-6 md:p-8 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground ml-1">
              Name
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                name="name"
                placeholder="John Doe"
                className="pl-9 text-sm bg-muted/50 rounded-md border-transparent focus:border-primary/50 focus:bg-background h-10 transition-all"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground ml-1">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                className="pl-9 text-sm bg-muted/50 rounded-md border-transparent focus:border-primary/50 focus:bg-background h-10 transition-all"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground ml-1">
            Subject
          </label>
          <div className="relative group">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              name="subject"
              placeholder="Project Inquiry / Collab"
              className="pl-9 text-sm bg-muted/50 rounded-md border-transparent focus:border-primary/50 focus:bg-background h-10 transition-all"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground ml-1">
            Message
          </label>
          <Textarea
            name="message"
            placeholder="Tell me about your project..."
            rows={5}
            className="resize-none rounded-md bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background p-3 text-sm transition-all"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-10 rounded-md text-sm font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}

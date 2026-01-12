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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-muted/30 border border-dashed rounded"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-green-500/20 rounded blur-xl animate-pulse" />
          <CheckCircle2 className="h-20 w-20 text-green-500 relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Message Sent!
        </h2>
        <p className="text-muted-foreground max-w-xs mb-8">
          Thanks for reaching out,{" "}
          <span className="text-foreground font-semibold">{formData.name}</span>
          . I'll get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border rounded p-6 md:p-8 shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
              Name
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                name="name"
                placeholder="John Doe"
                className="pl-9 bg-muted/50 rounded border-transparent focus:border-primary/50 focus:bg-background h-11 transition-all"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                className="pl-9 bg-muted/50 rounded border-transparent focus:border-primary/50 focus:bg-background h-11 transition-all"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
            Subject
          </label>
          <div className="relative group">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              name="subject"
              placeholder="Project Inquiry / Collab"
              className="pl-9 bg-muted/50 rounded border-transparent focus:border-primary/50 focus:bg-background h-11 transition-all"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">
            Message
          </label>
          <Textarea
            name="message"
            placeholder="Tell me about your project..."
            rows={6}
            className="resize-none rounded bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background p-4 transition-all"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded font-medium"
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

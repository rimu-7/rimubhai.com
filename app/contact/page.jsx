import Container from "@/components/Container";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ContactForm from "./contact-form";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Rimu Bhai for freelance projects, collaborations, or just to say hi.",
};

// --- CONFIG ---
const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "rimu_mutasim@yahoo.com",
    href: "mailto:rimu_mutasim@yahoo.com",
  },
];

const socialLinks = [
  {
    name: "GitHub",
    href: process.env.GITHUB || "https://github.com/rimu-7",
    icon: Github,
  },
  {
    name: "Twitter",
    href: process.env.X || "https://x.com/__rimu7_",
    icon: Twitter,
  },
  {
    name: "LinkedIn",
    href:
      process.env.LINKEDIN ||
      "https://www.linkedin.com/in/mutasim-fuad-rimu-36a4a8260",
    icon: Linkedin,
  },
];

export default function ContactPage() {
  return (
    <Container>
      <div className="py-10 md:py-16 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight capitalize">
            get in touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Have a project in mind, or just want to chat? I'm always open to
            discussing new ideas, opportunities, and technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
          {/* LEFT COLUMN: Info */}
          <div className="space-y-10">
            {/* Contact Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Contact Details
              </h3>
              <div className="grid gap-4">
                {contactInfo.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 rounded bg-muted/30 border border-transparent hover:border-border transition-colors"
                  >
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Connect with me</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    className="flex items-center gap-2 px-5 py-3 rounded border bg-background hover:bg-muted hover:border-foreground/20 transition-all group"
                  >
                    <social.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">{social.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Status Badge */}
            <div className="p-6 rounded bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <Badge
                  variant="outline"
                  className="bg-background/50 border-green-500/30 text-green-700 dark:text-green-400"
                >
                  Open for Work
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I am currently available for freelance projects and remote
                full-time roles.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="relative">
            {/* Optional decorative blur behind the form */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-50 -z-10" />
            <ContactForm />
          </div>
        </div>
      </div>
    </Container>
  );
}

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
      <div className="py-16 md:py-24 space-y-10">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            get in touch
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            Have a project in mind, or just want to chat? I&apos;m always open to
            discussing new ideas, opportunities, and technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                Contact Details
              </h3>
              <div className="grid gap-3">
                {contactInfo.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
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

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                Connect
              </h3>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-background hover:bg-muted hover:border-foreground/20 transition-all group"
                  >
                    <social.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">{social.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-80 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <Badge
                  variant="outline"
                  className="bg-background/50 rounded border-green-500/30 text-green-700 dark:text-green-400 text-xs"
                >
                  Open for Work
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                I am currently available for freelance projects and remote
                full-time roles.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 blur-xl opacity-40 -z-10" />
            <ContactForm />
          </div>
        </div>
      </div>
    </Container>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import { Github } from "lucide-react";

// Enhanced data structure for better card visuals
const componentsData = [
  {
    id: 1,
    name: "Text Writing Effect",
    description: "Smooth animated text reveal mimicking a typewriter.",
    href: "/components/text-writing-effects",
    icon: Code2,
  },
  // Added a few placeholder items to demonstrate the 2x2 grid
  {
    id: 2,
    name: "Github Graph",
    description: "Display your github contribution in your portfolio",
    href: "components/github-graph",
    icon: Github,
  },
  {
    id: 3,
    name: "Scroll Animations",
    description: "Elements that reveal themselves as you scroll down.",
    href: "#",
    icon: ArrowRight,
  },
  {
    id: 4,
    name: "Hero Sections",
    description: "Modern, high-impact landing page headers.",
    href: "#",
    icon: Sparkles,
  },
];

// Framer Motion Variants

// 1. Container variant for staggered children loading
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// 2. Item variant for sliding in from bottom
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// 3. Hover variant for the cards

export default function Components() {
  return (
    <section className="py-16 px-6 min-h-screen bg-background/50">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header Section with intro animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left space-y-3"
        >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            UI Components
          </h1>
          <p className="text-xl text-muted-foreground">
            A collection of re-usable, animated building blocks.
          </p>
        </motion.div>

        {/* Grid Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {componentsData.map((component) => (
            <motion.div key={component.id} variants={itemVariants}>
              <Link href={component.href} passHref>
                {/* Wrapping Card in motion div for hover effects */}
                <motion.div initial="initial" whileTap="tap" className="h-full">
                  <Card className="h-full relative overflow-hidden group border-muted-foreground/10 hover:border-primary/30 transition-colors bg-card/50 backdrop-blur-lg cursor-pointer shadow-sm hover:shadow-md">
                    {/* Subtle background gradient blob on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 relative z-10">
                          <CardTitle className="flex items-center gap-2 text-xl">
                            {React.createElement(component.icon, {
                              className: "w-5 h-5 text-primary",
                            })}
                            {component.name}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {component.description}
                          </CardDescription>
                        </div>

                        {/* Arrow icon that moves on hover */}
                        <motion.div
                          className="text-muted-foreground group-hover:text-primary"
                          initial={{ x: 0, opacity: 0.5 }}
                          whileHover={{ x: 5, opacity: 1 }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

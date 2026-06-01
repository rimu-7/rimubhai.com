"use client";

import { motion } from "framer-motion";

export default function TimelinePageShell({ title, description, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="pt-16 md:pt-20"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
        <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed mt-2">
          {description}
        </p>
      </div>
      {children}
    </motion.section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { createRoot } from "react-dom/client"; // Needed to render React icons inside raw HTML

export default function BlogContent({ content }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // 1. Find all <pre> tags (code blocks)
    const preBlocks = contentRef.current.querySelectorAll("pre");

    preBlocks.forEach((pre) => {
      // Prevent adding double buttons if re-render happens
      if (pre.querySelector(".copy-code-btn")) return;

      // 2. Set styling for relative positioning
      pre.style.position = "relative";

      // 3. Create the container for the button
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "copy-code-btn absolute top-3 right-3";
      
      // 4. Append container to the <pre> block
      pre.appendChild(buttonContainer);

      // 5. Render the React Button component into that container
      const root = createRoot(buttonContainer);
      root.render(<CopyButton preBlock={pre} />);
    });
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-slate prose-lg dark:prose-invert max-w-none 
        [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24 
        [&_img]:rounded-xl [&_img]:shadow-lg
        [&_pre]:bg-zinc-950 [&_pre]:border [&_pre]:border-border/50" // Custom code block styles
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// --- Small Internal Component for the actual Button ---
function CopyButton({ preBlock }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    // Get text, but exclude the button text itself if it somehow gets included
    const code = preBlock.querySelector("code")?.innerText || preBlock.innerText;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        p-2 rounded-md transition-all duration-200
        ${copied 
          ? "bg-green-500/10 text-green-500" 
          : "bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white"}
      `}
      aria-label="Copy code"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

import React from "react";
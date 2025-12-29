"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  Great_Vibes,
  Dancing_Script,
  Pacifico,
  Sacramento,
  Parisienne,
} from "next/font/google";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TextWritingEffect } from "@/components/ui/text-writing-effect";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

// --- Font Configuration ---
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });
const dancingScript = Dancing_Script({ weight: "700", subsets: ["latin"] });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });
const sacramento = Sacramento({ weight: "400", subsets: ["latin"] });
const parisienne = Parisienne({ weight: "400", subsets: ["latin"] });

const fontOptions = [
  { name: "Great Vibes", value: "great-vibes", class: greatVibes.className },
  {
    name: "Dancing Script",
    value: "dancing-script",
    class: dancingScript.className,
  },
  { name: "Pacifico", value: "pacifico", class: pacifico.className },
  { name: "Sacramento", value: "sacramento", class: sacramento.className },
  { name: "Parisienne", value: "parisienne", class: parisienne.className },
];

const presets = [
  "Mutasim Fuad Rimu",
  "Creative Developer",
  "Next.js + Framer",
  "Elegant Typography",
  "Minimalist Design",
];

// --- Code Snippets ---
const installCode = `npm install framer-motion`;

const usageCode = `import { TextWritingEffect } from "@/components/ui/text-writing-effect";
import { Great_Vibes } from "next/font/google";

const font = Great_Vibes({ weight: "400", subsets: ["latin"] });

export default function Hero() {
  return (
    <TextWritingEffect 
      text="Mutasim Fuad Rimu" 
      fontClassName={font.className} 
    />
  );
}`;

export default function TextEffectPage() {
  const [text, setText] = useState("Mutasim Fuad Rimu");
  const [selectedFont, setSelectedFont] = useState("great-vibes");
  const [key, setKey] = useState(0);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);

  const currentFont =
    fontOptions.find((f) => f.value === selectedFont) || fontOptions[0];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto max-w-3xl py-2 space-y-6 px-2">
      {/* Header Section */}
      <div className="space-y-2 text-center md:text-left">
        <div className="flex flex-col gap-2 ">
          <Link
            href="/components"
            className="flex gap-2 w-fit px-3 py-2 rounded-md text-muted-foreground hover:text-foreground border-muted-foreground hover:border-foreground items-center border border-dashed hover:text-border-dashed"
          >
            <MoveLeft /> back
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Writing Text Effect
          </h1>
        </div>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0">
          An elegant SVG path animation that mimics handwriting. Perfect for
          signatures, logos, or impactful hero sections. Fully customizable with
          any Google Font.
        </p>
      </div>

      {/* Preview & Controls */}
      <div className="grid gap-4">
        <Tabs defaultValue="preview" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="">
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="grid gap-4">
                <div className="space-y-2">
                  <CardTitle>Playground</CardTitle>
                  <CardDescription>
                    Test different fonts and see the animation in real-time.
                  </CardDescription>
                </div>

                {/* Controls - Responsive Stack */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type anything..."
                    className="flex-1 min-w-[200px]"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Select
                      value={selectedFont}
                      onValueChange={setSelectedFont}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleReplay}
                      title="Replay"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Presets */}
              <div className="px-6 pb-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Quick Try:
                </span>
                {presets.map((preset) => (
                  <Badge
                    key={preset}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      setText(preset);
                      setKey((prev) => prev + 1);
                    }}
                  >
                    {preset}
                  </Badge>
                ))}
              </div>

              <Separator />

              <CardContent className="w-full h-40 md:aspect-3/1 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden p-0">
                <div className="w-full h-full max-w-4xl px-4 flex items-center justify-center">
                  <TextWritingEffect
                    key={key}
                    text={text || "Start typing..."}
                    fontClassName={currentFont.class}
                    speed={3}
                    className="w-full h-auto text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code">
            <Card>
              <CardContent className="p-6">
                <CodeBlock code={usageCode} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Installation Guide */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>
        <Separator />

        <div className="space-y-6">
          <Step title="1. Install dependencies">
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              We use{" "}
              <code className="bg-muted px-1 rounded text-foreground">
                framer-motion
              </code>{" "}
              for the path animations.
            </p>
            <CodeBlock code={installCode} singleLine />
          </Step>

          <Step title="2. Create the component">
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Copy the code below into{" "}
              <code className="bg-muted px-1 rounded text-foreground">
                components/ui/text-writing-effect.tsx
              </code>
              .
            </p>

            {/* Collapsible Code Block */}
            <div className="relative rounded-lg border bg-zinc-950 dark:bg-zinc-900 overflow-hidden group">
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isCodeExpanded ? "max-h-[1500px]" : "max-h-[300px]"
                }`}
              >
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-zinc-50 leading-relaxed">
                    {componentSource}
                  </pre>
                </div>
              </div>

              {/* Fade Overlay & Button */}
              <div
                className={`absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pt-12 pb-6 bg-gradient-to-t from-zinc-950 to-transparent ${
                  isCodeExpanded ? "from-transparent pointer-events-none" : ""
                }`}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                  className={`gap-2 shadow-lg transition-all ${
                    isCodeExpanded ? "pointer-events-auto" : ""
                  }`}
                >
                  {isCodeExpanded ? (
                    <>
                      Collapse Code <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Expand Full Code <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="absolute right-4 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  onClick={() => handleCopy(componentSource)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Step>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function Step({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium leading-none flex items-center gap-3 text-lg">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 shrink-0">
          {title.split(".")[0]}
        </div>
        {title.split(".")[1]}
      </h3>
      <div className="pl-3 md:pl-10 md:border-l md:ml-3.5 pb-6 last:border-0 last:pb-0 border-border">
        {children}
      </div>
    </div>
  );
}

function CodeBlock({ code, singleLine = false }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Copied!");
  };

  return (
    <div className="relative rounded-md bg-zinc-950 p-4 font-mono text-sm text-zinc-50 dark:bg-zinc-900 overflow-x-auto border border-zinc-800 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
      <div className="absolute right-2 top-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <pre
        className={
          singleLine ? "whitespace-nowrap pr-10" : "whitespace-pre-wrap pr-10"
        }
      >
        {code}
      </pre>
    </div>
  );
}

const componentSource = `"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextWritingEffectProps extends React.SVGProps<SVGSVGElement> {
  text: string;
  fontClassName?: string;
  speed?: number;
  color?: string;
  strokeWidth?: number;
}

export function TextWritingEffect({
  text,
  fontClassName,
  speed = 2,
  color = "currentColor",
  strokeWidth = 1.5,
  className,
  ...props
}: TextWritingEffectProps) {
  // Approximate length for stroke animation
  const pathLength = 1000;

  return (
    <div className={cn("flex items-center justify-center overflow-hidden", className)}>
      <motion.svg
        key={\`\${text}-\${fontClassName}\`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 200"
        className="w-full h-full max-w-4xl overflow-visible"
        {...props}
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* 1. Outline Animation (Stroke) */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn("text-7xl fill-transparent", fontClassName)}
          style={{ stroke: color }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: speed, ease: "easeInOut" }}
        >
          {text}
        </motion.text>

        {/* 2. Fill Fade-In */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn("text-7xl stroke-transparent", fontClassName)}
          style={{ fill: color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: speed * 0.6 }}
        >
          {text}
        </motion.text>
      </motion.svg>
    </div>
  );
}`;

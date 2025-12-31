"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  RefreshCw,
  Terminal,
  FileCode,
  Sparkles,
  Info,
  Type,
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
import { TextWritingEffect } from "@/components/ui/text-writing-effect";
import { Switch } from "@/components/ui/switch";
import { BiLogoJavascript, BiLogoTypescript } from "react-icons/bi";
import { Label } from "@/components/ui/label";

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

export default function TextWritingEffectDemo() {
  // State for Live Preview
  const [text, setText] = useState("Mutasim Fuad Rimu");
  const [selectedFont, setSelectedFont] = useState("great-vibes");
  const [key, setKey] = useState(0);

  // State for Tabs & Copying
  const [copiedCode, setCopiedCode] = useState(false);
  const [copyKey, setCopyKey] = useState(null);

  // State for TS/JS Toggle
  const [isTs, setIsTs] = useState(false);

  const currentFont =
    fontOptions.find((f) => f.value === selectedFont) || fontOptions[0];

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  // --- Installation Commands ---
  const commands = {
    npm: "npm install framer-motion clsx tailwind-merge",
    pnpm: "pnpm add framer-motion clsx tailwind-merge",
    yarn: "yarn add framer-motion clsx tailwind-merge",
    bun: "bun add framer-motion clsx tailwind-merge",
  };

  const handleCopyCommand = (command, key) => {
    navigator.clipboard.writeText(command);
    setCopyKey(key);
    toast.success(`Copied ${key} command!`);
    setTimeout(() => setCopyKey(null), 2000);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-background p-6 md:p-12 flex justify-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Writing Text Effect
            </h1>
            <Badge variant="outline">v1.0</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            An elegant SVG path animation that mimics handwriting using Framer
            Motion.
          </p>
        </div>

        {/* Live Preview Card */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4 border-b">
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Live Preview
                    </CardTitle>
                    <CardDescription>
                      Customize text and font to see the animation.
                    </CardDescription>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-2">
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type text..."
                      className="bg-background h-9 min-w-[150px]"
                    />
                    <div className="flex justify-between w-full gap-2">
                      <Select
                        value={selectedFont}
                        onValueChange={setSelectedFont}
                      >
                        <SelectTrigger className="w-full md:w-[140px] h-9 bg-background">
                          <SelectValue placeholder="Font" />
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
                        className="h-9 w-9 bg-background shrink-0"
                        onClick={handleReplay}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-0 min-h-[250px] flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                  <TextWritingEffect
                    key={key}
                    text={text || "Type something..."}
                    fontClassName={currentFont.class}
                    speed={3}
                    className="w-full max-w-2xl text-zinc-900 dark:text-zinc-100 z-10"
                  />
                </CardContent>
              </TabsContent>

              <TabsContent value="code">
                <div className="relative rounded-md bg-zinc-950 border border-zinc-800">
                  <div className="absolute right-4 top-4 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      onClick={() => handleCopyCode(mainComponent)}
                    >
                      {copiedCode ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-4 overflow-x-auto max-h-[300px] text-xs font-mono leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700 text-zinc-300">
                    <pre>{mainComponent}</pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Documentation Tabs */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Terminal className="h-5 w-5" /> Install Dependencies
            </h3>

            <Tabs defaultValue="npm" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {Object.keys(commands).map((pkgManager) => (
                  <TabsTrigger key={pkgManager} value={pkgManager}>
                    {pkgManager}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(commands).map(([key, command]) => (
                <TabsContent key={key} value={key} className="">
                  <Card className="">
                    <CardContent className="p-4 flex items-center justify-between">
                      <code className="font-mono text-sm text-foreground/80 truncate pr-4">
                        {command}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 hover:bg-background"
                        onClick={() => handleCopyCommand(command, key)}
                      >
                        {copyKey === key ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">Copy {key} command</span>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="py-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileCode className="h-5 w-5" /> Component Code
            </h3>
            <p className="text-sm text-muted-foreground">
              Copy the code below into{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">
                components/ui/text-writing-effect.tsx
              </code>
            </p>
          </div>

          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Label
                htmlFor="language-switch"
                className={`flex items-center gap-1 cursor-pointer ${
                  !isTs ? "text-foreground font-bold" : "text-muted-foreground"
                }`}
              >
                <BiLogoJavascript
                  className={`w-6 h-6 ${
                    !isTs ? "fill-yellow-400" : "fill-gray-400"
                  }`}
                />
                JS
              </Label>

              <Switch
                id="language-switch"
                checked={isTs}
                onCheckedChange={setIsTs}
              />

              <Label
                htmlFor="language-switch"
                className={`flex items-center gap-1 cursor-pointer ${
                  isTs ? "text-foreground font-bold" : "text-muted-foreground"
                }`}
              >
                TS
                <BiLogoTypescript
                  className={`w-6 h-6 ${
                    isTs ? "fill-blue-500" : "fill-gray-400"
                  }`}
                />
              </Label>
            </div>

            <Button
              size="sm"
              variant="secondary"
              className="h-8 gap-2 shadow-sm border bg-background/80 backdrop-blur"
              onClick={() =>
                handleCopyCode(isTs ? componentSourceTS : componentSourceJS)
              }
            >
              {copiedCode ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              {copiedCode ? "Copied" : "Copy Code"}
            </Button>
          </div>

          <Card className="bg-[#0d1117] text-gray-300 border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 overflow-x-auto max-h-[600px] text-xs sm:text-sm font-mono leading-relaxed scrollbar-thin scrollbar-thumb-gray-800">
                <pre>{isTs ? componentSourceTS : componentSourceJS}</pre>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" /> How it Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                This component uses{" "}
                <strong className="text-foreground">Framer Motion</strong> to
                animate the SVG{" "}
                <code className="text-foreground">stroke-dashoffset</code>{" "}
                property.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  First, it renders the text outline (stroke) and animates it
                  from 0 to 100%.
                </li>
                <li>
                  Then, it fades in the fill color to make the text solid.
                </li>
                <li>
                  It uses <code className="text-foreground">next/font</code> to
                  support any Google Font.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" /> Props
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PropCard
                  name="text"
                  type="string"
                  desc="The text to display."
                  required
                />
                <PropCard
                  name="fontClassName"
                  type="string"
                  desc="Class from next/font."
                />
                <PropCard
                  name="speed"
                  type="number"
                  desc="Duration in seconds. Default: 2"
                />
                <PropCard
                  name="color"
                  type="string"
                  desc="Stroke/Fill color. Default: currentColor"
                />
                <PropCard
                  name="strokeWidth"
                  type="number"
                  desc="Thickness of the line. Default: 1.5"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper for Info Tab
function PropCard({ name, type, desc, required }) {
  return (
    <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
      <div className="flex items-center justify-between">
        <code className="text-sm font-bold">{name}</code>
        {required && (
          <Badge variant="destructive" className="text-[10px] h-4 px-1">
            Required
          </Badge>
        )}
      </div>
      <div className="text-xs font-mono text-blue-500">{type}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}

// --- CODE STRINGS ---

const mainComponent = `import { TextWritingEffect } from "@/components/ui/text-writing-effect";
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

const componentSourceJS = `"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TextWritingEffect({
  text,
  fontClassName,
  speed = 2,
  color = "currentColor",
  strokeWidth = 1.5,
  className,
  ...props
}) {
  const pathLength = 1000;

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden w-full h-auto",
        className
      )}
    >
      <motion.svg
        key={\`\${text}-\${fontClassName}\`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 200"
        className="w-full h-full overflow-visible"
        {...props}
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn("text-7xl fill-transparent", fontClassName)}
          style={{ stroke: color }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          }}
          animate={{
            strokeDashoffset: 0,
          }}
          transition={{
            duration: speed,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>

        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn("text-7xl stroke-transparent", fontClassName)}
          style={{ fill: color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: speed * 0.6, 
          }}
        >
          {text}
        </motion.text>
      </motion.svg>
    </div>
  );
}`;

const componentSourceTS = `"use client";

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
  const pathLength = 1000;

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden w-full h-auto",
        className
      )}
    >
      <motion.svg
        key={\`\${text}-\${fontClassName}\`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 200"
        className="w-full h-full overflow-visible"
        {...props}
      >
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn("text-7xl fill-transparent", fontClassName)}
          style={{ stroke: color }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          }}
          animate={{
            strokeDashoffset: 0,
          }}
          transition={{
            duration: speed,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.text>

        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className={cn("text-7xl stroke-transparent", fontClassName)}
          style={{ fill: color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: speed * 0.6, 
          }}
        >
          {text}
        </motion.text>
      </motion.svg>
    </div>
  );
}`;

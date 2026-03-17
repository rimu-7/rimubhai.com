"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  Copy,
  RefreshCw,
  Terminal,
  FileCode,
  Type,
  Play,
  Settings2,
} from "lucide-react";
import { toast } from "next-toast";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { BiLogoJavascript, BiLogoTypescript } from "react-icons/bi";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Container from "@/components/Container";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextInitial } from "lucide-react";

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

const animationStyles = [
  { value: "write", label: "Write", description: "Classic stroke drawing" },
  { value: "reveal", label: "Reveal", description: "Blur to clear" },
  { value: "bounce", label: "Bounce", description: "Playful drop-in" },
  { value: "wave", label: "Wave", description: "Fluid motion" },
  { value: "typewriter", label: "Typewriter", description: "Classic typing" },
  { value: "fade", label: "Fade", description: "Smooth opacity" },
  { value: "scale", label: "Scale", description: "Dramatic zoom" },
  { value: "slide", label: "Slide", description: "Skewed entrance" },
];

// --- Animations Configuration ---
const animations = {
  write: {
    container: { hidden: {}, visible: {} },
    item: {
      hidden: { pathLength: 0, opacity: 0 },
      visible: { pathLength: 1, opacity: 1 },
    },
  },
  reveal: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
    },
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      visible: { opacity: 1, filter: "blur(0px)", y: 0 },
    },
  },
  bounce: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    },
    item: {
      hidden: { opacity: 0, y: -50, scale: 0.3 },
      visible: { opacity: 1, y: 0, scale: 1 },
    },
  },
  wave: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    },
    item: {
      hidden: { opacity: 0, y: 20, rotateX: -90 },
      visible: { opacity: 1, y: 0, rotateX: 0 },
    },
  },
  glitch: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
    },
    item: {
      hidden: { opacity: 0, x: 0 },
      visible: { opacity: 1, x: [0, -2, 2, -2, 0] },
    },
  },
  typewriter: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    },
    item: {
      hidden: { opacity: 0, width: 0 },
      visible: { opacity: 1, width: "auto" },
    },
  },
  fade: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
    },
    item: { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } },
  },
  scale: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
    },
    item: {
      hidden: { opacity: 0, scale: 0, rotate: -180 },
      visible: { opacity: 1, scale: 1, rotate: 0 },
    },
  },
  slide: {
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    },
    item: {
      hidden: { opacity: 0, x: -30, skewX: 20 },
      visible: { opacity: 1, x: 0, skewX: 0 },
    },
  },
};

// --- TextWritingEffect Component ---
function TextWritingEffect({
  text,
  fontClassName,
  speed = 2,
  color = "currentColor",
  strokeWidth = 1.5,
  fontSize = 72,
  viewBoxWidth = 800,
  viewBoxHeight = 200,
  textAnchor = "middle",
  letterSpacing = 0,
  gradient = false,
  gradientColors = [color, color],
  delay = 0,
  loop = false,
  loopDelay = 1,
  animationStyle = "write",
  staggerChildren = 0.05,
  onAnimationStart,
  onAnimationComplete,
  onLetterAnimationComplete,
  className,
  ...props
}) {
  const actualFontSize = typeof fontSize === "number" ? fontSize : 72;
  const calculatedHeight = Math.max(viewBoxHeight, actualFontSize * 1.5);
  const xPosition =
    textAnchor === "middle" ? "50%" : textAnchor === "start" ? "5%" : "95%";
  const yPosition = "50%";
  const characters = text.split("");
  const selectedAnimation = animations[animationStyle];

  const containerVariants = {
    hidden: selectedAnimation.container.hidden,
    visible: {
      ...selectedAnimation.container.visible,
      transition: {
        staggerChildren,
        delayChildren: delay,
        repeat: loop ? Infinity : 0,
        repeatDelay: loopDelay,
      },
    },
  };

  const itemVariants = {
    hidden: selectedAnimation.item.hidden,
    visible: {
      ...selectedAnimation.item.visible,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const renderContent = () => {
    if (animationStyle === "write") {
      return (
        <>
          <defs>
            {gradient && (
              <linearGradient
                id={`gradient-${text}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={gradientColors[0]} />
                <stop offset="100%" stopColor={gradientColors[1]} />
              </linearGradient>
            )}
          </defs>
          <motion.text
            x={xPosition}
            y={yPosition}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            className={cn("fill-transparent", fontClassName)}
            style={{
              fontSize: actualFontSize,
              stroke: gradient ? `url(#gradient-${text})` : color,
              letterSpacing: `${letterSpacing}em`,
            }}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: speed,
              ease: "easeInOut",
              delay,
              repeat: loop ? Infinity : 0,
              repeatDelay: loopDelay,
            }}
          >
            {text}
          </motion.text>
          <motion.text
            x={xPosition}
            y={yPosition}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            className={cn("stroke-transparent", fontClassName)}
            style={{
              fontSize: actualFontSize,
              fill: gradient ? `url(#gradient-${text})` : color,
              letterSpacing: `${letterSpacing}em`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: delay + speed * 0.6,
              repeat: loop ? Infinity : 0,
              repeatDelay: loopDelay + speed * 0.4,
            }}
          >
            {text}
          </motion.text>
        </>
      );
    }

    return (
      <g style={{ transformOrigin: "center" }}>
        {characters.map((char, index) => {
          const xOffset =
            textAnchor === "middle"
              ? viewBoxWidth / 2 -
                (characters.length / 2 - index) * actualFontSize * 0.6
              : textAnchor === "start"
                ? 40 + index * actualFontSize * 0.6
                : viewBoxWidth -
                  40 -
                  (characters.length - index) * actualFontSize * 0.6;

          return (
            <motion.text
              key={index}
              x={xOffset}
              y={yPosition}
              textAnchor="middle"
              dominantBaseline="middle"
              className={cn(fontClassName)}
              style={{
                fontSize: actualFontSize,
                fill: color,
                letterSpacing: `${letterSpacing}em`,
              }}
              variants={itemVariants}
              onAnimationComplete={() => onLetterAnimationComplete?.(index)}
            >
              {char === " " ? "\u00A0" : char}
            </motion.text>
          );
        })}
        {animationStyle === "typewriter" && (
          <motion.rect
            x={
              textAnchor === "middle"
                ? viewBoxWidth / 2 +
                  (characters.length / 2) * actualFontSize * 0.6
                : textAnchor === "start"
                  ? 40 + characters.length * actualFontSize * 0.6
                  : viewBoxWidth - 40
            }
            y={calculatedHeight / 2 - actualFontSize / 2}
            width={3}
            height={actualFontSize}
            fill={color}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay + speed + characters.length * staggerChildren,
            }}
          />
        )}
      </g>
    );
  };

  const isStaggered = animationStyle !== "write";

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden w-full h-auto",
        className,
      )}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBoxWidth} ${calculatedHeight}`}
        className="w-full h-full overflow-visible"
        initial={isStaggered ? "hidden" : undefined}
        animate={isStaggered ? "visible" : undefined}
        variants={isStaggered ? containerVariants : undefined}
        onAnimationStart={onAnimationStart}
        onAnimationComplete={onAnimationComplete}
        {...props}
      >
        {renderContent()}
      </motion.svg>
    </div>
  );
}

export default function TextWritingEffectDemo() {
  // State for Live Preview
  const [text, setText] = useState("Mutasim Fuad Rimu");
  const [selectedFont, setSelectedFont] = useState("great-vibes");
  const [animationStyle, setAnimationStyle] = useState("write");
  const [fontSize, setFontSize] = useState(68);
  const [speed, setSpeed] = useState(2);
  const [color, setColor] = useState("#10b981");
  const [animationKey, setAnimationKey] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // State for Tabs & Copying
  const [copiedCode, setCopiedCode] = useState(false);
  const [copyKey, setCopyKey] = useState(null);

  // State for TS/JS Toggle
  const [isTs, setIsTs] = useState(true);

  const currentFont =
    fontOptions.find((f) => f.value === selectedFont) || fontOptions[0];

  // Auto-replay when animation parameters change
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [animationStyle, speed, color, fontSize, selectedFont]);

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  // --- Installation Commands ---
  const commands = {
    npm: "npx shadcn@latest add https://raw.githubusercontent.com/rimu-7/shadcn-components/main/public/registry/text-writing-effect.json",
    pnpm: "pnpm dlx shadcn@latest add https://raw.githubusercontent.com/rimu-7/shadcn-components/main/public/registry/text-writing-effect.json",
    yarn: "yarn dlx shadcn@latest add https://raw.githubusercontent.com/rimu-7/shadcn-components/main/public/registry/text-writing-effect.json",
    bun: "bunx shadcn@latest add https://raw.githubusercontent.com/rimu-7/shadcn-components/main/public/registry/text-writing-effect.json",
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

  // Generate preview code based on current settings
  const previewCode = `<TextWritingEffect
  text="${text}"
  fontSize={${fontSize}}
  color="${color}"
  animationStyle="${animationStyle}"
  speed={${speed}}
  fontClassName={${currentFont.name.replace(/\s+/g, "").toLowerCase()}.className}
/>`;

  return (
    <Container className="min-h-screen py-10 w-full bg-background flex justify-center">
      <Container>
        {/* Page Header */}
        <div className="max-w-5xl mx-auto py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <TextInitial className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Writing Text Effect
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Beautiful SVG text animations with 9 different styles using Framer
              Motion.
            </p>
          </motion.div>
        </div>

        {/* Live Preview Card */}
        <Card className="border shadow-none rounded-lg overflow-hidden">
          <CardHeader className="pb-4 border-b">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 rounded-lg">
                <TabsTrigger value="preview" className="rounded-md">
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <FileCode className="w-4 h-4 mr-2" />
                  Code
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        Live Preview
                      </CardTitle>
                      <CardDescription>
                        Customize and preview your animation
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowControls(!showControls)}
                      className="gap-2 rounded-lg"
                    >
                      <Settings2 className="h-4 w-4" />
                      {showControls ? "Hide" : "Show"} Controls
                    </Button>
                  </div>

                  {/* Quick Controls */}
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type text..."
                      className="bg-background rounded-lg h-10"
                    />
                    <div className="flex gap-2">
                      <Select
                        value={selectedFont}
                        onValueChange={setSelectedFont}
                      >
                        <SelectTrigger className="w-[160px] rounded-lg h-10 bg-background">
                          <SelectValue placeholder="Font" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          {fontOptions.map((font) => (
                            <SelectItem
                              key={font.value}
                              value={font.value}
                              className="rounded-md"
                            >
                              {font.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={animationStyle}
                        onValueChange={(value) => setAnimationStyle(value)}
                      >
                        <SelectTrigger className="w-[160px] rounded-lg h-10 bg-background">
                          <SelectValue placeholder="Animation" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          {animationStyles.map((style) => (
                            <SelectItem
                              key={style.value}
                              value={style.value}
                              className="rounded-md"
                            >
                              <div className="flex flex-col">
                                <span>{style.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {style.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-lg shrink-0"
                        onClick={handleReplay}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Advanced Controls */}
                  {showControls && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          Font Size: {fontSize}px
                        </Label>
                        <Slider
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                          min={40}
                          max={70}
                          step={2}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          Speed: {speed}s
                        </Label>
                        <Slider
                          value={[speed]}
                          onValueChange={(value) => setSpeed(value[0])}
                          min={0.5}
                          max={5}
                          step={0.5}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Color</Label>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            "#10b981",
                            "#6366f1",
                            "#ec4899",
                            "#0ea5e9",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#14b8a6",
                          ].map((c) => (
                            <button
                              key={c}
                              onClick={() => setColor(c)}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                color === c
                                  ? "border-foreground scale-110"
                                  : "border-transparent"
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="pt-0 min-h-[300px] flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/50 overflow-hidden relative rounded-lg border">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <TextWritingEffect
                    key={animationKey}
                    text={text || "Type something..."}
                    fontSize={fontSize}
                    color={color}
                    animationStyle={animationStyle}
                    speed={speed}
                    fontClassName={currentFont.class}
                    className="w-full max-w-3xl text-zinc-900 dark:text-zinc-100 z-10"
                  />
                </CardContent>
              </TabsContent>

              <TabsContent value="code">
                <div className="relative rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="absolute right-4 top-4 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md"
                      onClick={() => handleCopyCode(previewCode)}
                    >
                      {copiedCode ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300">
                    <pre>{previewCode}</pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Documentation */}
        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Terminal className="h-5 w-5" /> Installation
            </h3>
            <Tabs defaultValue="npm" className="w-full">
              <TabsList className="grid w-full grid-cols-4 rounded-lg">
                {Object.keys(commands).map((pkgManager) => (
                  <TabsTrigger
                    key={pkgManager}
                    value={pkgManager}
                    className="rounded-md capitalize"
                  >
                    {pkgManager}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.entries(commands).map(([key, command]) => (
                <TabsContent key={key} value={key}>
                  <Card className="rounded-lg shadow-none">
                    <CardContent className="p-4 flex items-center justify-between">
                      <code className="font-mono text-sm text-foreground/80 truncate pr-4">
                        {command}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 hover:bg-background rounded-md"
                        onClick={() => handleCopyCommand(command, key)}
                      >
                        {copyKey === key ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileCode className="h-5 w-5" /> Component Code
              </h3>
              <div className="flex items-center gap-3">
                <Label
                  htmlFor="language-switch"
                  className={`flex items-center gap-1 cursor-pointer text-sm ${!isTs ? "text-foreground font-bold" : "text-muted-foreground"}`}
                >
                  <BiLogoJavascript
                    className={`w-5 h-5 ${!isTs ? "fill-yellow-400" : "fill-gray-400"}`}
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
                  className={`flex items-center gap-1 cursor-pointer text-sm ${isTs ? "text-foreground font-bold" : "text-muted-foreground"}`}
                >
                  TS
                  <BiLogoTypescript
                    className={`w-5 h-5 ${isTs ? "fill-blue-500" : "fill-gray-400"}`}
                  />
                </Label>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 gap-2 rounded-md ml-4"
                  onClick={() =>
                    handleCopyCode(isTs ? componentSourceTS : componentSourceJS)
                  }
                >
                  {copiedCode ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copiedCode ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <Card className="bg-[#0d1117] rounded-lg text-gray-300 border-none shadow-none overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 overflow-x-auto max-h-[500px] text-sm font-mono leading-relaxed scrollbar-thin scrollbar-thumb-gray-800">
                  <pre>{isTs ? componentSourceTS : componentSourceJS}</pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Props Table */}
          <Card className="rounded-lg shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" /> Props
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <PropCard
                  name="text"
                  type="string"
                  desc="The text to animate"
                  required
                />
                <PropCard
                  name="animationStyle"
                  type="AnimationStyle"
                  desc="Animation type: write, reveal, bounce, wave, glitch, typewriter, fade, scale, slide"
                  defaultValue="write"
                />
                <PropCard
                  name="fontSize"
                  type="number | string"
                  desc="Font size in pixels or tailwind preset"
                  defaultValue="72"
                />
                <PropCard
                  name="speed"
                  type="number"
                  desc="Animation duration in seconds"
                  defaultValue="2"
                />
                <PropCard
                  name="color"
                  type="string"
                  desc="Text color"
                  defaultValue="currentColor"
                />
                <PropCard
                  name="fontClassName"
                  type="string"
                  desc="Font class from next/font"
                />
                <PropCard
                  name="loop"
                  type="boolean"
                  desc="Loop animation infinitely"
                  defaultValue="false"
                />
                <PropCard
                  name="delay"
                  type="number"
                  desc="Delay before animation starts"
                  defaultValue="0"
                />
                <PropCard
                  name="gradient"
                  type="boolean"
                  desc="Enable gradient fill"
                  defaultValue="false"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Container>
  );
}

function PropCard({ name, type, desc, required, defaultValue }) {
  return (
    <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
      <div className="flex items-center justify-between">
        <code className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          {name}
        </code>
        <div className="flex gap-1">
          {required && (
            <Badge
              variant="destructive"
              className="text-[10px] h-4 px-1 rounded"
            >
              Required
            </Badge>
          )}
          {defaultValue && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1 rounded">
              Default: {defaultValue}
            </Badge>
          )}
        </div>
      </div>
      <div className="text-xs font-mono text-blue-500">{type}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}

// --- CODE STRINGS ---

const componentSourceJS = "";

const componentSourceTS = "";

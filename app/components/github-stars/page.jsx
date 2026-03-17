"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  RefreshCw,
  Terminal,
  FileCode,
  Star,
  Github,
  Package,
  Code2,
  Eye,
} from "lucide-react";
import { toast } from "next-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GitHubStars } from "@/components/ui/github-stars";
import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";

// --- Installation Commands ---
const commands = {
  npm: "npx shadcn@latest add https://raw.githubusercontent.com/rimu-7/shadcn-components/main/public/registry/github-stars.json",
  pnpm: "pnpm dlx shadcn@latest add https://raw.githubusercontent.com/rimu-7/shadcn-components/main/public/registry/github-stars.json",
  yarn: "yarn dlx shadcn@latest add https://raw.githubusercontent.com/rimu-7/shadcn-components/main/public/registry/github-stars.json",
  bun: "bunx shadcn@latest add https://raw.githubusercontent.com/rimu-7/shadcn-components/main/public/registry/github-stars.json",
};

// --- Component Source Code ---
const componentSourceTS = `"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface GitHubStarsProps {
  repo;
  initialStars?: number;
  className?;
  size?: "sm" | "md" | "lg";
}

function formatFullNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num);
}

export function GitHubStars({ 
  repo, 
  initialStars = 0, 
  className,
  size = "sm"
}: GitHubStarsProps) {
  const [stars, setStars] = useState(initialStars);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(initialStars === 0);

  useEffect(() => {
    if (initialStars > 0) return;

    const fetchStars = async () => {
      try {
        const res = await fetch(\`https://api.github.com/repos/\${repo}\`);
        if (!res.ok) throw new Error(\`GitHub API error: \${res.status}\`);
        const data = await res.json();
        setStars(data.stargazers_count || 0);
      } catch (err) {
        console.error("Failed to fetch GitHub stars:", err);
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, [repo, initialStars]);

  const formattedCompact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(stars).toLowerCase();

  const sizeClasses = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-9 px-3 text-sm",
    lg: "h-10 px-4 text-sm"
  };

  const ButtonContent = (
    <Button
      className={cn(
        "flex items-center gap-1.5 font-medium transition-all",
        sizeClasses[size],
        className
      )}
      size={size}
      asChild
    >
      <a
        href={\`https://github.com/\${repo}\`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={\`Star \${repo} on GitHub\`}
      >
        <Star className={cn(
          "fill-current",
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
        )} />
        <span className="tabular-nums">
          {loading ? "—" : formattedCompact}
        </span>
      </a>
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          {ButtonContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="font-sans">
          <div className="flex flex-col gap-1">
            <span className="font-medium">
              {formatFullNumber(stars)} stars on GitHub
            </span>
            {error && (
              <span className="text-xs text-red-400">{error}</span>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`;

const componentSourceJS = `"use client"

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function GitHubStars({ 
  repo, 
  initialStars = 0, 
  className,
  size = "sm"
}) {
  const [stars, setStars] = useState(initialStars);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(initialStars === 0);

  useEffect(() => {
    if (initialStars > 0) return;

    const fetchStars = async () => {
      try {
        const res = await fetch(\`https://api.github.com/repos/\${repo}\`);
        if (!res.ok) throw new Error(\`GitHub API error: \${res.status}\`);
        const data = await res.json();
        setStars(data.stargazers_count || 0);
      } catch (err) {
        console.error("Failed to fetch GitHub stars:", err);
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, [repo, initialStars]);

  const formattedCompact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(stars).toLowerCase();

  const sizeClasses = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-9 px-3 text-sm",
    lg: "h-10 px-4 text-sm"
  };

  const ButtonContent = (
    <Button
      className={cn(
        "flex items-center gap-1.5 font-medium transition-all",
        sizeClasses[size],
        className
      )}
      size={size}
      asChild
    >
      <a
        href={\`https://github.com/\${repo}\`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Star className={cn(
          "fill-current",
          size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
        )} />
        <span className="tabular-nums">
          {loading ? "—" : formattedCompact}
        </span>
      </a>
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          {ButtonContent}
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="flex flex-col gap-1">
            <span>{new Intl.NumberFormat("en-US").format(stars)} stars</span>
            {error && <span className="text-xs text-red-400">{error}</span>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`;

// --- Usage Examples ---
const usageExamples = {
  basic: `<GitHubStars repo="facebook/react" />`,
  withInitial: `<GitHubStars 
  repo="vercel/next.js" 
  initialStars={120000} 
/>`,
};

export default function GitHubStarsDocs() {
  const [customRepo, setCustomRepo] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copyKey, setCopyKey] = useState(null);
  const [isTs, setIsTs] = useState(true);
  const [demoKey, setDemoKey] = useState(0);

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

  const handleRefreshDemo = () => {
    setDemoKey((prev) => prev + 1);
    toast.info("Demo refreshed!");
  };

  const validateRepo = (input) => {
    if (!input) return null;
    const trimmed = input.trim();
    if (!trimmed.includes("/")) return null;
    const parts = trimmed.split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
    return trimmed;
  };

  const validRepo = validateRepo(customRepo);

  return (
    <Container>
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Github className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              GitHub Stars
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A beautiful, interactive component to display GitHub star counts
            with real-time fetching, smart formatting, and zero layout shift.
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex flex-col items-center gap-2">
              <GitHubStars repo="facebook/react" />
              <Badge variant="secondary" className="text-[10px] font-mono">
                facebook/react
              </Badge>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GitHubStars repo="vercel/next.js" />
              <Badge variant="secondary" className="text-[10px] font-mono">
                vercel/next.js
              </Badge>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GitHubStars repo="tailwindlabs/tailwindcss" />
              <Badge variant="secondary" className="text-[10px] font-mono">
                tailwindlabs/tailwindcss
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto py-12 space-y-12">
        {/* Live Preview Card */}
        <Card className="border shadow-lg overflow-hidden">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Interactive Playground
                </CardTitle>
                <CardDescription className="mt-1">
                  Customize the component and try it with any repository
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshDemo}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="gap-2">
                  <Code2 className="h-4 w-4" />
                  Generated Code
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="preview" className="p-6 space-y-6">
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label>Repository (owner/repo)</Label>
                  <Input
                    placeholder="e.g., facebook/react"
                    value={customRepo}
                    onChange={(e) => setCustomRepo(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>

              {/* Preview Area */}
              <div className="min-h-[200px] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded-lg border-2 border-dashed border-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

                <AnimatePresence mode="wait">
                  {validRepo ? (
                    <motion.div
                      key={demoKey + customRepo}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="z-10"
                    >
                      <GitHubStars repo={validRepo} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground z-10"
                    >
                      <p className="text-sm">Enter a repository to preview</p>
                      <p className="text-xs opacity-60 mt-1">
                        e.g., facebook/react
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="code" className="p-6">
              <div className="relative rounded-lg bg-zinc-950 border border-zinc-800">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-4 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  onClick={() =>
                    handleCopyCode(
                      validRepo
                        ? `<GitHubStars repo="${validRepo}" />`
                        : usageExamples.basic,
                    )
                  }
                >
                  {copiedCode ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300">
                  <pre>
                    {validRepo
                      ? `<GitHubStars repo="${validRepo}" />`
                      : "// Enter a repository in the preview tab to generate code"}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Installation */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Installation</h2>
          </div>

          <Tabs defaultValue="npm" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {Object.keys(commands).map((pkgManager) => (
                <TabsTrigger
                  key={pkgManager}
                  value={pkgManager}
                  className="capitalize"
                >
                  {pkgManager}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(commands).map(([key, command]) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <code className="font-mono text-sm text-foreground/80 truncate pr-4">
                      {command}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
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

        {/* Component Code */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Component Code</h2>
            </div>
            <div className="flex items-center gap-3">
              <Label
                htmlFor="lang-switch"
                className={cn(
                  "cursor-pointer text-sm",
                  !isTs ? "text-foreground font-bold" : "text-muted-foreground",
                )}
              >
                JavaScript
              </Label>
              <Switch
                id="lang-switch"
                checked={isTs}
                onCheckedChange={setIsTs}
              />
              <Label
                htmlFor="lang-switch"
                className={cn(
                  "cursor-pointer text-sm",
                  isTs ? "text-foreground font-bold" : "text-muted-foreground",
                )}
              >
                TypeScript
              </Label>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 gap-2 ml-4"
                onClick={() =>
                  handleCopyCode(isTs ? componentSourceTS : componentSourceJS)
                }
              >
                {copiedCode ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copiedCode ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <Card className="bg-[#0d1117] border-zinc-800 overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 overflow-x-auto max-h-[600px] text-sm font-mono leading-relaxed text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-700">
                <pre>{isTs ? componentSourceTS : componentSourceJS}</pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Examples */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Usage Examples
          </h2>

          <div className="grid gap-4">
            {Object.entries(usageExamples).map(([key, code]) => (
              <Card key={key} className="overflow-hidden">
                <CardHeader className="py-3 bg-muted/30 border-b">
                  <CardTitle className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={() => handleCopyCode(code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <pre className="p-4 overflow-x-auto text-sm font-mono bg-zinc-950 text-zinc-300">
                      {code}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

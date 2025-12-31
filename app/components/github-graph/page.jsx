"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Check,
  Copy,
  ExternalLink,
  Terminal,
  FileCode,
  Sparkles,
  Type,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { BiLogoJavascript, BiLogoTypescript } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// --- LIVE COMPONENT FOR DEMO ---
function GithubContributionsLive({ username }) {
  const { theme, systemTheme } = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    if (!username) return;
    const controller = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
        { signal: controller.signal }
      );

      if (!response.ok) throw new Error("User not found or API error");

      const json = await response.json();
      if (!json?.contributions) {
        setData([]);
        setTotal(0);
        return;
      }

      setData(json.contributions);
      setTotal(json.contributions.reduce((sum, day) => sum + day.count, 0));
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setIsLoading(false);
    }
    return () => controller.abort();
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const colorTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  const renderBlock = (block, activity) => {
    const triggerItem = React.cloneElement(block, {
      className: "cursor-pointer hover:opacity-80 transition-opacity",
    });
    return (
      <Tooltip key={activity.date}>
        <TooltipTrigger asChild>{triggerItem}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-popover text-popover-foreground shadow-md border"
        >
          <div className="text-xs text-center">
            <div className="font-bold">
              {activity.count === 0 ? "No" : activity.count} contributions
            </div>
            <div className="text-muted-foreground">
              {format(new Date(activity.date), "MMM d, yyyy")}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  if (error) {
    return (
      <div className="p-6 text-center text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
        Unable to load data for{" "}
        <span className="font-mono font-bold">{username}</span>.
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">{username}</div>
            {!isLoading && (
              <div className="text-sm text-muted-foreground">
                {total} contributions in the last year
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`https://github.com/${username}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2 min-w-2xl">
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[600px]">
              <ActivityCalendar
                data={data}
                theme={colorTheme}
                colorScheme={currentTheme === "dark" ? "dark" : "light"}
                blockRadius={3}
                blockSize={12}
                blockMargin={4}
                fontSize={12}
                hideTotalCount
                hideColorLegend={false}
                renderBlock={renderBlock}
                labels={{ legend: { less: "Less", more: "More" } }}
              />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function GithubGraphDemoPage() {
  const [demoUser, setDemoUser] = useState("rimu-7");
  const [inputValue, setInputValue] = useState("rimu-7");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTs, setIsTs] = useState(false);
  const [copyKey, setCopyKey] = useState(null);

  const commands = {
    npm: "npm install react-activity-calendar next-themes date-fns lucide-react ",
    pnpm: "pnpm add react-activity-calendar next-themes date-fns lucide-react",
    yarn: "yarn add react-activity-calendar next-themes date-fns lucide-react",
    bun: "bun add react-activity-calendar next-themes date-fns lucide-react",
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCommand = (command, key) => {
    navigator.clipboard.writeText(command);
    setCopyKey(key);
    toast.success(`Copied ${key} command!`);
    setTimeout(() => setCopyKey(null), 2000);
  };

  const handleUpdateUser = () => {
    if (inputValue.trim()) {
      setDemoUser(inputValue.trim());
    }
  };

  return (
    <div className="min-h-screen w-full bg-background p-6 md:p-12 flex justify-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              GitHub Activity Graph
            </h1>
            <Badge variant="outline">v2.1</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            A privacy-friendly, theme-aware contribution graph.
          </p>
        </div>

        {/* Live Demo & Usage Card */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-4 border-b">
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Usage Code</TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Live Preview
                    </CardTitle>
                    <CardDescription>
                      Enter a username to test the API fetch.
                    </CardDescription>
                  </div>

                  {/* Controls */}
                  <div className="flex w-full md:w-auto items-center gap-2">
                    <Input
                      placeholder="Username..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="bg-background h-9 min-w-[200px]"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 bg-background shrink-0"
                      onClick={handleUpdateUser}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code">
                <div className="relative rounded-md bg-zinc-950 border border-zinc-800">
                  <div className="absolute right-4 top-4 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      onClick={() => handleCopyCode(USAGE_CODE)}
                    >
                      {copiedCode ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-4 overflow-x-auto max-h-[300px] text-xs font-mono leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700 text-zinc-300">
                    <pre>{USAGE_CODE}</pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="preview">
              {/* This Tabs is just to allow the 'preview' value from parent tabs to show content here. 
                   We only render content if parent tab is 'preview'. 
                   However, standard Shadcn Tabs don't nest state easily this way without context.
                   To keep it simple like TextWritingEffect, we just show the graph always in the body 
                   OR we hide it if 'code' is selected. 
                   For this specific request, I will render the graph in the body regardless, 
                   or check the Tabs state if using controlled component. 
                   Let's stick to the TextWritingEffect layout where the body content is the visualization.
               */}
              <GithubContributionsLive username={demoUser} />
            </Tabs>
          </CardContent>
        </Card>

        {/* Documentation Tabs */}

        {/* TAB 1: Installation */}
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
              <TabsContent key={key} value={key} className="mt-0">
                <Card className="rounded-tl-none rounded-tr-none border-t-0 bg-muted/50">
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

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileCode className="h-5 w-5" /> Environment Setup
          </h3>
          <p className="text-sm text-muted-foreground">
            Add this to your{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">
              .env.local
            </code>{" "}
            file to configure the username.
          </p>

          <Card className="bg-zinc-950 text-zinc-50 border-none relative group overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between font-mono text-sm">
              <div className="flex gap-2 truncate">
                <span className="text-blue-400">
                  NEXT_PUBLIC_GITHUB_USERNAME
                </span>
                <span className="text-zinc-500">=</span>
                <span className="text-green-400">your_github_username</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                onClick={() =>
                  handleCopyCommand(
                    'NEXT_PUBLIC_GITHUB_USERNAME="your_github_username"',
                    "env"
                  )
                }
              >
                {copyKey === "env" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy environment variable</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="py-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileCode className="h-5 w-5" /> Create Component
          </h3>
          <p className="text-sm text-muted-foreground">
            Copy the code below into{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">
              components/ui/github-contributions.tsx
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
              handleCopyCode(
                isTs ? COMPONENT_SOURCE_CODE_TS : COMPONENT_SOURCE_CODE_JS
              )
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
              <pre>
                {isTs ? COMPONENT_SOURCE_CODE_TS : COMPONENT_SOURCE_CODE_JS}
              </pre>
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
              This component fetches data from{" "}
              <code className="text-foreground bg-muted px-1 rounded">
                github-contributions-api.jogruber.de
              </code>
              . This is a proxy service that scrapes GitHub's public
              contribution graph because GitHub's official GraphQL API is
              complex to set up for simple public data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" /> Props
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PropCard
                name="username"
                type="string"
                desc="GitHub username. Falls back to env var."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function PropCard({ name, type, desc }) {
  return (
    <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
      <div className="flex items-center justify-between">
        <code className="text-sm font-bold">{name}</code>
      </div>
      <div className="text-xs font-mono text-blue-500">{type}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}

// --- CONSTANTS FOR CODE BLOCKS ---

const USAGE_CODE = `
import GithubContributions from "@/components/ui/github-contributions";

export default function Profile() {
    const username = process.env.GITHUB_USERNAME;
  return (
    <GithubContributions username={username} />
  );
}`;

const COMPONENT_SOURCE_CODE_JS = `"use client";

import { useEffect, useState, useCallback } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function GithubContributions({ username }) {
  const { theme, systemTheme } = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const targetUsername = username || process.env.NEXT_PUBLIC_GITHUB_USERNAME || "rimu-7";

  const fetchData = useCallback(async () => {
    if (!targetUsername) return;
    const controller = new AbortController();

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        \`https://github-contributions-api.jogruber.de/v4/\${targetUsername}?y=last\`,
        { signal: controller.signal }
      );

      if (!response.ok) throw new Error("Failed to fetch contribution data");
      
      const json = await response.json();
      if (!json?.contributions) {
        setData([]);
        setTotal(0);
        return;
      }

      setData(json.contributions);
      setTotal(json.contributions.reduce((sum, day) => sum + day.count, 0));
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Github API Error:", err);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
    return () => controller.abort();
  }, [targetUsername]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const colorTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  const renderBlock = (block, activity) => {
    const triggerItem = React.cloneElement(block, {
      className: "cursor-pointer hover:opacity-80 transition-opacity",
    });

    return (
      <Tooltip key={activity.date}>
        <TooltipTrigger asChild>{triggerItem}</TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground shadow-md border">
          <div className="text-xs text-center">
            <div className="font-bold">{activity.count === 0 ? "No" : activity.count} contributions</div>
            <div className="text-muted-foreground">{format(new Date(activity.date), "MMM d, yyyy")}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  if (error) {
    return (
      <Card className="border-none shadow-none bg-transparent">
        <Alert variant="destructive" className="bg-transparent border-none px-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Could not load GitHub data.</AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Card className="w-full mx-auto max-w-3xl border-none shadow-none bg-transparentt">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight">Github Contributions</CardTitle>
              {!isLoading && (
                <CardDescription>
                  <span className="font-medium text-foreground">{total}</span> contributions in the last year
                </CardDescription>
              )}
            </div>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href={\`https://github.com/\${targetUsername}\`} target="_blank">
                <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 mx-auto">
          {isLoading ? (
            <div className="space-y-2 min-w-2xl">
              <Skeleton className="h-36 w-full rounded-md opacity-50" />
              <div className="flex gap-2"><Skeleton className="h-4 w-24 opacity-50" /><Skeleton className="h-4 w-8 opacity-50" /></div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
              <div className="min-w-[700px]">
                <ActivityCalendar
                  data={data}
                  theme={colorTheme}
                  colorScheme={currentTheme === "dark" ? "dark" : "light"}
                  blockRadius={3}
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                  hideTotalCount
                  hideColorLegend={false}
                  renderBlock={renderBlock}
                  labels={{ legend: { less: "Less", more: "More" } }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}`;

const COMPONENT_SOURCE_CODE_TS = `"use client";

import { useEffect, useState, useCallback } from "react";
import { ActivityCalendar, type Activity, type ThemeInput } from "react-activity-calendar";
import { ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GithubContributionsProps {
  username?: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ApiResponse {
  total: {
    [year: number]: number;
    [year: string]: number;
  };
  contributions: ContributionDay[];
}

export default function GithubContributions({ username }: GithubContributionsProps) {
  const { theme, systemTheme } = useTheme();
  const [data, setData] = useState<ContributionDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const targetUsername = username || process.env.NEXT_PUBLIC_GITHUB_USERNAME || "rimu-7";

  const fetchData = useCallback(async () => {
    if (!targetUsername) return;
    const controller = new AbortController();

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(
        \`https://github-contributions-api.jogruber.de/v4/\${targetUsername}?y=last\`,
        { signal: controller.signal }
      );

      if (!response.ok) throw new Error("Failed to fetch contribution data");
      
      const json: ApiResponse = await response.json();
      if (!json?.contributions) {
        setData([]);
        setTotal(0);
        return;
      }

      setData(json.contributions);
      setTotal(json.contributions.reduce((sum, day) => sum + day.count, 0));
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Github API Error:", err);
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
    return () => controller.abort();
  }, [targetUsername]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const colorTheme: ThemeInput = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  const renderBlock = (block: React.ReactElement, activity: Activity) => {
    const triggerItem = React.cloneElement(block as React.ReactElement<any>, {
      className: "cursor-pointer hover:opacity-80 transition-opacity",
    });

    return (
      <Tooltip key={activity.date}>
        <TooltipTrigger asChild>{triggerItem}</TooltipTrigger>
        <TooltipContent side="top" className="bg-popover text-popover-foreground shadow-md border">
          <div className="text-xs text-center">
            <div className="font-bold">{activity.count === 0 ? "No" : activity.count} contributions</div>
            <div className="text-muted-foreground">{format(new Date(activity.date), "MMM d, yyyy")}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  if (error) {
    return (
      <Card className="border-none shadow-none bg-transparent">
        <Alert variant="destructive" className="bg-transparent border-none px-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Could not load GitHub data.</AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Card className="w-full mx-auto max-w-3xl border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight">Github Contributions</CardTitle>
              {!isLoading && (
                <CardDescription>
                  <span className="font-medium text-foreground">{total}</span> contributions in the last year
                </CardDescription>
              )}
            </div>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link href={\`https://github.com/\${targetUsername}\`} target="_blank">
                <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0 mx-auto">
          {isLoading ? (
            <div className="space-y-2 min-w-2xl">
              <Skeleton className="h-36 w-full rounded-md opacity-50" />
              <div className="flex gap-2"><Skeleton className="h-4 w-24 opacity-50" /><Skeleton className="h-4 w-8 opacity-50" /></div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
              <div className="min-w-[700px]">
                <ActivityCalendar
                  data={data}
                  theme={colorTheme}
                  colorScheme={currentTheme === "dark" === true ? "dark" : "light"}
                  blockRadius={3}
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                  hideTotalCount
                  hideColorLegend={false}
                  renderBlock={renderBlock}
                  labels={{ legend: { less: "Less", more: "More" } }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}`;

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
  Search,
  Info,
  Terminal,
  FileCode,
  FileType,
} from "lucide-react";
import Link from "next/link";

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
import { ChartLine } from "lucide-react";

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
            <div className="min-w-150">
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
      <Card className="w-full border-none shadow-none bg-transparent">
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
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div className="space-y-2">
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
      <Card className="w-full border-none shadow-none bg-transparent">
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
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div className="space-y-2">
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

export default function GithubGraphDemoPage() {
  const [demoUser, setDemoUser] = useState("rimu-7");
  const [inputValue, setInputValue] = useState("rimu-7");
  const [copiedCode, setCopiedCode] = useState(false);

  const [isTs, setIsTs] = useState(false);

  const [copyKey, setCopyKey] = useState(null);

  const commands = {
    npm: "npm install react-activity-calendar next-themes date-fns lucide-react sonner",
    pnpm: "pnpm add react-activity-calendar next-themes date-fns lucide-react sonner",
    yarn: "yarn add react-activity-calendar next-themes date-fns lucide-react sonner",
    bun: "bun add react-activity-calendar next-themes date-fns lucide-react sonner",
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setDemoUser(inputValue.trim());
    }
  };

  return (
    <div className="min-h-screen w-full bg-background lowercase p-6 md:p-12 flex justify-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              GitHub Activity Graph
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            A privacy-friendly, theme-aware contribution graph.
          </p>
        </div>

        {/* Live Demo Area */}
        <Card className="border shadow-sm">
          <CardHeader className=" pb-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  Live Preview
                </CardTitle>
                <CardDescription>
                  Enter a username to test the API fetch.
                </CardDescription>
              </div>
              <form
                onSubmit={handleSearch}
                className="flex w-full sm:max-w-xs items-center space-x-2"
              >
                <Input
                  placeholder="Username..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-background h-9"
                />
                <Button type="submit" size="sm" className="h-9">
                  <ChartLine className="h-4 w-4 mr-2" /> Show
                </Button>
              </form>
            </div>
          </CardHeader>
          <CardContent className="pt-6 mx-auto">
            <GithubContributionsLive username={demoUser} />
          </CardContent>
        </Card>

        {/* Documentation Tabs */}
        <Tabs defaultValue="install" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="install">installation</TabsTrigger>
            <TabsTrigger value="code">source code</TabsTrigger>
            <TabsTrigger value="info">how it works</TabsTrigger>
          </TabsList>

          {/* TAB 1: Installation */}
          <TabsContent value="install" className="space-y-6 pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Terminal className="h-5 w-5" /> Install Dependencies
              </h3>

              <Tabs defaultValue="npm" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  {Object.keys(commands).map((pkgManager) => (
                    <TabsTrigger
                      key={pkgManager}
                      value={pkgManager}
                      className="rounded-lg data-[state=active]:border-primary data-[state=active]:bg-transparent px-4"
                    >
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

            {/* Environment Setup Section */}
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
          </TabsContent>

          {/* TAB 2: Source Code */}
          <TabsContent value="code" className="pt-6 relative">
            {/* Control Bar (Toggle JS/TS & Copy) */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Label
                  htmlFor="ts-mode"
                  className="text-sm font-medium text-muted-foreground"
                >
                  JS
                </Label>
                <Switch id="ts-mode" checked={isTs} onCheckedChange={setIsTs} />
                <Label
                  htmlFor="ts-mode"
                  className="text-sm font-bold flex items-center gap-1"
                >
                  TS <FileType className="h-3 w-3" />
                </Label>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-2 shadow-sm"
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
          </TabsContent>

          {/* TAB 3: How it Works */}
          <TabsContent value="info" className="pt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Source</CardTitle>
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
                <CardTitle>Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">SVG & Tooltips</h4>
                  <p className="text-xs text-muted-foreground">
                    The calendar renders as an SVG. We use{" "}
                    <code>React.cloneElement</code> to inject Shadcn Tooltip
                    triggers directly into the SVG rects, ensuring high
                    performance.
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Theme Aware</h4>
                  <p className="text-xs text-muted-foreground">
                    It uses the <code>next-themes</code> hook to detect if your
                    site is in Dark or Light mode and swaps the green palette
                    accordingly (brighter greens for dark mode).
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Container from "./Container";

export default function GithubContributions({username}) {
  const { theme, systemTheme } = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // CHANGED: Use NEXT_PUBLIC_ prefix to access env vars on the client

  const fetchData = useCallback(async () => {
    // If no username is set, stop early
    if (!username) return;

    const controller = new AbortController();

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contribution data");
      }

      const json = await response.json();

      if (!json?.contributions) {
        setData([]);
        setTotal(0);
        return;
      }

      setData(json.contributions);

      const totalCount = json.contributions.reduce(
        (sum, day) => sum + day.count,
        0
      );
      setTotal(totalCount);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Github API Error:", err);
        setError(err.message);
      }
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
      <Container >
        <Alert
          variant="destructive"
          className="bg-transparent border-none px-0"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Could not load GitHub data.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Card className="w-full border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold tracking-tight">
                Github Contributions
              </CardTitle>
              {!isLoading && (
                <CardDescription>
                  <span className="font-medium text-foreground">{total}</span>{" "}
                  contributions in the last year
                </CardDescription>
              )}
            </div>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View GitHub Profile"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-36 min-w-2xl rounded-md opacity-50" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24 opacity-50" />
                <Skeleton className="h-4 w-8 opacity-50" />
              </div>
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
                  labels={{
                    legend: {
                      less: "Less",
                      more: "More",
                    },
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

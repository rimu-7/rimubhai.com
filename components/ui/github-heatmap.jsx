"use client";
import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import {
  ExternalLink,
  AlertCircle,
  GitCommit,
  GitPullRequest,
  MessageSquare,
  User,
  Clock,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { format, parseISO, subDays } from "date-fns";

import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            name
            owner {
              login
            }
          }
          contributions(first: 100) {
            nodes {
              occurredAt
              url
            }
          }
        }
        pullRequestContributions(first: 100) {
          nodes {
            occurredAt
            pullRequest {
              number
              title
              url
              repository {
                name
                owner {
                  login
                }
              }
            }
          }
        }
        issueContributions(first: 100) {
          nodes {
            occurredAt
            issue {
              number
              title
              url
              repository {
                name
                owner {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function GithubHeatMap({ username }) {
  const { theme, systemTheme } = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const colorTheme = {
    light: ["#ebedf0", "#d1fae5", "#6ee7b7", "#10b981", "#047857"],
    dark: ["#1f2937", "#064e3b", "#047857", "#10b981", "#34d399"],
  };

  const fetchGitHubData = async (user) => {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    if (!token) {
      throw new Error("GitHub token not configured");
    }

    const to = new Date().toISOString();
    const from = subDays(new Date(), 365).toISOString();

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username: user, from, to },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result.data.user.contributionsCollection;
  };

  const processContributions = (collection) => {
    // Group by date and repo
    const commitsByDate = new Map();

    // Process commits - group by date and repo
    collection.commitContributionsByRepository?.forEach((repoContrib) => {
      const repoName = repoContrib.repository.name;
      const repoOwner = repoContrib.repository.owner.login;

      repoContrib.contributions?.nodes?.forEach((contrib) => {
        const date = contrib.occurredAt.split("T")[0];

        if (!commitsByDate.has(date)) {
          commitsByDate.set(date, new Map());
        }

        const dateRepos = commitsByDate.get(date);
        const key = `${repoOwner}/${repoName}`;

        if (dateRepos.has(key)) {
          // Increment count for existing repo
          const existing = dateRepos.get(key);
          existing.count += 1;
        } else {
          // Add new repo entry
          dateRepos.set(key, {
            hash: contrib.url?.split("/").pop() || "",
            repo: repoName,
            repoOwner: repoOwner,
            timestamp: contrib.occurredAt,
            type: "commit",
            count: 1,
          });
        }
      });
    });

    // Process PRs
    collection.pullRequestContributions?.nodes?.forEach((contrib) => {
      const date = contrib.occurredAt.split("T")[0];

      if (!commitsByDate.has(date)) {
        commitsByDate.set(date, new Map());
      }

      const dateRepos = commitsByDate.get(date);
      const key = `pr-${contrib.pullRequest.number}`;

      dateRepos.set(key, {
        hash: String(contrib.pullRequest.number),
        repo: contrib.pullRequest.repository.name,
        repoOwner: contrib.pullRequest.repository.owner.login,
        timestamp: contrib.occurredAt,
        type: "pr",
        count: 1,
      });
    });

    // Process Issues
    collection.issueContributions?.nodes?.forEach((contrib) => {
      const date = contrib.occurredAt.split("T")[0];

      if (!commitsByDate.has(date)) {
        commitsByDate.set(date, new Map());
      }

      const dateRepos = commitsByDate.get(date);
      const key = `issue-${contrib.issue.number}`;

      dateRepos.set(key, {
        hash: String(contrib.issue.number),
        repo: contrib.issue.repository.name,
        repoOwner: contrib.issue.repository.owner.login,
        timestamp: contrib.occurredAt,
        type: "issue",
        count: 1,
      });
    });

    // Build day data from calendar
    const dayData = [];
    let totalCount = 0;

    collection.contributionCalendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const dateCommits = Array.from(
          commitsByDate.get(day.date)?.values() || [],
        );

        // If we have a count but no detailed commits, show generic activity
        if (day.contributionCount > 0 && dateCommits.length === 0) {
          dateCommits.push({
            hash: "activity",
            repo: "Other activity",
            repoOwner: username,
            timestamp: `${day.date}T12:00:00Z`,
            type: "commit",
            count: day.contributionCount,
          });
        }

        dayData.push({
          date: day.date,
          count: day.contributionCount,
          level: getLevel(day.contributionLevel),
          commits: dateCommits,
        });

        totalCount += day.contributionCount;
      });
    });

    return { dayData, totalCount };
  };

  const getLevel = (level) => {
    switch (level) {
      case "NONE":
        return 0;
      case "FIRST_QUARTILE":
        return 1;
      case "SECOND_QUARTILE":
        return 2;
      case "THIRD_QUARTILE":
        return 3;
      case "FOURTH_QUARTILE":
        return 4;
      default:
        return 0;
    }
  };

  const fetchData = useCallback(async () => {
    if (!username) return;

    try {
      setIsLoading(true);
      setError(null);

      const collection = await fetchGitHubData(username);
      const { dayData, totalCount } = processContributions(collection);

      setData(dayData);
      setTotal(totalCount);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCellClick = (day) => {
    setSelectedDate(day);
    setDialogOpen(true);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "pr":
        return <GitPullRequest className="w-4 h-4 text-blue-500" />;
      case "issue":
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case "review":
        return <User className="w-4 h-4 text-purple-500" />;
      default:
        return <GitCommit className="w-4 h-4 text-emerald-500" />;
    }
  };

  const renderBlock = (block, activity) => {
    const trigger = React.cloneElement(block, {
      className:
        "cursor-pointer hover:opacity-80 transition-all duration-200 hover:ring-2 hover:ring-emerald-500/50 hover:ring-offset-1 dark:hover:ring-offset-zinc-950",
      onClick: () => handleCellClick(activity),
    });

    return (
      <Tooltip key={activity.date}>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="hidden sm:block bg-zinc-900 text-white dark:bg-slate-50 dark:text-zinc-900 px-3 py-2 border-none shadow-lg"
        >
          <p className="font-semibold text-sm mb-1">
            {format(parseISO(activity.date), "MMMM d, yyyy")}
          </p>
          <p className="text-xs text-zinc-300 dark:text-slate-600">
            {activity.count}{" "}
            {activity.count === 1 ? "contribution" : "contributions"}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  };

  const GraphSkeleton = () => (
    <div className="flex gap-1 py-0.5 min-h-3xl">
      {Array.from({ length: 53 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          {Array.from({ length: 10 }).map((_, j) => (
            <Skeleton key={j} className="w-3 h-3 rounded-[2px]" />
          ))}
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="border-red-200 dark:border-red-900"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load GitHub data: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="overflow-hidden min-h-3xl border-none bg-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://github.com/${username}.png`}
                alt={username}
              />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                {username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">GitHub Contributions</CardTitle>
              {isLoading ? (
                <CardDescription>
                  <Skeleton className="w-24 h-4 mt-1" />
                </CardDescription>
              ) : (
                <CardDescription>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {total.toLocaleString()}
                  </span>{" "}
                  contributions last year
                </CardDescription>
              )}
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            asChild
            className="hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            <Link
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="">
          {isLoading ? (
            <div className="overflow-x-auto pb-4">
              <div className="w-fit">
                <GraphSkeleton />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="w-fit">
                <ActivityCalendar
                  data={data}
                  theme={colorTheme}
                  colorScheme={currentTheme === "dark" ? "dark" : "light"}
                  blockSize={12}
                  blockMargin={4}
                  blockRadius={3}
                  hideTotalCount
                  renderBlock={renderBlock}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {selectedDate &&
                    format(parseISO(selectedDate.date), "MMMM d, yyyy")}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedDate?.count || 0}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    contributions
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Separator />

          <ScrollArea className="max-h-[400px]">
            <div className="p-6 space-y-4">
              {selectedDate?.commits && selectedDate.commits.length > 0 ? (
                selectedDate.commits.map((commit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                  >
                    <div className="mt-0.5">{getActivityIcon(commit.type)}</div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{commit.repo}</p>
                        {commit.count > 1 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          >
                            {commit.count} commits
                          </Badge>
                        )}
                        {commit.type === "pr" && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            PR #{commit.hash}
                          </Badge>
                        )}
                        {commit.type === "issue" && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          >
                            Issue #{commit.hash}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1 font-mono">
                          <Hash className="w-3 h-3" />
                          {commit.hash.substring(0, 7)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(parseISO(commit.timestamp), "HH:mm")}
                        </span>
                      </div>
                    </div>

                    {/* Link to repo */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      asChild
                    >
                      <Link
                        href={`https://github.com/${commit.repoOwner}/${commit.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`View ${commit.repoOwner}/${commit.repo}`}
                      >
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GitCommit className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No contributions on this day</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-4 bg-slate-50 dark:bg-zinc-900/50 flex justify-between items-center">
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                <GitCommit className="w-3 h-3 mr-1" />
                Commits
              </Badge>
              <Badge variant="outline" className="text-xs">
                <GitPullRequest className="w-3 h-3 mr-1" />
                PRs
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Profile
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

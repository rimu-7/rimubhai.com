"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Github } from "lucide-react";
import { useEffect, useState } from "react";

function formatFullNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

export function GitHubStars({ repo, initialStars = 0 }) {
  const [stars, setStars] = useState(initialStars);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(initialStars === 0);

  useEffect(() => {
    if (initialStars > 0) return;

    const fetchStars = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`);

        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status}`);
        }

        const data = await res.json();
        setStars(data.stargazers_count || 0);
      } catch (err) {
        console.error("Failed to fetch GitHub stars:", err);
        setError("Failed to load stars");
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
  })
    .format(stars)
    .toLowerCase();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            className="flex items-center w-fit gap-2 px-3 text-muted-foreground hover:text-primary transition-colors"
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={`https://github.com/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Star ${repo} on GitHub`}
            >
              {/* GitHub Icon */}
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
                aria-hidden="true"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="h-4 w-px bg-border mx-1" aria-hidden="true" />

              <span className="text-[13px] tabular-nums min-w-[2ch]">
                {loading ? "—" : formattedCompact}
              </span>
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="font-sans" side="top">
          <div className="flex flex-col gap-1">
            <span>{formatFullNumber(stars)} stars on GitHub</span>
            {error && <span className="text-xs text-red-400">{error}</span>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

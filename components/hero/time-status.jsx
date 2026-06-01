"use client";

import { getOffsetDiffHours } from "@/lib/utils/time";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function TimeStatus() {
  const [timeInfo, setTimeInfo] = useState({ beijingTime: "--:--", diffLabel: "" });

  useEffect(() => {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const beijingTz = "Asia/Shanghai";

    const updateTime = () => {
      const now = new Date();
      const beijingString = new Intl.DateTimeFormat("en-US", {
        timeZone: beijingTz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(now);

      const diff = getOffsetDiffHours(userTz, beijingTz);
      let label =
        diff === 0 ? "same time zone" : diff > 0 ? `${diff}h ahead` : `${Math.abs(diff)}h behind`;

      setTimeInfo({ beijingTime: beijingString, diffLabel: label });
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-3.5 w-3.5 text-primary" />
      <span className="font-medium text-foreground tabular-nums">{timeInfo.beijingTime}</span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">CN</span>
      <span className="text-muted-foreground/40">&middot;</span>
      <span className="text-muted-foreground/60">{timeInfo.diffLabel}</span>
    </div>
  );
}

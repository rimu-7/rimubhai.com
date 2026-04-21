"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function HeatmapSkeleton() {
  return (
    <div className="w-full mb-12 space-y-4 py-8">
      <Skeleton className="h-10 w-1/3 max-w-[250px]" />
      <Skeleton className="h-4 w-2/3 max-w-[500px]" />
      <div className="space-y-4 mt-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

const GithubHeatMap = dynamic(
  () =>
    import("@/components/ui/github-heatmap").then((mod) => mod.GithubHeatMap),
  {
    ssr: false,
    loading: () => <HeatmapSkeleton />,
  },
);

export default function GithubHeatMapWrapper(props) {
  return <GithubHeatMap {...props} />;
}

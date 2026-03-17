import { getCurrentUser } from "@/lib/auth";
import TimelinePageShell from "@/components/timeline/timeline-page-shell";
import TimelineCollection from "@/components/timeline/timeline-collection";

export const metadata = {
  title: "Life Events | Portfolio",
};

export default async function LifeEvents() {
  const user = await getCurrentUser();

  return (
    <TimelinePageShell
      title="Life Events"
      description="Meaningful milestones, transitions, and memories across my journey."
    >
      <TimelineCollection variant="life-events" canManage={Boolean(user)} />
    </TimelinePageShell>
  );
}
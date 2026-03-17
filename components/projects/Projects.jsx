import { getCurrentUser } from "@/lib/auth";
import TimelinePageShell from "@/components/timeline/timeline-page-shell";
import TimelineCollection from "@/components/timeline/timeline-collection";

export const metadata = {
  title: "Projects | Portfolio",
};

export default async function Projects() {
  const user = await getCurrentUser();

  return (
    <TimelinePageShell
      title="Projects"
      description="Selected builds, experiments, and shipped work."
    >
      <TimelineCollection variant="projects" canManage={Boolean(user)} />
    </TimelinePageShell>
  );
}
import Container from "@/components/Container";
import ExperienceList from "./experience-list";
import TimelinePageShell from "../timeline/timeline-page-shell";
import TimelineCollection from "../timeline/timeline-collection";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Projects | Portfolio",
};

export default async function Experiences() {
  const user = await getCurrentUser();
  return (
    <TimelinePageShell
      title="Experience"
      description="A timeline of my professional growth and technical milestones."
    >
      <TimelineCollection variant="experience" canManage={Boolean(user)} />
    </TimelinePageShell>
  );
}

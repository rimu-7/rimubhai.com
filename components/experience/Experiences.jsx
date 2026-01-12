import Container from "@/components/Container";
import ExperienceList from "./experience-list";

export const metadata = {
  title: "Projects | Portfolio",
};

export default async function Experiences() {
  return (
    <div className="py-10">
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          experiences
        </h1>
        <p className="text-muted-foreground">
          A timeline of my professional growth and technical milestones.
        </p>
      </div>

      <ExperienceList />
    </div>
  );
}

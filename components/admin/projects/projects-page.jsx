import { getCurrentUser } from "@/lib/auth";
import ProjectList from "../../projects/project-lists";
import Container from "@/components/Container";

export const metadata = {
  title: "Projects | Portfolio",
  description: "A showcase of my recent technical work and designs.",
};

export default async function ProjectsPage() {
  const user = await getCurrentUser();

  return (
    <div className="py-10">
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Projects
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          A collection of applications, experiments, and tools I've built.
        </p>
      </div>

      <ProjectList user={user} />
    </div>
  );
}

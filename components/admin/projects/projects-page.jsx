import { getCurrentUser } from "@/lib/auth";
import ProjectList from "./project-lists";
import Container from "@/components/Container";

export const metadata = {
  title: "Projects | Portfolio",
};

export default async function ProjectsPage() {
  // 1. Fetch user server-side securely
  const user = await getCurrentUser();

  return (
    <Container>
      <div className="">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Projects
        </h1>
        <p className="text-muted-foreground">
          Check out what I've been building recently.
        </p>
      </div>

      {/* 2. Pass user prop (null if not logged in) */}
      <ProjectList user={user} />
    </Container>
  );
}

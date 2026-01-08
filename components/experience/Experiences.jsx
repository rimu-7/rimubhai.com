import Container from "@/components/Container";
import ExperienceList from "./experience-list";

export const metadata = {
  title: "Projects | Portfolio",
};

export default async function Experiences() {
  return (
    <Container>
      <div className="">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          experiences
        </h1>
        <p className="text-muted-foreground">
          A timeline of my professional growth and technical milestones.
        </p>
      </div>

      <ExperienceList />
    </Container>
  );
}

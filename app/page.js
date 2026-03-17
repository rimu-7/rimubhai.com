import Hero from "@/components/hero/Hero";
import AboutPage from "./about/about-page";
// import FeaturedBlogs from "./blogs/FeaturedBlogs";
import ProjectsPage from "@/components/admin/projects/projects-page";
import Experiences from "@/components/experience/Experiences";
import Container from "@/components/Container";
import LifeEvents from "@/components/life-events/LifeEvents";
import Awards from "@/components/awards/Awards";
import { GithubHeatMap } from "@/components/ui/github-heatmap";
import Projects from "@/components/projects/Projects";

export default function Home() {
  return (
    <Container>
      <Hero />
      <AboutPage />
      <Projects/>
      <GithubHeatMap username="rimu-7" />
      <Experiences />
      <LifeEvents />
      <Awards />
    </Container>
  );
}

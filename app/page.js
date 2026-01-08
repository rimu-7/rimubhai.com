import Hero from "@/components/hero/Hero";
import AboutPage from "./about/about-page";
import GithubHeatmap from "@/components/GithubHeatmap";
import FeaturedBlogs from "./blogs/FeaturedBlogs";
import ProjectsPage from "@/components/admin/projects/projects-page";
import Experiences from "@/components/experience/Experiences";
import Container from "@/components/Container";
import LifeEvents from "@/components/life-events/LifeEvents";

export default function Home() {
  return (
    <Container >
      <Hero />
      <AboutPage />
      <ProjectsPage/>
      <GithubHeatmap username="rimu-7"/>
      <FeaturedBlogs/>
      <Experiences/>
      <LifeEvents/>
    </Container>
  );
}



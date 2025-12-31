import Hero from "@/components/hero/Hero";
import AboutPage from "./about/about-page";
import GithubHeatmap from "@/components/GithubHeatmap";

export default function Home() {
  return (
    <main className="relative space-y-3 max-w-3xl mx-auto flex flex-col px-4 sm:px-6">
      <Hero />
      <AboutPage />
      <GithubHeatmap />
    </main>
  );
}

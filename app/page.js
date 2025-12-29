import Hero from "@/components/hero/Hero";
import AboutPage from "./about/about-page";

export default function Home() {
  return (
    <main className="relative min-h-screen max-w-3xl mx-auto flex flex-col">
      <Hero />
      <AboutPage/>
    </main>
  );
}
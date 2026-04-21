import { Suspense } from "react";
import Hero from "@/components/hero/Hero";
import AboutPage from "./about/about-page";
import Experiences from "@/components/experience/Experiences";
import Container from "@/components/Container";
import LifeEvents from "@/components/life-events/LifeEvents";
import Awards from "@/components/awards/Awards";
import Projects from "@/components/projects/Projects";
import { Skeleton } from "@/components/ui/skeleton";

// Import the new wrapper component
import GithubHeatMapWrapper from "@/components/GithubHeatMapWrapper";

function SectionSkeleton() {
  return (
    <div className="w-full mb-12 space-y-4 py-8">
      <Skeleton className="h-10 w-1/3 max-w-[250px]" />
      <Skeleton className="h-4 w-2/3 max-w-[500px]" />
      <div className="space-y-4 mt-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Container>
      <Hero />

      <Suspense fallback={<SectionSkeleton />}>
        <AboutPage />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Projects />
      </Suspense>

      {/* Use the wrapper component here */}
      <GithubHeatMapWrapper username="rimu-7" />

      <Suspense fallback={<SectionSkeleton />}>
        <Experiences />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <LifeEvents />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <Awards />
      </Suspense>
    </Container>
  );
}

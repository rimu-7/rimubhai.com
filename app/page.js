export const revalidate = 300; // Cache and revalidate page data every 5 minutes

import Awards from "@/components/awards/Awards";
import Container from "@/components/Container";
import Experiences from "@/components/experience/Experiences";
import GithubHeatMapWrapper from "@/components/GithubHeatMapWrapper";
import Hero from "@/components/hero/Hero";
import JsonLd from "@/components/JsonLd";
import LifeEvents from "@/components/life-events/LifeEvents";
import Projects from "@/components/projects/Projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import About from "./about/page";

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

export const metadata = {
  title: "Mutasim Fuad Rimu (Rimu Bhai) | Full Stack Developer",
  description:
    "Official website of Mutasim Fuad Rimu, also known as Rimu Bhai or Fuad Bhai. A Full Stack Developer specializing in Next.js, React, and Node.js.",
};

export default function Home() {
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mutasim Fuad Rimu",
    alternateName: ["rimubhai", "Rimu Bhai", "Fuad Bhai"],
    url: "https://rimubhai.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://rimubhai.com/?s={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main>
      <JsonLd schema={webSiteSchema} />
      <Container>
        <section aria-label="Hero">
          <Hero />
        </section>

        <section aria-label="About Me">
          {/* <Suspense fallback={<SectionSkeleton />}> */}
          {/* <AboutPage /> */}
          <About />
          {/* </Suspense> */}
        </section>

        <section aria-label="Projects">
          <Suspense fallback={<SectionSkeleton />}>
            <Projects />
          </Suspense>
        </section>

        <section aria-label="Github Activity">
          <GithubHeatMapWrapper username="rimu-7" />
        </section>

        <section aria-label="Experience">
          <Suspense fallback={<SectionSkeleton />}>
            <Experiences />
          </Suspense>
        </section>

        <section aria-label="Life Events">
          <Suspense fallback={<SectionSkeleton />}>
            <LifeEvents />
          </Suspense>
        </section>

        <section aria-label="Awards">
          <Suspense fallback={<SectionSkeleton />}>
            <Awards />
          </Suspense>
        </section>
      </Container>
    </main>
  );
}

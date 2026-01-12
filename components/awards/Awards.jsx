import { getCurrentUser } from "@/lib/auth"; // Make sure to import this
import AwardList from "./awards-list";

export const metadata = {
  title: "Honors & Awards | Portfolio",
};

export default async function Awards() {
  // 1. Fetch user to enable Admin features (Edit/Delete)
  const user = await getCurrentUser();

  return (
    <div className="py-10 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight capitalize">
          Honors & Awards
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          A collection of milestones, certifications, and recognitions I've earned along the way.
        </p>
      </div>
      
      {/* 2. Pass the user prop */}
      <AwardList user={user} />
    </div>
  );
}
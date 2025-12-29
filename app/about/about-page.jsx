import { getCurrentUser } from "@/lib/auth";
import AboutSection from "./about-section";

export default async function AboutPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen w-full flex justify-center py-10 px-4">
      {/* We pass the user prop to determine if Admin mode is active */}
      <AboutSection user={user} />
    </div>
  );
}

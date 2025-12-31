import { getCurrentUser } from "@/lib/auth";
import AboutSection from "./about-section";

export default async function AboutPage() {
  const user = await getCurrentUser();

  return (
    <div className="w-full flex justify-centerpy-4 ">
      <AboutSection user={user} />
    </div>
  );
}

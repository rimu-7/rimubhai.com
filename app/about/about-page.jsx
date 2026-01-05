import { getCurrentUser } from "@/lib/auth";
import AboutSection from "./about-section";

export default async function AboutPage() {
  const user = await getCurrentUser();

  return (
    <div className="">

      <AboutSection user={user} />
    </div>
  );
}



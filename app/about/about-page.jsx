import { getCurrentUser } from "@/lib/auth";
import AboutSection from "./about-section";

export default async function AboutPage() {
  const user = await getCurrentUser();

  return (
    <div className="">
      <p>okbhai</p>
      <AboutSection user={user} />
    </div>
  );
}

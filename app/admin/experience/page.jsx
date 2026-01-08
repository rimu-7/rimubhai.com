// app/admin/experience/page.jsx
import ExperienceManager from "@/components/admin/ExperienceManager";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminExperiencePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/"); // Protect route

  return <ExperienceManager />;
}
import ProjectManagerClient from "@/components/admin/projects/project-client";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Projects | Admin",
};

export default async function AdminProjectsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return <ProjectManagerClient />;
}
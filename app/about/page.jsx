import { getCurrentUser } from "@/lib/auth";
import React from "react";
import AdminPage from "./admin-about";

export default async function About() {
  const user = await getCurrentUser();
  if (user) {
    return <AdminPage />;
  }
  return <div>about</div>;
}

import { getCurrentUser } from "@/lib/auth";
import { User2, LogIn } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function Userinfo() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        title={`Logged in as ${user.name}`}
        className="hover:text-blue-500 transition-colors"
      >
        <User2 className="w-6 h-6" />
      </Link>
    </div>
  );
}

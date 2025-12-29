"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    // Call logout API
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Logged out");
    router.refresh();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back,{" "}
            <span className="font-semibold text-foreground">{user.name}</span>
            <span className="text-lg">{user.email}</span>
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="border-2 border-transparent hover:border-dashed hover:border-2 hover:border-foreground"
        >
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        component will be show here
      </div>
    </div>
  );
}

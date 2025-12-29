"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

async function readResponse(res) {
  const ct = res.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) return await res.json();
    return { message: await res.text() };
  } catch {
    return { message: "Unexpected server response" };
  }
}

export default function AuthForm() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // When switching modes, clear register-only fields (and password fields for safety)
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: "",
      password: "",
      confirmPassword: "",
    }));
  }, [isLogin]);

  const onChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isLogin) {
      if (password.length < 6) {
        toast.error("Password should be at least 6 characters.");
        return;
      }
      if (password !== form.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin ? { email, password } : { name, email, password };

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || "Request failed");
      }

      if (isLogin) {
        toast.success("Welcome back, Admin");
        router.replace("/dashboard");
        router.refresh();
      } else {
        toast.success("Admin created! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 border rounded-xl bg-card shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{isLogin ? "Login" : "Register"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isLogin
            ? "Sign in to access your dashboard."
            : "Create an admin account (limited)."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={onChange("name")}
              placeholder="Your name"
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={onChange("email")}
            placeholder="admin@example.com"
            required
            disabled={loading}
            autoComplete="email"
            inputMode="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={onChange("password")}
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange("confirmPassword")}
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLogin ? "Sign In" : "Register"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsLogin((v) => !v)}
          disabled={loading}
          className="text-sm text-muted-foreground hover:text-primary underline transition-colors disabled:opacity-60 disabled:pointer-events-none"
        >
          {isLogin ? "Need to register?" : "Back to login"}
        </button>
      </div>
    </div>
  );
}

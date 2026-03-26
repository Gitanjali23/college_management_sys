"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      const fieldErrors: { email?: string; password?: string } = {
        email: formattedErrors.email?.[0],
        password: formattedErrors.password?.[0],
      };
      setErrors(fieldErrors);
      return;
    }

    // Role-based Login Logic
    const role = email === "admin@test.com" ? "admin" : "member";
    
    // Fake login check (password is simplified for testing)
    if (password === "123456") {
      login(email, role);
      router.push("/dashboard");
    } else {
      setErrors({ general: "Invalid password. Try 123456" });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-sm p-8 bg-white border border-zinc-200 rounded-3xl shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
        <h2 className="mb-6 text-2xl font-black text-center text-zinc-900 dark:text-zinc-50 tracking-tight">Login to CMS</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
            {errors.general}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@test.com"
            error={errors.email}
          />

          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
          />

          <Button type="submit" className="w-full h-11">
            Log in
          </Button>

          <div className="text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500 font-bold hover:text-blue-600 transition-colors">
                Sign up
              </Link>
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold border-t border-zinc-100 dark:border-zinc-800 pt-6">
              Test Users
            </p>
            <p className="text-[10px] text-zinc-400 mt-1">
              Admin: admin@test.com | Member: any@email.com
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

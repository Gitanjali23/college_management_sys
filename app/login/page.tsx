"use client";

import React, { useState, useEffect } from "react";
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
  const [registeredMsg, setRegisteredMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('registered') === 'true') {
      setRegisteredMsg(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      const fieldErrors: { email?: string; password?: string } = {
        email: formattedErrors.email?.[0],
        password: formattedErrors.password?.[0],
      };
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.email, data.role, data.token);
        router.push("/dashboard");
      } else {
        setErrors({ general: data.message || "Invalid email or password" });
      }
    } catch (error) {
      setErrors({ general: "Failed to connect to the server." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-zinc-50 dark:bg-black relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full h-full max-w-4xl opacity-30 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/2 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white/80 backdrop-blur-xl border border-zinc-200 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-zinc-200/50 dark:bg-zinc-950/80 dark:border-zinc-800 dark:shadow-none">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter mb-3">Welcome Back</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Log in to your portal to continue</p>
          </div>
          
          {registeredMsg && (
            <div className="mb-6 p-4 text-sm font-semibold text-green-700 bg-green-50 border border-green-100 rounded-2xl dark:bg-green-900/10 dark:text-green-400 dark:border-green-900/20 animate-in fade-in slide-in-from-top-1">
              Registration successful! Please log in below.
            </div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
              {errors.general}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex. admin@college.edu"
              error={errors.email}
            />

            <div className="space-y-1">
              <Input
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                error={errors.password}
              />
              <div className="flex justify-end pt-1">
                <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-base mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : "Sign In"}
            </Button>

            <div className="text-center pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                New to the system?{" "}
                <Link href="/signup" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

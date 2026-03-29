"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "member"]),
});

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({ name, email, password, role });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      const fieldErrors: { name?: string; email?: string; password?: string } = {
        name: formattedErrors.name?.[0],
        email: formattedErrors.email?.[0],
        password: formattedErrors.password?.[0],
      };
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (data.success) {
        login(data.email, data.role, data.token);
        router.push("/dashboard");
      } else {
        setErrors({ general: data.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ general: "Failed to connect to the server." });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-zinc-50 dark:bg-black relative overflow-hidden">
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md p-10 bg-white border border-zinc-200 rounded-[32px] shadow-xl shadow-zinc-200/50 dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Create an Account</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 font-medium">Join the intelligent campus platform.</p>
        </div>
        
        {errors.general && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
            {errors.general}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleRegister}>
          <Input
            label="Full Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            error={errors.name}
          />
          
          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@college.edu"
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
          
          <div>
            <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setRole("member")}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                  role === "member" 
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400"
                }`}
              >
                Student / Member
              </button>
              <button 
                type="button"
                onClick={() => setRole("admin")}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                  role === "admin" 
                    ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" 
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-400"
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg mt-4">
            Create Account
          </Button>

          <div className="text-center mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 font-bold hover:text-blue-600 transition-colors">
                Log in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

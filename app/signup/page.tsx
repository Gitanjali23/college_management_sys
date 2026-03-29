"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["student", "teacher", "admin"], {
    message: "Please select a valid role",
  }),
});

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "admin" | "">("");
  
  // Role specific states
  const [studentId, setStudentId] = useState("");
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [adminSecret, setAdminSecret] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    studentId?: string;
    branch?: string;
    department?: string;
    designation?: string;
    adminSecret?: string;
    general?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const result = signupSchema.safeParse({ name, email, password, role });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: formattedErrors.name?.[0],
        email: formattedErrors.email?.[0],
        password: formattedErrors.password?.[0],
        role: formattedErrors.role?.[0],
      });
      setIsLoading(false);
      return;
    }

    // Manual validation for role-specific fields
    if (role === "student") {
      if (!studentId) {
        setErrors(prev => ({ ...prev, studentId: "Student ID is required" }));
        setIsLoading(false);
        return;
      }
      if (!branch) {
        setErrors(prev => ({ ...prev, branch: "Branch is required" }));
        setIsLoading(false);
        return;
      }
    } else if (role === "teacher") {
      if (!department) {
        setErrors(prev => ({ ...prev, department: "Department is required" }));
        setIsLoading(false);
        return;
      }
      if (!designation) {
        setErrors(prev => ({ ...prev, designation: "Designation is required" }));
        setIsLoading(false);
        return;
      }
    } else if (role === "admin") {
      if (!adminSecret) {
        setErrors(prev => ({ ...prev, adminSecret: "Admin Secret Key is required" }));
        setIsLoading(false);
        return;
      }
    }

    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === "student" && { studentId, branch }),
        ...(role === "teacher" && { department, designation }),
        ...(role === "admin" && { adminSecret }),
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        setErrors({ general: data.message || "Failed to sign up" });
      }
    } catch (error) {
      setErrors({ general: "Failed to connect to the server." });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: "student", label: "Student", icon: "🎓", desc: "Access courses & events" },
    { id: "teacher", label: "Teacher", icon: "👨‍🏫", desc: "Manage classes & notices" },
    { id: "admin", label: "Admin", icon: "🔐", desc: "System administration" },
  ] as const;

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-zinc-50 dark:bg-black relative overflow-hidden py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-400 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-400 rounded-full blur-[128px]"></div>
      </div>

      <div className="w-full max-w-xl z-10 transition-all duration-500">
        <div className="bg-white/80 backdrop-blur-xl border border-zinc-200 p-8 md:p-10 rounded-[40px] shadow-2xl shadow-zinc-200/50 dark:bg-zinc-950/80 dark:border-zinc-800 dark:shadow-none transition-all">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter mb-2">Create Account</h2>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Join our college management portal</p>
          </div>
          
          {errors.general && (
            <div className="mb-6 p-4 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-2xl dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
              {errors.general}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSignup}>
            {/* Visual Role Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold tracking-tight text-zinc-800 dark:text-zinc-200 ml-1">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-[28px] border-2 transition-all duration-300 group ${
                      role === r.id
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                        : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                    }`}
                  >
                    <span className={`text-2xl mb-2 transition-transform duration-300 group-hover:scale-110 ${role === r.id ? "scale-110" : ""}`}>
                      {r.icon}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">{r.label}</span>
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-xs font-medium text-red-500 mt-2 ml-1">{errors.role}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Saurabh Jaiswal"
                error={errors.name}
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@college.edu"
                error={errors.email}
              />
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Conditional UI for Student */}
              {role === "student" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-blue-50/30 rounded-[32px] border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20 animate-in fade-in zoom-in-95 duration-500">
                  <Input
                    label="Student Roll No."
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Ex. 2021CS101"
                    error={errors.studentId}
                  />
                  <Input
                    label="Branch / Discipline"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Ex. Computer Science"
                    error={errors.branch}
                  />
                </div>
              )}

              {/* Conditional UI for Teacher */}
              {role === "teacher" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-purple-50/30 rounded-[32px] border border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/20 animate-in fade-in zoom-in-95 duration-500">
                  <Input
                    label="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ex. Mathematics"
                    error={errors.department}
                  />
                  <Input
                    label="Designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Ex. Assistant Professor"
                    error={errors.designation}
                  />
                </div>
              )}

              {/* Conditional UI for Admin (Security Key Required) */}
              {role === "admin" && (
                <div className="space-y-4 p-6 bg-red-50/30 rounded-[32px] border border-red-100 dark:bg-red-900/10 dark:border-red-900/20 animate-in fade-in zoom-in-95 duration-500">
                  <Input
                    label="Admin Secret Key"
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    placeholder="Enter special authorization key"
                    error={errors.adminSecret}
                  />
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider px-2 opacity-70">
                    ⚠ Restricted to official administrators
                  </p>
                </div>
              )}

              <Input
                label="Secure Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                error={errors.password}
              />
            </div>

            <Button type="submit" className="w-full h-16 text-lg mt-4 shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/5 group" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finalizing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Registration
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium italic">
                Already part of the system?{" "}
                <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors not-italic">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

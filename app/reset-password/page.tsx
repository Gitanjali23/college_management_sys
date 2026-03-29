"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  
  const router = useRouter();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = resetSchema.safeParse({ email });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({ email: formattedErrors.email?.[0] });
      return;
    }

    // FAKE RESET REQUEST: In a real app we'd call the backend API to send an email reset link
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-zinc-50 dark:bg-black relative overflow-hidden">
      <div className="absolute top-1/2 -left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md p-10 bg-white border border-zinc-200 rounded-[32px] shadow-xl shadow-zinc-200/50 dark:bg-zinc-950 dark:border-zinc-800 dark:shadow-none">
        
        {isSubmitted ? (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto dark:bg-green-900/30 dark:text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Check your email</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 font-medium">
                We've sent password reset instructions to <b>{email}</b>.
              </p>
            </div>
            <Button onClick={() => router.push("/login")} className="w-full h-12 rounded-xl mt-4">
              Return to Login
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Reset Password</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 font-medium">Enter your email and we'll send you a recovery link.</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleReset}>
              <Input
                label="Registered Email Address"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                error={errors.email}
              />
              
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg mt-4">
                Send Reset Link
              </Button>

              <div className="text-center mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium cursor-pointer transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
                  <Link href="/login" className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Back to Log in
                  </Link>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useComplaintStore } from "@/store/complaintStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CreateComplaintPage() {
  const { isLoggedIn, user, role } = useAuthStore();
  const { addComplaint } = useComplaintStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  // Usually admins don't need to raise complaints in this system, but we can allow it or restrict it.
  // We'll restrict it to members only based on PRD: "Members can raise complaints"
  if (role === "admin") {
    return (
      <div className="flex h-screen items-center justify-center p-6 flex-col gap-4">
        <h1 className="text-2xl font-bold text-red-500">Admins cannot raise complaints.</h1>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    addComplaint({
      title,
      description,
      userEmail: user || "unknown",
    });

    router.push("/complaints");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black tracking-tight">Raise Complaint</h1>
        <Button variant="secondary" onClick={() => router.push("/complaints")}>
          Cancel
        </Button>
      </div>

      <div className="bg-white p-8 border border-zinc-200 rounded-[32px] dark:bg-zinc-950 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">
          Please describe your issue clearly so the administration can resolve it as quickly as possible.
        </p>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Complaint Subject"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Broken AC in Lecture Hall 3"
          />

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Detailed Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide as much detail as possible..."
              className="w-full h-40 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-600"
            ></textarea>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold">
            Submit Complaint
          </Button>
        </form>
      </div>
    </div>
  );
}

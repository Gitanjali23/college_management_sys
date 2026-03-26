"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEventStore } from "@/store/eventStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function CreateEventPage() {
  const { role, isLoggedIn } = useAuthStore();
  const { addEvent } = useEventStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  if (role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-red-500">Access Denied. Admins Only.</h1>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !date || !location || !organizer) {
      setError("All fields are required.");
      return;
    }

    addEvent({
      title,
      description,
      date: new Date(date).toISOString(),
      location,
      organizer,
    });

    router.push("/events");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black tracking-tight">Create Event</h1>
        <Button variant="secondary" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <div className="bg-white p-8 border border-zinc-200 rounded-[32px] dark:bg-zinc-950 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Event Title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Annual Tech Symposium"
          />

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this event about?"
              className="w-full h-32 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-600"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Date & Time"
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              label="Location"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Main Auditorium"
            />
          </div>

          <Input
            label="Organizer"
            id="organizer"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            placeholder="e.g. Computer Science Dept"
          />

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold">
            Publish Event
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useNoticeStore } from "@/store/noticeStore";
import { useEventStore } from "@/store/eventStore";
import { useComplaintStore } from "@/store/complaintStore";
import Button from "@/components/ui/Button";

export default function Dashboard() {
  const { isLoggedIn, user, role } = useAuthStore();
  const notices = useNoticeStore((state) => state.notices);
  const events = useEventStore((state) => state.events);
  const complaints = useComplaintStore((state) => state.complaints);
  const router = useRouter();
  
  const upcomingEvents = events.filter(e => new Date(e.date).getTime() >= Date.now());
  const pendingComplaints = complaints.filter(c => c.status === "Pending");
  const myComplaints = complaints.filter(c => c.userEmail === user);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-4xl p-10 bg-white border border-zinc-200 rounded-[40px] dark:bg-zinc-950 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-black text-left tracking-tighter mb-2">
              Welcome, <span className="text-blue-600 dark:text-blue-500">{role === "admin" ? "Admin" : "Member"}</span>
            </h1>
            <p className="text-zinc-500 font-medium dark:text-zinc-400">
              Logged in as <span className="font-bold">{user}</span>
            </p>
          </div>
          
          {role === "admin" ? (
            <Button onClick={() => router.push("/create-notice")} className="h-12 px-8 rounded-full shadow-lg shadow-blue-500/20">
              Create Notice
            </Button>
          ) : (
            <Button onClick={() => router.push("/notices")} variant="secondary" className="h-12 px-8 rounded-full">
              View Notices
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 bg-zinc-50 rounded-[32px] border border-zinc-200 transition-all hover:scale-[1.02] dark:bg-zinc-900 dark:border-zinc-800 cursor-pointer" onClick={() => router.push("/notices")}>
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Notices</h3>
            <p className="text-4xl font-black tracking-tight">{notices.length} Active</p>
          </div>
          <div className="group p-8 bg-zinc-50 rounded-[32px] border border-zinc-200 transition-all hover:scale-[1.02] dark:bg-zinc-900 dark:border-zinc-800 cursor-pointer" onClick={() => router.push("/events")}>
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Events</h3>
            <p className="text-4xl font-black tracking-tight">{upcomingEvents.length} Upcoming</p>
          </div>
          <div className="group p-8 bg-zinc-50 rounded-[32px] border border-zinc-200 transition-all hover:scale-[1.02] dark:bg-zinc-900 dark:border-zinc-800 cursor-pointer" onClick={() => router.push("/complaints")}>
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Support</h3>
            <p className="text-4xl font-black tracking-tight">{role === "admin" ? `${pendingComplaints.length} Pending` : `${myComplaints.length} Tickets`}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

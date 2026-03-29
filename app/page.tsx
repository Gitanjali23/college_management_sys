"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/Button";

export default function Home() {
  const { isLoggedIn } = useAuthStore();

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-black relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] -z-10 dark:bg-blue-600/10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] -z-10 dark:bg-purple-600/10 pointer-events-none"></div>

      <div className="text-center z-10 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-white/50 backdrop-blur-md text-sm font-bold text-zinc-600 uppercase tracking-widest dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          The Future of Campus Life
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] text-zinc-900 dark:text-zinc-50">
          Seamlessly manage
          <br className="hidden md:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
            {" "}every connection.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Ditch the Whatsapp group spam. Centralize notices, events, and complaints in one beautiful, high-performance platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {isLoggedIn ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="h-14 px-10 text-lg rounded-full shadow-xl shadow-blue-500/20 w-full">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="h-14 px-10 text-lg rounded-full shadow-xl shadow-blue-500/20 w-full">
                  Sign In to Portal
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="secondary" className="h-14 px-10 text-lg rounded-full w-full bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Request Access
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Feature Grid Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 z-10 w-full px-4">
        {[
          { title: "Notices", desc: "Instant updates, zero noise.", icon: "bell" },
          { title: "Events", desc: "RSVP and coordinate easily.", icon: "calendar" },
          { title: "Complaints", desc: "Track issues to resolution.", icon: "shield" }
        ].map((feat, idx) => (
          <div key={idx} className="p-6 rounded-[32px] bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none dark:hover:border-zinc-700">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{feat.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">{feat.desc}</p>
          </div>
        ))}
      </div>

    </main>
  );
}

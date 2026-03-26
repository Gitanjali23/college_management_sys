"use client";

import { useEffect } from "react";

import { useNoticeStore } from "@/store/noticeStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function NoticesPage() {
  const { notices, deleteNotice } = useNoticeStore();
  const { role, isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 mt-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black tracking-tight">Notices</h1>
        {role === "admin" && (
          <Button onClick={() => router.push("/create-notice")} className="rounded-full shadow-lg shadow-blue-500/20">
            + New Notice
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {notices.length === 0 ? (
          <div className="p-10 text-center text-zinc-500 bg-zinc-50 rounded-[32px] border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400">
            No notices published yet.
          </div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="p-8 bg-white border border-zinc-200 rounded-[32px] transition-all hover:shadow-xl hover:shadow-zinc-200/50 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:shadow-none dark:hover:border-zinc-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-50">
                    {notice.title}
                  </h2>
                  <div className="flex gap-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    <span>By {notice.author}</span>
                    <span>•</span>
                    <span>{new Date(notice.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                {role === "admin" && (
                  <button 
                    onClick={() => deleteNotice(notice.id)}
                    className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-full dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
                    title="Delete Notice"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                )}
              </div>
              
              <p className="text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed whitespace-pre-wrap">
                {notice.content}
              </p>

              {notice.attachmentName && (
                <div className="mt-6 flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30 w-fit cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  <span className="text-sm font-semibold">{notice.attachmentName}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

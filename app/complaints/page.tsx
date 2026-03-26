"use client";

import { useEffect } from "react";

import { useComplaintStore, ComplaintStatus } from "@/store/complaintStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

const statusColors: Record<ComplaintStatus, string> = {
  "Pending": "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-500 dark:border-yellow-900/30",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/10 dark:text-blue-500 dark:border-blue-900/30",
  "Resolved": "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:text-green-500 dark:border-green-900/30",
  "Rejected": "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/10 dark:text-red-500 dark:border-red-900/30",
};

export default function ComplaintsPage() {
  const { complaints, updateStatus, deleteComplaint } = useComplaintStore();
  const { role, isLoggedIn, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  // Filter complaints: admins see all, members see only theirs
  const visibleComplaints = role === "admin" 
    ? [...complaints].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [...complaints].filter(c => c.userEmail === user).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-5xl mx-auto p-8 mt-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{role === 'admin' ? 'Manage Complaints' : 'My Complaints'}</h1>
        </div>
        
        {role !== "admin" && (
          <Button onClick={() => router.push("/create-complaint")} className="rounded-full shadow-lg shadow-blue-500/20">
            + Raise Complaint
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {visibleComplaints.length === 0 ? (
          <div className="p-10 text-center text-zinc-500 bg-zinc-50 rounded-[32px] border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400">
            No complaints found.
          </div>
        ) : (
          visibleComplaints.map((complaint) => (
            <div key={complaint.id} className="p-8 bg-white border border-zinc-200 rounded-[32px] transition-all hover:shadow-xl hover:shadow-zinc-200/50 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:shadow-none dark:hover:border-zinc-700">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-50">
                    {complaint.title}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    {role === "admin" && (
                      <>
                        <span className="text-zinc-500 dark:text-zinc-300">By {complaint.userEmail}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{new Date(complaint.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-start">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusColors[complaint.status]}`}>
                    {complaint.status}
                  </div>
                  
                  {role === "admin" && (
                    <button 
                      onClick={() => deleteComplaint(complaint.id)}
                      className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-full dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
                      title="Delete Complaint"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-zinc-600 dark:text-zinc-400 mt-4 mb-6 leading-relaxed bg-zinc-50 p-4 rounded-xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50">
                {complaint.description}
              </p>

              {role === "admin" && (
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                  <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Update Status:</span>
                  <div className="flex flex-wrap gap-2">
                    {(['Pending', 'In Progress', 'Resolved', 'Rejected'] as ComplaintStatus[]).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(complaint.id, s)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                          complaint.status === s 
                            ? 'bg-zinc-800 text-white border-zinc-800 dark:bg-zinc-200 dark:text-black dark:border-zinc-200 shadow-md' 
                            : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useNoticeStore } from "@/store/noticeStore";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";

export default function CreateNoticePage() {
  const { role, isLoggedIn } = useAuthStore();
  const { addNotice } = useNoticeStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  // Redirect if not logged in or not admin
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
    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    addNotice({
      title,
      content,
      author: "Admin", // Would be actual user name in real app
      attachmentName: attachmentFile ? attachmentFile.name : (attachmentName || undefined),
    });

    router.push("/notices");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 mt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black tracking-tight">Create Notice</h1>
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
            label="Notice Title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. End of Semester Exams"
          />

          <div>
            <label htmlFor="content" className="block text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notice here..."
              className={`w-full h-40 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-600`}
            ></textarea>
          </div>

          <FileUpload 
            onFileSelect={(file) => setAttachmentFile(file)} 
            label="Attachment (Optional)"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold">
            Publish Notice
          </Button>
        </form>
      </div>
    </div>
  );
}

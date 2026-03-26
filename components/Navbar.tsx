"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 dark:bg-black dark:border-gray-800">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-black tracking-tighter">CMS</div>
        <div className="flex gap-4 md:gap-6 font-medium text-xs md:text-sm text-gray-600 dark:text-gray-400 overflow-x-auto pb-1 md:pb-0 whitespace-nowrap">
          <Link href="/" className="hover:text-blue-500 transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-blue-500 transition-colors">
            Dashboard
          </Link>
          <Link href="/notices" className="hover:text-blue-500 transition-colors">
            Notices
          </Link>
          <Link href="/events" className="hover:text-blue-500 transition-colors">
            Events
          </Link>
          <Link href="/complaints" className="hover:text-blue-500 transition-colors">
            Complaints
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 rounded-full dark:bg-zinc-800">
              {user}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm font-semibold text-black dark:text-white hover:text-blue-500 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

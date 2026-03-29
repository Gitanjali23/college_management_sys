import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "admin" | "student" | "teacher";

interface AuthState {
  user: null | string;
  role: null | Role;
  token: null | string;
  isLoggedIn: boolean;
  login: (email: string, role: Role, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,
      isLoggedIn: false,
      login: (email, role, token) => set({ user: email, role, token, isLoggedIn: true }),
      logout: () => set({ user: null, role: null, token: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);

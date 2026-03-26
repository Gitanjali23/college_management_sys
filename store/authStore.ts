import { create } from "zustand";

type Role = "admin" | "member";

interface AuthState {
  user: null | string;
  role: null | Role;
  isLoggedIn: boolean;
  login: (email: string, role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoggedIn: false,
  login: (email, role) => set({ user: email, role: role, isLoggedIn: true }),
  logout: () => set({ user: null, role: null, isLoggedIn: false }),
}));

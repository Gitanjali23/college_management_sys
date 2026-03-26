import { create } from "zustand";

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  attachmentName?: string;
}

interface NoticeState {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, "id" | "date">) => void;
  deleteNotice: (id: string) => void;
}

export const useNoticeStore = create<NoticeState>((set) => ({
  notices: [
    {
      id: "1",
      title: "Welcome to the New Academic Year",
      content: "Classes will commence from next Monday. Please ensure you have completed your registration.",
      date: new Date().toISOString(),
      author: "Admin",
    },
    {
      id: "2",
      title: "Library Maintenance Notice",
      content: "The central library will be closed for maintenance this weekend. Digital resources remain accessible.",
      date: new Date(Date.now() - 86400000).toISOString(),
      author: "Librarian",
    }
  ],
  addNotice: (notice) => set((state) => ({
    notices: [
      {
        ...notice,
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toISOString(),
      },
      ...state.notices,
    ],
  })),
  deleteNotice: (id) => set((state) => ({
    notices: state.notices.filter((n) => n.id !== id),
  })),
}));

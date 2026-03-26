import { create } from "zustand";

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  userEmail: string;
  date: string;
}

interface ComplaintState {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, "id" | "status" | "date">) => void;
  updateStatus: (id: string, status: ComplaintStatus) => void;
  deleteComplaint: (id: string) => void;
}

export const useComplaintStore = create<ComplaintState>((set) => ({
  complaints: [
    {
      id: "1",
      title: "Wi-Fi issue in Library",
      description: "The Wi-Fi network 'Campus-Student' is constantly dropping connection on the second floor of the library.",
      status: "In Progress",
      userEmail: "any@email.com",
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "2",
      title: "Broken Projector in Room 204",
      description: "The projector screen isn't rolling down and the bulb seems fused.",
      status: "Pending",
      userEmail: "another@student.com",
      date: new Date().toISOString(),
    }
  ],
  addComplaint: (complaint) => set((state) => ({
    complaints: [
      {
        ...complaint,
        id: Math.random().toString(36).substring(2, 9),
        status: "Pending",
        date: new Date().toISOString(),
      },
      ...state.complaints,
    ],
  })),
  updateStatus: (id, status) => set((state) => ({
    complaints: state.complaints.map(c => 
      c.id === id ? { ...c, status } : c
    )
  })),
  deleteComplaint: (id) => set((state) => ({
    complaints: state.complaints.filter((c) => c.id !== id),
  })),
}));

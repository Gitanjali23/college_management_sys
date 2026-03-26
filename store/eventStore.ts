import { create } from "zustand";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  registeredUsers: string[]; // array of emails
}

interface EventState {
  events: Event[];
  addEvent: (event: Omit<Event, "id" | "registeredUsers">) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (eventId: string, userEmail: string) => void;
  unregisterFromEvent: (eventId: string, userEmail: string) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [
    {
      id: "1",
      title: "Annual Tech Symposium",
      description: "Join us for a 2-day technical fest featuring coding competitions, hackathons, and guest lectures from industry experts.",
      date: new Date(Date.now() + 86400000 * 5).toISOString(),
      location: "Main Auditorium",
      organizer: "Computer Science Dept",
      registeredUsers: [],
    },
    {
      id: "2",
      title: "Inter-College Sports Meet",
      description: "Annual sports meet. Please register your names for various athletic events before the deadline.",
      date: new Date(Date.now() + 86400000 * 10).toISOString(),
      location: "University Sports Ground",
      organizer: "Sports Council",
      registeredUsers: ["any@email.com"],
    }
  ],
  addEvent: (event) => set((state) => ({
    events: [
      ...state.events,
      {
        ...event,
        id: Math.random().toString(36).substring(2, 9),
        registeredUsers: [],
      },
    ],
  })),
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((e) => e.id !== id),
  })),
  registerForEvent: (eventId, userEmail) => set((state) => ({
    events: state.events.map(event =>
      event.id === eventId
        ? { ...event, registeredUsers: [...event.registeredUsers, userEmail] }
        : event
    )
  })),
  unregisterFromEvent: (eventId, userEmail) => set((state) => ({
    events: state.events.map(event =>
      event.id === eventId
        ? { ...event, registeredUsers: event.registeredUsers.filter(email => email !== userEmail) }
        : event
    )
  })),
}));

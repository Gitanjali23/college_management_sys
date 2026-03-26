"use client";

import { useEffect } from "react";

import { useEventStore } from "@/store/eventStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function EventsPage() {
  const { events, deleteEvent, registerForEvent, unregisterFromEvent } = useEventStore();
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

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-6xl mx-auto p-8 mt-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black tracking-tight">Events</h1>
        {role === "admin" && (
          <Button onClick={() => router.push("/create-event")} className="rounded-full shadow-lg shadow-blue-500/20">
            + New Event
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sortedEvents.length === 0 ? (
          <div className="lg:col-span-2 p-10 text-center text-zinc-500 bg-zinc-50 rounded-[32px] border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400">
            No upcoming events at the moment.
          </div>
        ) : (
          sortedEvents.map((event) => {
            const isRegistered = user ? event.registeredUsers.includes(user) : false;
            const eventDate = new Date(event.date);
            const isPast = eventDate.getTime() < Date.now();
            
            return (
              <div key={event.id} className={`p-8 bg-white border border-zinc-200 rounded-[32px] transition-all relative overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 ${isPast ? 'opacity-70' : 'hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none dark:hover:border-zinc-700'}`}>
                
                {/* Registration Status Badge */}
                {isRegistered && !isPast && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                    Registered
                  </div>
                )}
                
                {/* Content */}
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-zinc-50">
                        {event.title}
                      </h2>
                      <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 px-3 py-1 rounded-lg w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {eventDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {role === "admin" && (
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-full dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors shrink-0 ml-4"
                        title="Delete Event"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    )}
                  </div>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 mt-2 mb-6 flex-grow leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span className="truncate">{event.organizer}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        {event.registeredUsers.length} <span className="text-zinc-400 font-medium">Attending</span>
                      </div>
                      
                      {!isPast && (
                        isRegistered ? (
                          <Button 
                            variant="secondary" 
                            onClick={() => unregisterFromEvent(event.id, user!)}
                            className="h-10 px-6 text-sm bg-zinc-100 border-none text-zinc-600 hover:text-red-600 hover:bg-red-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          >
                            Cancel RSVP
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => registerForEvent(event.id, user!)}
                            className="h-10 px-6 text-sm rounded-xl font-bold"
                          >
                            RSVP Now
                          </Button>
                        )
                      )}
                      
                      {isPast && (
                        <span className="text-sm font-bold text-zinc-400 bg-zinc-100 px-4 py-2 rounded-xl dark:bg-zinc-900 dark:text-zinc-500">
                          Event Passed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

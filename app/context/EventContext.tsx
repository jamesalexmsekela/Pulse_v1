// app/context/EventContext.tsx
import React, { createContext, useState, ReactNode } from "react";

export type Event = {
  id: string;
  name: string;
  category: string;
  location: { latitude: number; longitude: number };
  date: string;
  image: string;
  description?: string;
  rsvped?: boolean; // Represents whether the current user has RSVPed (for toggle purposes)
  rsvpCount: number;
  maxAttendees?: number;
};

type EventContextType = {
  events: Event[];
  addEvent: (newEvent: Event) => void;
  toggleRSVP: (eventId: string) => void;
};

export const EventContext = createContext<EventContextType | undefined>(
  undefined
);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  // Seed with mock events
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Music Festival",
      category: "Music",
      location: { latitude: 41.861, longitude: -87.846 },
      date: "2025-02-20",
      image:
        "https://unsplash.com/photos/people-raising-their-hands-on-concert-Qnlp3FCO2vc",
      description: "Join us for a day of live music and fun!",
      rsvped: false,
      rsvpCount: 0,
      maxAttendees: 100, // Example limit
    },
    {
      id: "2",
      name: "Tech Conference",
      category: "Tech",
      location: { latitude: 41.8128, longitude: -87.006 },
      date: "2025-02-25",
      image: "https://via.placeholder.com/150",
      description: "The latest in tech innovations.",
      rsvped: false,
      rsvpCount: 0,
    },
    {
      id: "3",
      name: "Art Exhibition",
      category: "Art",
      location: { latitude: 41.8138, longitude: -87.0065 },
      date: "2025-02-27",
      image: "https://via.placeholder.com/150",
      description: "Explore stunning art pieces.",
      rsvped: false,
      rsvpCount: 0,
    },
    {
      id: "4",
      name: "Soccer Tournament",
      category: "Sports",
      location: { latitude: 41.9, longitude: -87.7 },
      date: "2025-03-05",
      image: "https://via.placeholder.com/150",
      description: "Competitive soccer action!",
      rsvped: false,
      rsvpCount: 0,
      maxAttendees: 16, // Example limit
    },
  ]);

  // Update toggleRSVP to adjust rsvpCount accordingly
  const toggleRSVP = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          // If already RSVPed, cancel RSVP and decrement count
          if (event.rsvped) {
            return { ...event, rsvped: false, rsvpCount: event.rsvpCount - 1 };
          } else {
            // If maxAttendees is set and count has reached it, do not allow RSVP
            if (event.maxAttendees && event.rsvpCount >= event.maxAttendees) {
              // Optionally, alert the user here
              console.log("Maximum number of attendees reached.");
              return event;
            }
            return { ...event, rsvped: true, rsvpCount: event.rsvpCount + 1 };
          }
        }
        return event;
      })
    );
  };

  const addEvent = (newEvent: Event) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent, toggleRSVP }}>
      {children}
    </EventContext.Provider>
  );
};

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
  rsvped?: boolean;
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
  // Seed with mock events initially
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Music Festival",
      category: "Music",
      location: { latitude: 41.861, longitude: -87.846 },
      date: "2025-02-20",
      image: "https://via.placeholder.com/150",
      description: "Join us for a day of live music and fun!",
      rsvped: false,
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
    },
  ]);

  const addEvent = (newEvent: Event) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const toggleRSVP = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, rsvped: !event.rsvped } : event
      )
    );
  };

  return (
    <EventContext.Provider value={{ events, addEvent, toggleRSVP }}>
      {children}
    </EventContext.Provider>
  );
};

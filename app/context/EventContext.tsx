// app/context/EventContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  getEvents,
  addEvent as addEventService,
  toggleRSVP as toggleRSVPService,
  deleteEvent as deleteEventService,
} from "../services/eventService";

// Define the Event type
export type Event = {
  id: string;
  name: string;
  category: string;
  location: { latitude: number; longitude: number };
  date: string;
  image: string;
  description?: string;
  rsvped?: boolean;
  rsvpCount: number;
  maxAttendees?: number;
  creatorId: string;
};

// Define the shape of the context
type EventContextType = {
  events: Event[];
  addEvent: (
    newEvent: Omit<Event, "id" | "rsvpCount" | "rsvped" | "creatorId">
  ) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  toggleRSVP: (eventId: string) => Promise<void>;
};

export const EventContext = createContext<EventContextType | undefined>(
  undefined
);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Subscribe to events via the service method
  useEffect(() => {
    const unsubscribe = getEvents((eventsData: Event[]) => {
      setEvents(eventsData);
    });
    return unsubscribe;
  }, []);

  // Wrap service methods for consistency
  //   const addEvent = async (
  //     newEvent: Omit<Event, "id" | "rsvpCount" | "rsvped">
  //   ) => {
  //     await addEventService(newEvent);
  //   };

  const toggleRSVP = async (eventId: string) => {
    await toggleRSVPService(eventId);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        toggleRSVP,
        addEvent: addEventService,
        deleteEvent: deleteEventService,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

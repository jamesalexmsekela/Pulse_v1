// app/models/Event.ts
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
    visibilityRadius?: number;
    creatorId: string;
    attendees?: string[];
  };
  
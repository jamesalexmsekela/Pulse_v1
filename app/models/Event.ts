// app/models/Event.ts
// I will need to update the data types from strings to more approriate types 
// (i.e. date -> from string to dateTime, times -> from string to time)
export type Event = {
    id: string;
    name: string;
    category: string;
    location: {
        latitude: number;
        longitude: number;
        address?: string;
      };
    date: string;
    startTime: string;
    endTime: string;
    image: string;
    description?: string;
    rsvped?: boolean;
    rsvpCount: number;
    maxAttendees?: number;
    visibilityRadius?: number;
    creatorId: string;
    attendees?: string[];
  };
  
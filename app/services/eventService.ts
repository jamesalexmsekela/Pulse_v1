// app/services/eventService.ts
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  runTransaction,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "../utils/firebaseConfig";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { Event } from "../models/Event";

// Listen for real-time updates on events.
export const getEvents = (callback: (events: Event[]) => void) => {
  return onSnapshot(collection(db, "events"), (snapshot) => {
    const eventsData: Event[] = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Event[];
    callback(eventsData);
  });
};

// Add a new event to Firestore
export const addEvent = async (
    newEvent: Omit<Event, "id" | "rsvpCount" | "rsvped" | "creatorId">
  ) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
  
    await addDoc(collection(db, "events"), {
      ...newEvent,
      rsvpCount: 0,
      rsvped: false,
      creatorId: user.uid, // Store event creator's user ID
    });
  };

// Update an event's details in Firestore (partial update)
export const updateEvent = async (
  eventId: string,
  updates: Partial<Event>
) => {
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, updates);
};

// Delete an event from Firestore
export const deleteEvent = async (eventId: string) => {
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);
  
    if (!eventDoc.exists()) {
      throw new Error("Event does not exist!");
    }
  
    const eventData = eventDoc.data();
    const user = auth.currentUser;
  
    if (!user || user.uid !== eventData.creatorId) {
      throw new Error("You do not have permission to delete this event.");
    }
  
    await deleteDoc(eventRef);
  };

// Toggle RSVP using Firestore subcollection and update attendees list
export const toggleRSVP = async (eventId: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  const userId = user.uid;

  const eventRef = doc(db, "events", eventId);
  const rsvpRef = doc(collection(eventRef, "rsvps"), userId);

  try {
    await runTransaction(db, async (transaction) => {
      const eventDoc = await transaction.get(eventRef);
      const userRsvpDoc = await transaction.get(rsvpRef);

      if (!eventDoc.exists()) {
        throw new Error("Event does not exist!");
      }

      const eventData = eventDoc.data();
      let newRsvpCount = eventData.rsvpCount || 0;
      let attendeesUpdate: { attendees: any } = { attendees: [] };

      if (userRsvpDoc.exists()) {
        // User already RSVPed → Remove RSVP
        transaction.delete(rsvpRef);
        newRsvpCount -= 1;
        attendeesUpdate = { attendees: arrayRemove(userId) };
      } else {
        // Prevent RSVP if event is full
        if (eventData.maxAttendees && newRsvpCount >= eventData.maxAttendees) {
          throw new Error("This event has reached its maximum attendance.");
        }
        // User RSVPing → Add RSVP
        transaction.set(rsvpRef, { userId });
        newRsvpCount += 1;
        attendeesUpdate = { attendees: arrayUnion(userId) };
      }

      // Update both the rsvpCount and attendees array in a single update call
      transaction.update(eventRef, {
        rsvpCount: newRsvpCount,
        ...attendeesUpdate,
      });
    });

    console.log("RSVP successfully toggled");
  } catch (error) {
    console.error("Error in toggleRSVP:", error);
    throw error;
  }
};
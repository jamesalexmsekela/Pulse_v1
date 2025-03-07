// app/services/eventService.ts
import { db } from "../utils/firebaseConfig";
import { Event } from "../context/EventContext";
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
  newEvent: Omit<Event, "id" | "rsvpCount" | "rsvped">
) => {
  await addDoc(collection(db, "events"), {
    ...newEvent,
    rsvpCount: 0,
    rsvped: false,
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
  await deleteDoc(eventRef);
};

// Toggle RSVP using a transaction (modular API)
export const toggleRSVP = async (eventId: string) => {
  const eventRef = doc(db, "events", eventId);
  console.log("Toggling RSVP for document:", eventRef.path);
  try {
    await runTransaction(db, async (transaction) => {
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists()) {
        throw new Error("Event does not exist!");
      }
      const data = eventDoc.data() as Event;
      console.log("Transaction event data:", data);
      if (data.rsvped) {
        transaction.update(eventRef, {
          rsvped: false,
          rsvpCount: data.rsvpCount - 1,
        });
        console.log("Cancelling RSVP");
      } else {
        if (data.maxAttendees && data.rsvpCount >= data.maxAttendees) {
          throw new Error("Maximum number of attendees reached.");
        }
        transaction.update(eventRef, {
          rsvped: true,
          rsvpCount: data.rsvpCount + 1,
        });
        console.log("Adding RSVP");
      }
    });
    // Fetch updated document using getDoc outside the transaction.
    const updatedDoc = await getDoc(eventRef);
    console.log("Updated event data:", updatedDoc.data());
  } catch (error) {
    console.error("Error in toggleRSVP:", error);
    throw error;
  }
};

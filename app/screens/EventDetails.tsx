// app/screens/EventDetails.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { EventContext } from "../context/EventContext";
import { Event } from "../models/Event";
import { db, auth } from "../utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

interface UserProfile {
  id: string;
  name: string;
  photoURL?: string;
}

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: { eventId: string };
  Profile: undefined;
  Attendees: { eventId: string };
};

type EventDetailsRouteProp = RouteProp<RootStackParamList, "EventDetails">;
type EventDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EventDetails"
>;

export default function EventDetails({
  navigation,
}: {
  navigation: EventDetailsNavigationProp;
}) {
  const route = useRoute<EventDetailsRouteProp>();
  const { eventId } = route.params;
  const { events, toggleRSVP, deleteEvent } = useContext(EventContext)!;
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userHasRSVPed, setUserHasRSVPed] = useState<boolean>(false);
  const [attendeeProfiles, setAttendeeProfiles] = useState<UserProfile[]>([]);
  const [organizer, setOrganizer] = useState<UserProfile | null>(null);

  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(() =>
    events.find((e) => e.id === eventId)
  );

  // Fetch current user ID
  useEffect(() => {
    const user = auth.currentUser;
    setCurrentUserId(user ? user.uid : null);
  }, []);

  // Fetch RSVP status for the current user
  useEffect(() => {
    const fetchRSVPStatus = async () => {
      if (!currentUserId) return;
      const rsvpRef = doc(db, "events", eventId, "rsvps", currentUserId);
      const rsvpSnap = await getDoc(rsvpRef);
      setUserHasRSVPed(rsvpSnap.exists());
    };
    fetchRSVPStatus();
  }, [eventId, currentUserId]);

  // Update current event whenever global events change
  useEffect(() => {
    const updatedEvent = events.find((e) => e.id === eventId);
    setCurrentEvent(updatedEvent);
  }, [events, eventId]);

  // Fetch attendee profiles
  useEffect(() => {
    const fetchAttendees = async () => {
      if (!currentEvent?.attendees) return;
      const profiles: (UserProfile | null)[] = await Promise.all(
        currentEvent.attendees.map(async (userId) => {
          const docSnap = await getDoc(doc(db, "users", userId));
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            const { id: _removed, ...userData } = data;
            return { id: userId, ...userData };
          } else {
            return null;
          }
        })
      );
      const nonNullProfiles: UserProfile[] = profiles.filter(
        (p): p is UserProfile => p !== null
      );
      setAttendeeProfiles(nonNullProfiles);
    };
    fetchAttendees();
  }, [currentEvent?.attendees]);

  // Fetch organizer profile based on creatorId
  useEffect(() => {
    const fetchOrganizer = async () => {
      if (!currentEvent?.creatorId) return;
      const organizerDoc = await getDoc(
        doc(db, "users", currentEvent.creatorId)
      );
      if (organizerDoc.exists()) {
        const data = organizerDoc.data() as UserProfile;
        // Destructure and discard the conflicting id if present
        const { id: _removed, ...userData } = data;
        console.log("Organizer data fetched:", {
          id: currentEvent.creatorId,
          ...userData,
        });
        setOrganizer({ id: currentEvent.creatorId, ...userData });
      }
    };
    fetchOrganizer();
  }, [currentEvent?.creatorId]);

  if (!currentEvent) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Text style={globalStyles.header}>Event not found.</Text>
        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(currentEvent.id);
      Alert.alert("Success", "Event deleted successfully.");
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleRSVP = async () => {
    if (
      currentEvent.maxAttendees &&
      currentEvent.rsvpCount >= currentEvent.maxAttendees &&
      !userHasRSVPed
    ) {
      Alert.alert("RSVP Full", "This event has reached its maximum capacity.");
      return;
    }
    await toggleRSVP(currentEvent.id);
    setUserHasRSVPed(!userHasRSVPed);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <Text style={globalStyles.header}>{currentEvent.name}</Text>
        {currentEvent.image ? (
          <Image
            source={{ uri: currentEvent.image }}
            style={globalStyles.eventImage}
          />
        ) : (
          <View style={globalStyles.eventImagePlaceholder}>
            <Text>No Image Available</Text>
          </View>
        )}
        <Text style={globalStyles.eventDate}>{currentEvent.date}</Text>
        <Text style={{ margin: 10 }}>
          {currentEvent.description || "No description provided."}
        </Text>
        <Text style={{ margin: 10 }}>
          RSVPs: {currentEvent.rsvpCount}{" "}
          {currentEvent.maxAttendees ? `/ ${currentEvent.maxAttendees}` : ""}
        </Text>

        <TouchableOpacity
          style={[
            globalStyles.button,
            currentEvent.maxAttendees &&
            currentEvent.rsvpCount >= currentEvent.maxAttendees &&
            !userHasRSVPed
              ? { backgroundColor: "gray" }
              : {},
          ]}
          onPress={handleRSVP}
          disabled={
            !!(
              currentEvent.maxAttendees &&
              currentEvent.rsvpCount >= currentEvent.maxAttendees &&
              !userHasRSVPed
            )
          }
        >
          <Text style={globalStyles.buttonText}>
            {userHasRSVPed ? "Cancel RSVP" : "RSVP"}
          </Text>
        </TouchableOpacity>

        {currentEvent.creatorId === currentUserId && (
          <TouchableOpacity
            style={[
              globalStyles.button,
              { backgroundColor: "red", marginTop: 10 },
            ]}
            onPress={handleDeleteEvent}
          >
            <Text style={globalStyles.buttonText}>Delete Event</Text>
          </TouchableOpacity>
        )}

        {organizer && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={globalStyles.header}>Organized by</Text>
            {organizer.photoURL &&
            organizer.photoURL !== "" &&
            organizer.photoURL !== currentEvent.image ? (
              <Image
                source={{ uri: organizer.photoURL }}
                style={globalStyles.profileImage}
              />
            ) : (
              <View style={globalStyles.profileImageContainer}>
                <Text style={{ color: "#fff" }}>No Image</Text>
              </View>
            )}
            <Text>{organizer.name}</Text>
          </View>
        )}

        {currentEvent.attendees && currentEvent.attendees.length > 0 && (
          <TouchableOpacity
            style={[globalStyles.button, { marginTop: 20 }]}
            onPress={() =>
              navigation.navigate("Attendees", { eventId: currentEvent.id })
            }
          >
            <Text style={globalStyles.buttonText}>
              View Attendees ({currentEvent.rsvpCount})
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
import { auth } from "../utils/firebaseConfig";
import {
  getAttendeeIdsForEvent,
  hasUserRSVPed,
} from "../services/eventService";
import { getUserProfiles, getUserProfile } from "../services/userService";

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
  EditEvent: { eventId: string };
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
      const hasRSVPed = await hasUserRSVPed(eventId, currentUserId);
      setUserHasRSVPed(hasRSVPed);
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
      try {
        const attendeeIds = await getAttendeeIdsForEvent(eventId);
        const profiles = await getUserProfiles(attendeeIds);
        setAttendeeProfiles(profiles);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    };
    fetchAttendees();
  }, [eventId]);

  // Fetch organizer profile based on creatorId
  useEffect(() => {
    const fetchOrganizer = async () => {
      if (!currentEvent?.creatorId) return;
      const organizerData = await getUserProfile(currentEvent.creatorId);
      if (organizerData) {
        const { id: _removed, ...restOrganizerData } = organizerData;
        setOrganizer({ id: currentEvent.creatorId, ...restOrganizerData });
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
        <Text style={{ margin: 10 }}>Start Time: {currentEvent.startTime}</Text>
        <Text style={{ margin: 10 }}>End Time: {currentEvent.endTime}</Text>
        <Text style={{ margin: 10 }}>
          Location: {currentEvent.location.address || "Address not available"}
        </Text>
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
          <>
            <TouchableOpacity
              style={[
                globalStyles.button,
                { backgroundColor: "orange", marginTop: 10, marginBottom: 5 },
              ]}
              onPress={() =>
                navigation.navigate("EditEvent", { eventId: currentEvent.id })
              }
            >
              <Text style={globalStyles.buttonText}>Edit Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                globalStyles.button,
                { backgroundColor: "red", marginBottom: 10 },
              ]}
              onPress={handleDeleteEvent}
            >
              <Text style={globalStyles.buttonText}>Delete Event</Text>
            </TouchableOpacity>
          </>
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

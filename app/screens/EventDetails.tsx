// app/screens/EventDetails.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { EventContext, Event } from "../context/EventContext";
import { db, auth } from "../utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: { eventId: string };
  Profile: undefined;
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

  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(() =>
    events.find((e) => e.id === eventId)
  );

  useEffect(() => {
    const user = auth.currentUser;
    setCurrentUserId(user ? user.uid : null);
  }, []);

  useEffect(() => {
    const fetchRSVPStatus = async () => {
      if (!currentUserId) return;
      const rsvpRef = doc(db, "events", eventId, "rsvps", currentUserId);
      const rsvpSnap = await getDoc(rsvpRef);
      setUserHasRSVPed(rsvpSnap.exists());
    };

    fetchRSVPStatus();
  }, [eventId, currentUserId]);

  useEffect(() => {
    const updatedEvent = events.find((e) => e.id === eventId);
    setCurrentEvent(updatedEvent);
  }, [events, eventId]);

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
      !userHasRSVPed // Allow cancellation, but block new RSVPs
    ) {
      Alert.alert("RSVP Full", "This event has reached its maximum capacity.");
      return;
    }

    await toggleRSVP(currentEvent.id);
    setUserHasRSVPed(!userHasRSVPed); // Optimistically update UI
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.header}>{currentEvent.name}</Text>
      <Image
        source={{ uri: currentEvent.image }}
        style={globalStyles.eventImage}
      />
      <Text style={globalStyles.eventDate}>{currentEvent.date}</Text>
      <Text style={{ margin: 10 }}>
        {currentEvent.description || "No description provided."}
      </Text>
      <Text style={{ margin: 10 }}>
        RSVPs: {currentEvent.rsvpCount}{" "}
        {currentEvent.maxAttendees ? `/ ${currentEvent.maxAttendees}` : ""}
      </Text>

      {/* RSVP Button - Disabled if Full */}
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

      {/* Show Delete Button Only if User is Creator */}
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

      <TouchableOpacity
        style={[globalStyles.button, { marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

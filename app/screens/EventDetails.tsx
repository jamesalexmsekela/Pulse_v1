import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { EventContext, Event } from "../context/EventContext";

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
  const { events, toggleRSVP } = useContext(EventContext)!;

  // Use local state to hold the current event
  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(() =>
    events.find((e) => e.id === eventId)
  );

  // Update local state whenever the global events change
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

  const handleRSVP = () => {
    toggleRSVP(currentEvent.id);
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
      <TouchableOpacity style={globalStyles.button} onPress={handleRSVP}>
        <Text style={globalStyles.buttonText}>
          {currentEvent.rsvped ? "Cancel RSVP" : "RSVP"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[globalStyles.button, { marginTop: 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

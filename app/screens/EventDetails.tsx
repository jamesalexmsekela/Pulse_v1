import React, { useContext } from "react";
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
  EventDetails: { event: Event };
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
  const { event } = route.params; // The event object passed from HomeScreen

  const { toggleRSVP } = useContext(EventContext)!;

  const handleRSVP = () => {
    toggleRSVP(event.id);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.header}>{event.name}</Text>
      <Image source={{ uri: event.image }} style={globalStyles.eventImage} />
      <Text style={globalStyles.eventDate}>{event.date}</Text>
      <Text style={{ margin: 10 }}>
        {event.description || "No description provided."}
      </Text>
      <TouchableOpacity style={globalStyles.button} onPress={handleRSVP}>
        <Text style={globalStyles.buttonText}>
          {event.rsvped ? "Cancel RSVP" : "RSVP"}
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

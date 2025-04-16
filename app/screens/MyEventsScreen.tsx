// app/screens/MyEventsScreen.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { auth } from "../utils/firebaseConfig";
import { EventContext } from "../context/EventContext";
import { Event } from "../models/Event";
import { globalStyles } from "../styles/globalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

type RootStackParamList = {
  EventDetails: { eventId: string };
};

type MyEventsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EventDetails"
>;

export default function MyEventsScreen({
  navigation,
}: {
  navigation: MyEventsScreenNavigationProp;
}) {
  const { events } = useContext(EventContext)!;
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserEvents = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    return events.filter((event) => event.creatorId === userId);
  };

  // Filter events created by the current user
  useEffect(() => {
    setMyEvents(getUserEvents());
    setLoading(false);
  }, [events]);

  useFocusEffect(
    useCallback(() => {
      setMyEvents(getUserEvents());
    }, [events])
  );

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <ActivityIndicator size="large" color="purple" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.header}>🎉 My Events</Text>
      {myEvents.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ fontSize: 32 }}>📭</Text>
          <Text style={{ marginTop: 10, fontSize: 16 }}>
            You haven’t created any events yet.
          </Text>
        </View>
      ) : (
        <FlatList
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          data={myEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={globalStyles.card}
              onPress={() =>
                navigation.navigate("EventDetails", { eventId: item.id })
              }
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={globalStyles.eventImage}
                />
              ) : (
                <View style={globalStyles.eventImagePlaceholder}>
                  <Text>No Image Available</Text>
                </View>
              )}
              <Text style={globalStyles.eventTitle}>{item.name}</Text>
              <Text style={globalStyles.eventDate}>{item.date}</Text>
              <Text style={{ marginVertical: 5 }}>
                {item.startTime} - {item.endTime}
              </Text>
              <Text style={{ marginVertical: 5 }}>
                RSVPs: {item.rsvpCount}{" "}
                {item.maxAttendees ? `/ ${item.maxAttendees}` : ""}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

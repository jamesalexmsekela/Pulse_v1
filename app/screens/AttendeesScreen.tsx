// app/screens/AttendeesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { UserProfile } from "../models/User";
import { getUserProfiles } from "../services/userService";
import { getAttendeeIdsForEvent } from "../services/eventService";

type RootStackParamList = {
  Attendees: { eventId: string };
  // ...other screens if needed
};

type AttendeesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Attendees"
>;
type AttendeesScreenRouteProp = RouteProp<RootStackParamList, "Attendees">;

const AttendeesScreen: React.FC = () => {
  const route = useRoute<AttendeesScreenRouteProp>();
  const navigation = useNavigation<AttendeesScreenNavigationProp>(); // Use hook to get navigation
  const { eventId } = route.params;
  const [attendees, setAttendees] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendeeProfiles = async () => {
      try {
        const attendeeIds = await getAttendeeIdsForEvent(eventId);
        const profiles = await getUserProfiles(attendeeIds);
        setAttendees(profiles);
      } catch (error) {
        console.error("Error fetching attendee profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendeeProfiles();
  }, [eventId]);

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <ActivityIndicator size="large" color="purple" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.header}>Attending Members</Text>
      {attendees.length === 0 ? (
        <Text>No attendees found.</Text>
      ) : (
        <FlatList
          data={attendees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 8,
              }}
            >
              {item.photoURL ? (
                <Image
                  source={{ uri: item.photoURL }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#ccc",
                    marginRight: 10,
                  }}
                />
              )}
              <Text>{item.name}</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={[globalStyles.button, { marginTop: 20 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.buttonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AttendeesScreen;

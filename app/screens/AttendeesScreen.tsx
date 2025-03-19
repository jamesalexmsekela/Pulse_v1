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
import { db } from "../utils/firebaseConfig";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { UserProfile } from "../models/User";

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
    const fetchAttendees = async () => {
      try {
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (!eventSnap.exists()) {
          throw new Error("Event not found");
        }
        const eventData = eventSnap.data();
        console.log("Event data fetched:", eventData); // Debug log here
        const attendeeIds: string[] = eventData.attendees || [];
        console.log("Attendee IDs:", attendeeIds); // Check if IDs are present

        const profiles: UserProfile[] = [];
        for (const userId of attendeeIds) {
          const userDocSnap = await getDoc(doc(db, "users", userId));
          if (userDocSnap.exists()) {
            profiles.push({ id: userId, ...userDocSnap.data() } as UserProfile);
          }
        }
        console.log("Fetched attendee profiles:", profiles);
        setAttendees(profiles);
      } catch (error) {
        console.error("Error fetching attendee profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
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

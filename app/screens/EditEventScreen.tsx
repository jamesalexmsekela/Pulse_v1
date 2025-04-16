// app/screens/EditEventScreen.tsx
import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { EventContext } from "../context/EventContext";
import { pickImage, uploadImage } from "../services/imageService";
import { updateEvent } from "../services/eventService";
import { Event } from "../models/Event";
import * as Notifications from "expo-notifications";
import { getAttendeeIdsForEvent } from "../services/eventService";
import { getUserProfiles } from "../services/userService";

type RootStackParamList = {
  EditEvent: { eventId: string };
};

type EditEventRouteProp = RouteProp<RootStackParamList, "EditEvent">;
type EditEventNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditEvent"
>;

export default function EditEventScreen() {
  const route = useRoute<EditEventRouteProp>();
  const navigation = useNavigation<EditEventNavigationProp>();
  const { eventId } = route.params;
  const { events } = useContext(EventContext)!;

  const eventToEdit = events.find((e) => e.id === eventId);

  const [name, setName] = useState(eventToEdit?.name || "");
  const [category, setCategory] = useState(eventToEdit?.category || "");
  const [date, setDate] = useState(eventToEdit?.date || "");
  const [startTime, setStartTime] = useState(eventToEdit?.startTime || "");
  const [endTime, setEndTime] = useState(eventToEdit?.endTime || "");
  const [description, setDescription] = useState(
    eventToEdit?.description || ""
  );
  const [maxAttendees, setMaxAttendees] = useState(
    eventToEdit?.maxAttendees?.toString() || ""
  );
  const [visibilityRadius, setVisibilityRadius] = useState(
    eventToEdit?.visibilityRadius?.toString() || ""
  );
  const [imageUrl, setImageUrl] = useState(eventToEdit?.image || "");
  const [loading, setLoading] = useState(false);

  const sendUpdateNotifications = async () => {
    try {
      const attendeeIds = await getAttendeeIdsForEvent(eventId);
      const attendeeProfiles = await getUserProfiles(attendeeIds);

      const messages = attendeeProfiles
        .filter((user) => user.pushToken)
        .map((user) => ({
          to: user.pushToken!,
          sound: "default",
          title: "📢 Event Updated",
          body: `Changes were made to "${name}"`,
          data: { eventId },
        }));

      // Send notifications in bulk using fetch
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      const data = await response.json();
      console.log("📬 Notification Response:", data);
    } catch (error) {
      console.error("❌ Failed to send notifications:", error);
    }
  };

  const handleImageChange = async () => {
    const uri = await pickImage();
    if (!uri) return;

    try {
      setLoading(true);
      const uniqueSuffix = `${eventId}_${Date.now()}`;
      const downloadUrl = await uploadImage(uri, "eventPictures", uniqueSuffix);
      setImageUrl(downloadUrl);
      Alert.alert("Success", "Event image updated!");
    } catch (error: any) {
      Alert.alert("Image Upload Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (!name || !category || !date || !startTime || !endTime) {
      Alert.alert(
        "Error",
        "Name, category, date, start time, and end time are required."
      );
      return;
    }

    try {
      setLoading(true);
      await updateEvent(eventId, {
        name,
        category,
        date,
        startTime,
        endTime,
        description,
        image: imageUrl,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
        visibilityRadius: visibilityRadius
          ? parseFloat(visibilityRadius)
          : undefined,
      });

      await sendUpdateNotifications();
      Alert.alert("Success", "Event updated successfully!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Update Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!eventToEdit) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Text style={globalStyles.header}>Event not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={globalStyles.header}>✏️ Edit Event</Text>

          <TextInput
            style={globalStyles.input}
            placeholder="Event Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Start Time (e.g., 14:00)"
            value={startTime}
            onChangeText={setStartTime}
          />

          <TextInput
            style={globalStyles.input}
            placeholder="End Time (e.g., 16:00)"
            value={endTime}
            onChangeText={setEndTime}
          />

          <TextInput
            style={[globalStyles.input, { height: 80 }]}
            placeholder="Description"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Max Attendees"
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            keyboardType="numeric"
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Visibility Radius (km)"
            value={visibilityRadius}
            onChangeText={setVisibilityRadius}
            keyboardType="numeric"
          />

          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={globalStyles.eventImage} />
          ) : (
            <View style={globalStyles.eventImagePlaceholder}>
              <Text>No Image Available</Text>
            </View>
          )}

          <TouchableOpacity
            style={[globalStyles.button, { marginVertical: 10 }]}
            onPress={handleImageChange}
          >
            <Text style={globalStyles.buttonText}>Change Event Image</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="purple" />
          ) : (
            <TouchableOpacity
              style={globalStyles.button}
              onPress={handleUpdateEvent}
            >
              <Text style={globalStyles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

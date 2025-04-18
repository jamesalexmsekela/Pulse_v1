// app/screens/CreatePulse.tsx
import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { EventContext } from "../context/EventContext";
import GooglePlacesInput, {
  LocationType,
} from "../components/GooglePlacesInput";
import { pickImage, uploadImage } from "../services/imageService";
import { auth } from "../utils/firebaseConfig";

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: { eventId: string };
  Profile: undefined;
  LocationEntry: {
    onLocationSelected: (location: LocationType) => void;
  };
};

type CreatePulseProps = {
  navigation: StackNavigationProp<RootStackParamList, "CreatePulse">;
};

export default function CreatePulse({ navigation }: CreatePulseProps) {
  const { addEvent } = useContext(EventContext)!;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [visibilityRadius, setVisibilityRadius] = useState("");
  const [location, setLocation] = useState<LocationType | null>(null);
  const [eventImage, setEventImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Default placeholder in case no image is provided
  const placeholderImage = "https://via.placeholder.com/150";

  // Handler to upload the event image using the imageService
  const handleUploadEventImage = async () => {
    const uri = await pickImage();
    if (!uri) return;
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        // Generate a unique suffix using the user's UID and current timestamp
        const uniqueSuffix = `${user.uid}_${Date.now()}`;
        // Upload the image to the "eventPictures" folder
        const downloadURL = await uploadImage(
          uri,
          "eventPictures",
          uniqueSuffix
        );
        setEventImage(downloadURL);
        Alert.alert("Success", "Event image uploaded successfully!");
      }
    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear all form inputs after event creation
  const clearForm = () => {
    setName("");
    setCategory("");
    setDate("");
    setStartTime(""); // Clear start time
    setEndTime(""); // Clear end time
    setDescription("");
    setMaxAttendees("");
    setVisibilityRadius("");
    setLocation(null);
    setEventImage("");
  };

  // Handler for creating an event with start and end times
  const handleCreateEvent = async () => {
    if (!name || !category || !date || !location || !startTime || !endTime) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Category, Date, Start Time, End Time, Address)."
      );
      return;
    }
    try {
      setLoading(true);
      await addEvent({
        name,
        category,
        date,
        startTime,
        endTime,
        image: eventImage || placeholderImage,
        description,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address || "Address not available",
        },
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
        ...(visibilityRadius
          ? { visibilityRadius: parseFloat(visibilityRadius) }
          : {}),
      });
      Alert.alert("Success", "Event created successfully!");
      clearForm();
      setLoading(false);
      navigation.navigate("Home");
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{ padding: 16 }}
          enableOnAndroid={true}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={globalStyles.header}>Create a new Pulse Event! 📢</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Event Name"
            placeholderTextColor="gray"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Category (e.g., Music, Tech)"
            placeholderTextColor="gray"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Date (YYYY-MM-DD)"
            placeholderTextColor="gray"
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Start Time (e.g., 18:00)"
            placeholderTextColor="gray"
            value={startTime}
            onChangeText={setStartTime}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="End Time (e.g., 21:00)"
            placeholderTextColor="gray"
            value={endTime}
            onChangeText={setEndTime}
          />
          <TextInput
            style={[globalStyles.input, { height: 80 }]}
            placeholder="Description"
            placeholderTextColor="gray"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Max Attendees (optional)"
            placeholderTextColor="gray"
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            keyboardType="numeric"
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Visibility Radius in km (optional)"
            placeholderTextColor="gray"
            value={visibilityRadius}
            onChangeText={setVisibilityRadius}
            keyboardType="numeric"
          />

          {/* Display the address string if available */}
          {location && (
            <Text style={{ marginVertical: 10 }}>
              Selected Location: {location.address}
            </Text>
          )}

          <TouchableOpacity
            style={[globalStyles.button, { marginVertical: 10 }]}
            onPress={() =>
              navigation.navigate("LocationEntry", {
                onLocationSelected: (loc: LocationType) => {
                  setLocation(loc);
                },
              })
            }
          >
            <Text style={globalStyles.buttonText}>
              {location ? "Change Location" : "Input Location"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, { marginVertical: 10 }]}
            onPress={handleUploadEventImage}
          >
            <Text style={globalStyles.buttonText}>
              {eventImage ? "Change Event Image" : "Upload Event Image"}
            </Text>
          </TouchableOpacity>

          {/* Event image preview */}
          {eventImage && (
            <Image
              source={{ uri: eventImage }}
              style={globalStyles.eventImage}
            />
          )}

          {loading ? (
            <ActivityIndicator size="large" color="purple" />
          ) : (
            <TouchableOpacity
              style={globalStyles.button}
              onPress={handleCreateEvent}
            >
              <Text style={globalStyles.buttonText}>Create Event</Text>
            </TouchableOpacity>
          )}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

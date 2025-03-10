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
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { EventContext } from "../context/EventContext";
import GooglePlacesInput from "../components/GooglePlacesInput";

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: { eventId: string };
  Profile: undefined;
};

type CreatePulseProps = {
  navigation: StackNavigationProp<RootStackParamList, "CreatePulse">;
};

export default function CreatePulse({ navigation }: CreatePulseProps) {
  const { addEvent } = useContext(EventContext)!;
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fixedImage = "https://via.placeholder.com/150";

  const handleCreateEvent = async () => {
    if (!name || !category || !date || !location) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Category, Date, Address)."
      );
      return;
    }
    try {
      setLoading(true);
      await addEvent({
        name,
        category,
        date,
        image: fixedImage,
        description,
        location,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      });
      Alert.alert("Success", "Event created successfully!");
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
          <GooglePlacesInput onLocationSelected={(loc) => setLocation(loc)} />
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

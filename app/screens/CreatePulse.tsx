// app/screens/CreatePulse.tsx (excerpt)
import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { EventContext, Event } from "../context/EventContext";

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
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const fixedImage = "https://via.placeholder.com/150";

  const handleCreateEvent = async () => {
    if (!name || !category || !date || !latitude || !longitude) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Name, Category, Date, Latitude, Longitude)."
      );
      return;
    }
    try {
      await addEvent({
        name,
        category,
        date,
        image: fixedImage,
        description,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      });
      Alert.alert("Success", "Event created successfully!");
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
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
      <TextInput
        style={globalStyles.input}
        placeholder="Latitude"
        placeholderTextColor="gray"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Longitude"
        placeholderTextColor="gray"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleCreateEvent}>
        <Text style={globalStyles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

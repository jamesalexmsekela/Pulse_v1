// app/screens/CreatePulse.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { EventContext, Event } from "../context/EventContext";

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: { event: Event };
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
  // Using fixed location and image for now
  const fixedLocation = { latitude: 41.85, longitude: -87.65 };
  const fixedImage = "https://via.placeholder.com/150";

  const handleCreateEvent = () => {
    if (!name || !category || !date) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    const newEvent: Event = {
      id: Date.now().toString(),
      name,
      category,
      date,
      image: fixedImage,
      description,
      location: fixedLocation,
      rsvped: false,
    };
    addEvent(newEvent);
    Alert.alert("Success", "Event created successfully!");
    navigation.navigate("Home");
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

      <TouchableOpacity style={globalStyles.button} onPress={handleCreateEvent}>
        <Text style={globalStyles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

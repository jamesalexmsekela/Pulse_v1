import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../styles/globalStyles";

const categories = ["Music", "Tech", "Sports", "Art", "Food", "Networking"];

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load user profile data on mount
    (async () => {
      const storedName = await AsyncStorage.getItem("user_name");
      const storedEmail = await AsyncStorage.getItem("user_email");
      const storedCategories = await AsyncStorage.getItem("user_categories");

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      if (storedCategories) setSelectedCategories(JSON.parse(storedCategories));
    })();
  }, []);

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("user_name", name);
      await AsyncStorage.setItem("user_email", email);
      await AsyncStorage.setItem(
        "user_categories",
        JSON.stringify(selectedCategories)
      );
      Alert.alert(
        "Profile Saved",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.log("Error saving profile:", error);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={globalStyles.header}>👤 Edit Profile</Text>

      <Text style={globalStyles.label}>Name</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Enter your name"
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />

      <Text style={globalStyles.label}>Email</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Enter your email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={globalStyles.label}>Select Interests</Text>
      <View style={globalStyles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              globalStyles.categoryButton,
              selectedCategories.includes(category) &&
                globalStyles.categorySelected,
            ]}
            onPress={() => toggleCategory(category)}
          >
            <Text style={globalStyles.buttonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={globalStyles.button} onPress={saveProfile}>
        <Text style={globalStyles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

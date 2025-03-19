// app/screens/Profile.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { globalStyles } from "../styles/globalStyles";
import { auth } from "../utils/firebaseConfig";
import { updateUserProfile } from "../services/userService"; // Import updateUserProfile

const categories = ["Music", "Tech", "Sports", "Art", "Food", "Networking"];

export default function Profile() {
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedCategories = await AsyncStorage.getItem("user_categories");
      const storedDistance = await AsyncStorage.getItem("maxDistance");

      if (storedDistance) setMaxDistance(parseFloat(storedDistance));
      if (storedCategories) setSelectedCategories(JSON.parse(storedCategories));
      setLoading(false);
    })();
  }, []);

  const savePreferences = async () => {
    try {
      // Update local storage for immediate caching
      await AsyncStorage.setItem("maxDistance", maxDistance.toString());
      await AsyncStorage.setItem(
        "user_categories",
        JSON.stringify(selectedCategories)
      );

      // Update Firestore user profile via userService
      const user = auth.currentUser;
      if (user) {
        await updateUserProfile(user.uid, {
          preferences: selectedCategories,
          maxDistance,
        });
      }

      Alert.alert(
        "Preferences Saved",
        "Your preferences have been updated successfully."
      );
    } catch (error) {
      console.log("Error saving preferences:", error);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.header}>👤 User Profile</Text>
      <View style={{ marginVertical: 20, alignItems: "center" }}>
        <Text>Maximum Distance: {maxDistance} km</Text>
        <Slider
          style={{ width: 300, height: 40 }}
          minimumValue={1}
          maximumValue={100}
          step={1}
          value={maxDistance}
          onValueChange={(value) => setMaxDistance(value)}
          minimumTrackTintColor="#9b59b6"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#9b59b6"
        />
      </View>

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

      <TouchableOpacity style={globalStyles.button} onPress={savePreferences}>
        <Text style={globalStyles.buttonText}>Save Preferences</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

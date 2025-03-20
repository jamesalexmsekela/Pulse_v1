// app/screens/Profile.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { globalStyles } from "../styles/globalStyles";
import { auth } from "../utils/firebaseConfig";
import { updateUserProfile, getUserProfile } from "../services/userService";
import { pickImage, uploadImage } from "../services/imageService";

const categories = ["Music", "Tech", "Sports", "Art", "Food", "Networking"];

export default function Profile() {
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load preferences and user profile data on mount
  useEffect(() => {
    (async () => {
      try {
        const storedCategories = await AsyncStorage.getItem("user_categories");
        const storedDistance = await AsyncStorage.getItem("maxDistance");
        if (storedDistance) setMaxDistance(parseFloat(storedDistance));
        if (storedCategories)
          setSelectedCategories(JSON.parse(storedCategories));

        // Fetch the user's profile from Firestore
        const user = auth.currentUser;
        if (user) {
          const profile = await getUserProfile(user.uid);
          if (profile && profile.photoURL) {
            setPhotoURL(profile.photoURL);
          }
        }
      } catch (error) {
        console.log("Error loading preferences or user profile:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Updated function using imageService
  const handleUploadProfilePicture = async () => {
    // Use pickImage from the imageService
    const uri = await pickImage();
    if (!uri) return; // User canceled or permission not granted
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        // Generate a unique suffix using the user ID and current timestamp
        const uniqueSuffix = `${user.uid}_${Date.now()}`;
        // Upload the image to the "profilePictures" folder using the new imageService
        const downloadURL = await uploadImage(
          uri,
          "profilePictures",
          uniqueSuffix
        );
        setPhotoURL(downloadURL);
        // Update Firestore user profile with the new photoURL
        await updateUserProfile(user.uid, { photoURL: downloadURL });
        Alert.alert("Success", "Profile picture uploaded successfully!");
      }
    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      // Update local storage for immediate caching
      await AsyncStorage.setItem("maxDistance", maxDistance.toString());
      await AsyncStorage.setItem(
        "user_categories",
        JSON.stringify(selectedCategories)
      );

      const user = auth.currentUser;
      if (user) {
        await updateUserProfile(user.uid, {
          preferences: selectedCategories,
          maxDistance,
          photoURL: photoURL || "",
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
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={globalStyles.profileImage} />
        ) : (
          <View style={globalStyles.profileImageContainer}>
            <Text style={{ color: "#fff" }}>No Image</Text>
          </View>
        )}
        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleUploadProfilePicture}
        >
          <Text style={globalStyles.buttonText}>Upload Profile Picture</Text>
        </TouchableOpacity>
      </View>

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

// app/screens/Signup.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  View,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { auth } from "../utils/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { createUserProfile } from "../services/userService";
import { pickImage, uploadImage } from "../services/imageService";

type RootStackParamList = {
  Signup: undefined;
  Home: undefined;
};

type SignupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Signup">;
};

export default function Signup({ navigation }: SignupScreenProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [imageUri, setImageUri] = useState<string>(""); // Local URI from picker
  const [photoURL, setPhotoURL] = useState<string>(""); // Final download URL
  const [loading, setLoading] = useState(false);

  const handleUploadProfilePicture = async () => {
    const uri = await pickImage();
    if (!uri) return; // User canceled or permission denied
    setImageUri(uri);
    Alert.alert("Success", "Image selected successfully!");
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        // Update display name
        await updateProfile(user, { displayName: name });
        let finalPhotoURL = "";
        // If an image was selected, upload it now
        if (imageUri) {
          // Generate a unique suffix using user UID and current timestamp
          const uniqueSuffix = `${user.uid}_${Date.now()}`;
          finalPhotoURL = await uploadImage(
            imageUri,
            "profilePictures",
            uniqueSuffix
          );
          setPhotoURL(finalPhotoURL);
        }
        // Create the user profile in Firestore with the uploaded image URL
        await createUserProfile({
          id: user.uid,
          name,
          email,
          photoURL: finalPhotoURL, // will be empty string if no image
          preferences: [],
          maxDistance: 10, // default value
        });
      }
      Alert.alert("Success", "Account created successfully!");
    } catch (error: any) {
      Alert.alert("Signup Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.header}>Signup</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Name"
        placeholderTextColor="gray"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Confirm Password"
        placeholderTextColor="gray"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Display the selected image preview */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={globalStyles.profileImage} />
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

      <TouchableOpacity style={globalStyles.button} onPress={handleSignup}>
        <Text style={globalStyles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

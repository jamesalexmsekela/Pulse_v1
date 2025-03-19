// app/screens/Signup.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globalStyles } from "../styles/globalStyles";
import { auth } from "../utils/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { createUserProfile } from "../services/userService"; // Import userService

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

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        await updateProfile(user, { displayName: name });
        // Create a new user profile in Firestore using the userService
        await createUserProfile({
          id: user.uid,
          name,
          email,
          photoURL: user.photoURL || "",
          preferences: [],
          maxDistance: 10, // default value; adjust as needed
        });
      }
      Alert.alert("Success", "Account created successfully!");
      // Auth state change in App.tsx will handle navigation
    } catch (error: any) {
      Alert.alert("Signup Error", error.message);
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
      <TouchableOpacity style={globalStyles.button} onPress={handleSignup}>
        <Text style={globalStyles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

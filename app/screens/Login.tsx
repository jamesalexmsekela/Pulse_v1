// app/screens/Login.tsx
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
import { signInWithEmailAndPassword } from "firebase/auth";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Signup: undefined;
};

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
};

export default function Login({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.header}>Login</Text>
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
      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={{ color: "blue", fontSize: 16 }}>
          Don't have an account? Sign up.
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

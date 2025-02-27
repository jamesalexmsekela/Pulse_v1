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
  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.header}>👤 User Profile</Text>
    </SafeAreaView>
  );
}

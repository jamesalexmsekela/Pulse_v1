import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { eventBus } from "../utils/EventBus";

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: undefined;
  Profile: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

type Event = {
  id: string;
  name: string;
  category: string;
  location: { latitude: number; longitude: number };
  date: string;
  image: string;
};

const mockEvents: Event[] = [
  {
    id: "1",
    name: "Music Festival",
    category: "Music",
    location: { latitude: 41.861, longitude: -87.846 },
    date: "2025-02-20",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Tech Conference",
    category: "Tech",
    location: { latitude: 41.8128, longitude: -87.006 },
    date: "2025-02-25",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Art Exhibition",
    category: "Art",
    location: { latitude: 41.8138, longitude: -87.0065 },
    date: "2025-02-27",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    name: "Soccer Tournament",
    category: "Sports",
    location: { latitude: 41.9, longitude: -87.7 },
    date: "2025-03-05",
    image: "https://via.placeholder.com/150",
  },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  // Load user preferences once on mount
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const storedCategories = await AsyncStorage.getItem("user_categories");
        if (storedCategories) {
          const parsedCategories = JSON.parse(storedCategories);
          console.log("User Categories Loaded:", parsedCategories);
          setUserCategories(parsedCategories);
        }
      } catch (error) {
        console.log("Error loading user preferences:", error);
      } finally {
        setPreferencesLoaded(true);
      }
    };
    loadUserPreferences();
  }, []);

  // Load events when preferences are loaded
  useEffect(() => {
    if (!preferencesLoaded) return;
    const fetchEvents = async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      const nearbyEvents = mockEvents.filter(
        (event) =>
          Math.abs(event.location.latitude - location.coords.latitude) < 1 &&
          Math.abs(event.location.longitude - location.coords.longitude) < 1 &&
          (userCategories.length === 0 ||
            userCategories.includes(event.category))
      );
      console.log("Filtered Events:", nearbyEvents);
      setEvents(nearbyEvents);
      setLoading(false);
    };
    fetchEvents();
  }, [preferencesLoaded, userCategories]);

  // Refresh handler (pull-to-refresh and via tab press)
  const onRefresh = async () => {
    setRefreshing(true);
    let newCategories: string[] = [];
    try {
      const storedCategories = await AsyncStorage.getItem("user_categories");
      if (storedCategories) {
        newCategories = JSON.parse(storedCategories);
        setUserCategories(newCategories);
      }
    } catch (error) {
      console.log("Error reloading user preferences:", error);
    }
    if (userLocation) {
      const nearbyEvents = mockEvents.filter(
        (event) =>
          Math.abs(event.location.latitude - userLocation.latitude) < 1 &&
          Math.abs(event.location.longitude - userLocation.longitude) < 1 &&
          (newCategories.length === 0 || newCategories.includes(event.category))
      );
      setEvents(nearbyEvents);
    }
    setRefreshing(false);
  };

  // Listen for the custom refresh event from the EventBus
  useEffect(() => {
    const refreshListener = () => {
      onRefresh();
    };
    eventBus.addListener("refreshHome", refreshListener);
    return () => {
      eventBus.removeListener("refreshHome", refreshListener);
    };
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="purple"
        style={globalStyles.container}
      />
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <Text style={globalStyles.header}>🎉 Nearby Events</Text>
      {events.length === 0 ? <Text>No events found near you.</Text> : null}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={globalStyles.card}>
            <Image
              source={{ uri: item.image }}
              style={globalStyles.eventImage}
            />
            <Text style={globalStyles.eventTitle}>{item.name}</Text>
            <Text style={globalStyles.eventDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

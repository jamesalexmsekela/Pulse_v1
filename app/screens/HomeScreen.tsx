// app/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback, useContext } from "react";
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
import { EventContext } from "../context/EventContext";
import { Event } from "../models/Event";
import { eventBus } from "../utils/EventBus";
import { getDistanceFromLatLonInKm } from "../utils/distance";
import { auth } from "../utils/firebaseConfig";

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: { eventId: string };
  Profile: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { events: contextEvents } = useContext(EventContext)!;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(10); // default value in km
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  const loadUserPreferences = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem("user_categories");
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories);
        console.log("User Categories Loaded:", parsedCategories);
        setUserCategories(parsedCategories);
      }
      const storedDistance = await AsyncStorage.getItem("maxDistance");
      if (storedDistance) {
        setMaxDistance(parseFloat(storedDistance));
      }
    } catch (error) {
      console.log("Error loading user preferences:", error);
    } finally {
      setPreferencesLoaded(true);
    }
  };

  // Load preferences on mount
  useEffect(() => {
    loadUserPreferences();
  }, []);

  // Load user location
  useEffect(() => {
    const loadLocation = async () => {
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
    };
    loadLocation();
  }, []);

  // Filter events based on location, categories, and maxDistance
  const filterEvents = useCallback(() => {
    if (!userLocation || !auth.currentUser) return;

    const currentUserId = auth.currentUser.uid;

    const nearbyEvents = contextEvents.filter((event) => {
      // ❌ Skip events created by the current user
      if (event.creatorId === currentUserId) return false;

      const distance = getDistanceFromLatLonInKm(
        userLocation.latitude,
        userLocation.longitude,
        event.location.latitude,
        event.location.longitude
      );

      const userWithinRadius = distance <= maxDistance;
      const eventAllowsVisibility = event.visibilityRadius
        ? distance <= event.visibilityRadius
        : true;

      return (
        userWithinRadius &&
        eventAllowsVisibility &&
        (userCategories.length === 0 || userCategories.includes(event.category))
      );
    });

    console.log("Filtered Events (excluding my own):", nearbyEvents);
    setFilteredEvents(nearbyEvents);
  }, [contextEvents, userLocation, userCategories, maxDistance]);

  useEffect(() => {
    if (preferencesLoaded && userLocation) {
      filterEvents();
      setLoading(false);
    }
  }, [
    preferencesLoaded,
    userLocation,
    userCategories,
    maxDistance,
    filterEvents,
  ]);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserPreferences();
    filterEvents();
    setRefreshing(false);
  };

  // Listen for refresh events from EventBus
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
      {filteredEvents.length === 0 ? (
        <Text>No events found near you.</Text>
      ) : null}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={globalStyles.card}
            onPress={() =>
              navigation.navigate("EventDetails", { eventId: item.id })
            }
          >
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

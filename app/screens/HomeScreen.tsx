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
import { EventContext, Event } from "../context/EventContext";
import { eventBus } from "../utils/EventBus";

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
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

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

  // Load user preferences once on mount
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

  // Filter events based on location and user categories
  const filterEvents = useCallback(() => {
    if (!userLocation) return;
    const nearbyEvents = contextEvents.filter(
      (event) =>
        Math.abs(event.location.latitude - userLocation.latitude) < 1 &&
        Math.abs(event.location.longitude - userLocation.longitude) < 1 &&
        (userCategories.length === 0 || userCategories.includes(event.category))
    );
    console.log("Filtered Events:", nearbyEvents);
    setFilteredEvents(nearbyEvents);
  }, [contextEvents, userLocation, userCategories]);

  // When preferences or location change, filter events
  useEffect(() => {
    if (preferencesLoaded && userLocation) {
      filterEvents();
      setLoading(false);
    }
  }, [preferencesLoaded, userLocation, userCategories, filterEvents]);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    // Re-load preferences from AsyncStorage
    try {
      const storedCategories = await AsyncStorage.getItem("user_categories");
      if (storedCategories) {
        setUserCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.log("Error reloading user preferences:", error);
    }
    // Re-filter events after preferences update
    filterEvents();
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

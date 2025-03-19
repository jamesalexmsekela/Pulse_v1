// app/navigation/AppNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { eventBus } from "../utils/EventBus";

// Import Screens
import HomeScreen from "../screens/HomeScreen";
import CreatePulse from "../screens/CreatePulse";
import EventDetails from "../screens/EventDetails";
import Profile from "../screens/Profile";
import LocationEntryScreen from "../screens/LocationEntryScreen";

type RootStackParamList = {
  Home: undefined;
  EventDetails: { eventId: string };
  LocationEntry: {
    onLocationSelected: (location: {
      latitude: number;
      longitude: number;
    }) => void;
  };
};

type CreatePulseStackParamList = {
  CreatePulse: undefined;
  LocationEntry: {
    onLocationSelected: (location: {
      latitude: number;
      longitude: number;
    }) => void;
  };
};

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator<RootStackParamList>();
const CreatePulseStack = createStackNavigator<CreatePulseStackParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="EventDetails" component={EventDetails} />
    </HomeStack.Navigator>
  );
}

function CreatePulseStackScreen() {
  return (
    <CreatePulseStack.Navigator screenOptions={{ headerShown: false }}>
      <CreatePulseStack.Screen name="CreatePulse" component={CreatePulse} />
      <CreatePulseStack.Screen
        name="LocationEntry"
        component={LocationEntryScreen}
      />
    </CreatePulseStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "CreatePulse") iconName = "add-circle";
          else if (route.name === "Profile") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              eventBus.emit("refreshHome");
            }
          },
        })}
      />
      <Tab.Screen
        name="CreatePulse"
        component={CreatePulseStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

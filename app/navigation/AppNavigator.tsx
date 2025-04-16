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
import AttendeesScreen from "../screens/AttendeesScreen";
import MyEventsScreen from "../screens/MyEventsScreen";
import EditEventScreen from "../screens/EditEventScreen";

type RootStackParamList = {
  Home: undefined;
  EventDetails: { eventId: string };
  EditEvent: { eventId: string };
  LocationEntry: {
    onLocationSelected: (location: {
      latitude: number;
      longitude: number;
    }) => void;
  };
  MyEvents: undefined;
  Profile: undefined;
  Attendees: { eventId: string };
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

type MyEventsStackParamList = {
  MyEvents: undefined;
  EventDetails: { eventId: string };
};

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator<RootStackParamList>();
const CreatePulseStack = createStackNavigator<CreatePulseStackParamList>();
const MyEventsStack = createStackNavigator();

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
      <HomeStack.Screen name="Attendees" component={AttendeesScreen} />
      <HomeStack.Screen name="EditEvent" component={EditEventScreen} />
    </HomeStack.Navigator>
  );
}

function MyEventsStackScreen() {
  return (
    <MyEventsStack.Navigator screenOptions={{ headerShown: false }}>
      <MyEventsStack.Screen name="MyEvents" component={MyEventsScreen} />
      <MyEventsStack.Screen name="EventDetails" component={EventDetails} />
      <MyEventsStack.Screen name="EditEvent" component={EditEventScreen} />
      <MyEventsStack.Screen name="Attendees" component={AttendeesScreen} />
    </MyEventsStack.Navigator>
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
      <Tab.Screen
        name="MyEvents"
        component={MyEventsStackScreen}
        options={{
          tabBarLabel: "My Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

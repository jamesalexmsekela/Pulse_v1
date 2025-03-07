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

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: { eventId: string };
  Profile: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
    </Stack.Navigator>
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
        component={HomeStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Only emit the refresh event if the Home screen is already focused
            if (navigation.isFocused()) {
              eventBus.emit("refreshHome");
            }
          },
        })}
      />
      <Tab.Screen
        name="CreatePulse"
        component={CreatePulse}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

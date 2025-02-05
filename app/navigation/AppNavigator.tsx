import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import CreatePulse from '../screens/CreatePulse';
import EventDetails from '../screens/EventDetails';
import Profile from '../screens/Profile';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'CreatePulse') {
              iconName = 'add-circle';
            } else if (route.name === 'EventDetails') {
              iconName = 'calendar';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="CreatePulse" component={CreatePulse} />
        <Tab.Screen name="EventDetails" component={EventDetails} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

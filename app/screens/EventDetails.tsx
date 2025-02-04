// app/screens/EventDetails.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: undefined;
  Profile: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function EventDetails({ navigation }: ScreenProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Event Details 🗓️</Text>
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

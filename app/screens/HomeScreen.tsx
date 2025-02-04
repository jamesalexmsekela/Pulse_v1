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

export default function HomeScreen({ navigation }: ScreenProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Pulse! 🔥</Text>
      <Button title="Go to Create Pulse" onPress={() => navigation.navigate('CreatePulse')} />
    </View>
  );
}

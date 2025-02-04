import 'react-native-gesture-handler';
import React from 'react';
import { View, Text } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Pulse! 🚀</Text>
      <AppNavigator />
    </View>
  );
}

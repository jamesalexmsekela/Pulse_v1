import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
    </SafeAreaView>
  );
}

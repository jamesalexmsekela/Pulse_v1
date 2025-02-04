// app/screens/CreatePulse.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native';

type RootStackParamList = {
  Home: undefined;
  CreatePulse: undefined;
  EventDetails: undefined;
  Profile: undefined;
};

type ScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function CreatePulse({ navigation }: ScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Create a new Pulse Event! 📢</Text>
            <Button title="Back to Home" onPress={() => navigation.goBack()} />
        </View>
    </SafeAreaView>
    
  );
}

// app/screens/Profile.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native';

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>👤 User Profile</Text>
        </View>
    </SafeAreaView>
  );
}

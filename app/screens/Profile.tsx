import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function Profile() {
  return (
    <SafeAreaView style={globalStyles.container}>
        <Text style={globalStyles.header}>👤 User Profile</Text>
    </SafeAreaView>
  );
}

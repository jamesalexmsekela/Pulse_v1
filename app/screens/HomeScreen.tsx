import React from 'react';
import { Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { globalStyles } from '../styles/globalStyles'; // Import global styles

type RootStackParamList = {
    Home: undefined;
    CreatePulse: undefined;
    EventDetails: undefined;
    Profile: undefined;
};

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.header}>Welcome to Pulse! 🚀</Text>
            <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate('CreatePulse')}>
                <Text style={globalStyles.buttonText}>Go to Create Pulse</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

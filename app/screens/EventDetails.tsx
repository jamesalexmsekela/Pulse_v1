import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';

type RootStackParamList = {
    Home: undefined;
    CreatePulse: undefined;
    EventDetails: undefined;
    Profile: undefined;
};

type EventDetailsProps = {
    navigation: StackNavigationProp<RootStackParamList, 'EventDetails'>;
    route: RouteProp<RootStackParamList, 'EventDetails'>;
};

export default function EventDetails({ navigation }: EventDetailsProps) {
    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.header}>Event Details 🗓️</Text>
            <TouchableOpacity style={globalStyles.button} onPress={() => navigation.goBack()}>
                <Text style={globalStyles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

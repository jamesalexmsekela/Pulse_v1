import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

type RootStackParamList = {
    Home: undefined;
    CreatePulse: undefined;
    EventDetails: undefined;
    Profile: undefined;
};

type CreatePulseProps = {
    navigation: StackNavigationProp<RootStackParamList, 'CreatePulse'>;
};

export default function CreatePulse({ navigation }: CreatePulseProps) {
    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.header}>Create a new Pulse Event! 📢</Text>
            <TouchableOpacity style={globalStyles.button} onPress={() => navigation.goBack()}>
                <Text style={globalStyles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

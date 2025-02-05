import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { globalStyles } from '../styles/globalStyles'; // Import global styles
import * as Location from 'expo-location';

type RootStackParamList = {
    Home: undefined;
    CreatePulse: undefined;
    EventDetails: undefined;
    Profile: undefined;
};

type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

type Event = {
    id: string;
    name: string;
    location: { latitude: number; longitude: number };
    date: string;
    image: string;
  };
  
  const mockEvents: Event[] = [
    { id: '1', name: 'Music Festival', location: { latitude: 41.8810, longitude: -87.6460 }, date: '2025-02-20', image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Tech Conference', location: { latitude: 41.7128, longitude: -88.0060 }, date: '2025-02-25', image: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Art Exhibition', location: { latitude: 42.7138, longitude: -88.0065 }, date: '2025-02-27', image: 'https://via.placeholder.com/150' },
  ];

export default function HomeScreen({ navigation }: HomeScreenProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                setLoading(false);
                return;
            }
        
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });

            // Simulating fetching location-based events
            const nearbyEvents = mockEvents.filter(event => (
                Math.abs(event.location.latitude - location.coords.latitude) < 1 &&
                Math.abs(event.location.longitude - location.coords.longitude) < 1
            ));

            setEvents(nearbyEvents);
            setLoading(false);
        })();
    }, []);
    
    if (loading) {
        return <ActivityIndicator size="large" color="purple" style={globalStyles.container} />;
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.header}>🎉 Nearby Events</Text>
            {events.length === 0 ? <Text>No events found near you.</Text> : null}
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={globalStyles.card}>
                    <Image source={{ uri: item.image }} style={globalStyles.eventImage} />
                    <Text style={globalStyles.eventTitle}>{item.name}</Text>
                    <Text style={globalStyles.eventDate}>{item.date}</Text>
                  </TouchableOpacity>
                )}            
            />
        </SafeAreaView>
    );
}

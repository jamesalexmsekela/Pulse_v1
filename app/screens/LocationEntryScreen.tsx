// app/screens/LocationEntryScreen.tsx
import React from "react";
import { SafeAreaView, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import GooglePlacesInput from "../components/GooglePlacesInput";

type CreatePulseStackParamList = {
  CreatePulse: undefined;
  LocationEntry: {
    onLocationSelected: (location: {
      latitude: number;
      longitude: number;
    }) => void;
  };
};

type LocationEntryScreenNavigationProp = StackNavigationProp<
  CreatePulseStackParamList,
  "LocationEntry"
>;
type LocationEntryScreenRouteProp = RouteProp<
  CreatePulseStackParamList,
  "LocationEntry"
>;

type Props = {
  navigation: LocationEntryScreenNavigationProp;
  route: LocationEntryScreenRouteProp;
};

const LocationEntryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { onLocationSelected } = route.params;

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { justifyContent: "flex-start", alignItems: "center" },
      ]}
    >
      <GooglePlacesInput
        onLocationSelected={(location) => {
          onLocationSelected(location);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default LocationEntryScreen;

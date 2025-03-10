// app/components/GooglePlacesInput.tsx
import React from "react";
import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { globalStyles } from "../styles/globalStyles";

type GooglePlacesInputProps = {
  onLocationSelected: (location: {
    latitude: number;
    longitude: number;
  }) => void;
};

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  onLocationSelected,
}) => {
  return (
    <View style={{ flex: 0, width: "100%", zIndex: 9999 }}>
      <GooglePlacesAutocomplete
        placeholder="Enter event address"
        onPress={(data, details = null) => {
          if (details?.geometry?.location) {
            const { lat, lng } = details.geometry.location;
            onLocationSelected({ latitude: lat, longitude: lng });
          }
        }}
        onFail={(error) =>
          console.error("GooglePlacesAutocomplete error:", error)
        }
        query={{
          key: "AIzaSyD9lWsIa8fEBmXhJisXZmwOdf2dlYnM65E", // Replace with your key
          language: "en",
        }}
        fetchDetails={true}
        minLength={2}
        debounce={200}
        styles={{
          container: { flex: 0, width: "100%", zIndex: 9999 },
          textInput: globalStyles.input,
          listView: {
            backgroundColor: "white",
            position: "absolute",
            top: 50, // adjust as needed
            left: 0,
            right: 0,
            zIndex: 9999,
          },
        }}
        enablePoweredByContainer={false}
      />
    </View>
  );
};

export default GooglePlacesInput;

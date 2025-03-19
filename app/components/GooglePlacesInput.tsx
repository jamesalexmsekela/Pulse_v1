// app/components/GooglePlacesInput.tsx
import React from "react";
import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { globalStyles } from "../styles/globalStyles";
import { GOOGLE_PLACES_API_KEY } from "@env";

export type LocationType = {
  latitude: number;
  longitude: number;
  address: string;
};

type GooglePlacesInputProps = {
  onLocationSelected: (location: LocationType) => void;
};

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  onLocationSelected,
}) => {
  return (
    <View style={{ flex: 0, width: "90%", zIndex: 9999 }}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          if (details?.geometry?.location) {
            const { lat, lng } = details.geometry.location;
            onLocationSelected({
              latitude: lat,
              longitude: lng,
              address: data.description,
            });
          }
        }}
        onFail={(error) =>
          console.error("GooglePlacesAutocomplete error:", error)
        }
        query={{
          key: GOOGLE_PLACES_API_KEY,
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

// App.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { globalStyles } from "./app/styles/globalStyles";
import { firebase } from "./app/utils/firebaseConfig";
import { EventProvider } from "./app/context/EventContext";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((usr) => {
      setUser(usr);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="purple"
        style={globalStyles.container}
      />
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <EventProvider>
          <AppNavigator />
        </EventProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

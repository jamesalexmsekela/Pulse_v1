// App.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { globalStyles } from "./app/styles/globalStyles";
import { auth } from "./app/utils/firebaseConfig";
import { EventProvider } from "./app/context/EventContext";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { registerForPushNotificationsAsync } from "./app/utils/notifications";
import NotificationHandler from "./app/components/NotificationHandler";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Always call hooks unconditionally
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log("Push token:", token);
    });
  }, []);

  return (
    <NavigationContainer>
      <NotificationHandler />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="purple"
          style={globalStyles.container}
        />
      ) : user ? (
        <EventProvider>
          <AppNavigator />
        </EventProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

// App.tsx
import "react-native-get-random-values";
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
import { updateUserProfile } from "./app/services/userService";

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

  // Sync push token with Firestore when user logs in
  // This is a side effect that should be run after the user state is set
  // and the app is ready to handle notifications
  useEffect(() => {
    const syncPushToken = async () => {
      if (!user) return;
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await updateUserProfile(user.uid, { pushToken: token });
        console.log("✅ Push token synced to Firestore:", token);
      }
    };
    syncPushToken();
  }, [user]);

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

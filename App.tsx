// App.tsx
import React from "react";
import AppNavigator from "./app/navigation/AppNavigator";
import { EventProvider } from "./app/context/EventContext";

export default function App() {
  return (
    <EventProvider>
      <AppNavigator />
    </EventProvider>
  );
}

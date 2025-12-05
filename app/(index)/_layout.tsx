import React from "react";
import { useNetworkState } from "expo-network";
import { Stack } from "expo-router";
import { Alert } from "react-native";
import { WidgetProvider } from "@/contexts/WidgetContext";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function AppIndexLayout() {
  const networkState = useNetworkState();

  React.useEffect(() => {
    if (!networkState.isConnected && networkState.isInternetReachable === false) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  return (
    <WidgetProvider>
      <Stack
        screenOptions={{
          headerShown: false, // IMPORTANT for splash animation
        }}
      >
        {/* Register the index screen */}
        <Stack.Screen name="index" />
      </Stack>
    </WidgetProvider>
  );
}

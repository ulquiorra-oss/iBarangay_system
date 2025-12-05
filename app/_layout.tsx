import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SystemBars } from "react-native-edge-to-edge";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { AuthProvider } from "../contexts/AuthContext";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  // control the splash
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        // wait 3.5 seconds before showing app
        setTimeout(() => {
          setIsReady(true);
          SplashScreen.hideAsync();
        }, 3500);

      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  // Load splash screen FIRST (native splash)
  if (!isReady) {
    return null; // keeps native splash visible
  }

  // After splash → load app
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <SystemBars style="auto" />

          {/* 👇 ADDED initialRouteName="splash" */}
          <Stack screenOptions={{ headerShown: false }} initialRouteName="splash">
            <Stack.Screen name="splash" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(resident)" />
            <Stack.Screen name="(admin)" />
            <Stack.Screen name="index" />
          </Stack>

          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

import React from "react";
import { Stack } from "expo-router";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function HomeScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "iBarangay System",
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo.png")} // 👈 replace with your iBarangay logo path
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to iBarangay</Text>
        <Text style={styles.subtitle}>
          Manage barangay services, residents, and requests in one place.
        </Text>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

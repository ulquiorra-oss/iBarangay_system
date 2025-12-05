import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to iBarangay</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/(auth)/welcome")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16 },
});

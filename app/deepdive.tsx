import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { DurationOption } from "../types/session";

export default function DeepDiveScreen() {
  const { duration } = useLocalSearchParams<{ duration?: DurationOption }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Dive</Text>

      <Text style={styles.body}>
        This route takes a bit longer and helps you reflect on both connection
        and structure before choosing one thing to try.
      </Text>

      <Link
        href={{
          pathname: "/warmth",
          params: { duration: duration || "10" },
        }}
        style={styles.button}
      >
        Continue
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  body: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 32,
    color: "#333",
  },
  button: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 14,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#e6eefc",
    color: "#1d4ed8",
  },
});

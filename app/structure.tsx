import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";
import { DurationOption } from "../types/session";

export default function StructureScreen() {
  const { warmth, duration } = useLocalSearchParams<{
    warmth?: string;
    duration?: DurationOption;
  }>();

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 20 }}>
        Structure and Boundaries
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 24 }}>
        How clear and consistent do expectations and boundaries feel at the
        moment?
      </Text>

      <Button
        title="Very clear – expectations are mostly understood"
        onPress={() =>
          router.push({
            pathname: "/balance",
            params: { warmth, structure: "high", duration: duration || "10" },
          })
        }
      />

      <View style={{ height: 12 }} />

      <Button
        title="Sometimes clear, but often repeated"
        onPress={() =>
          router.push({
            pathname: "/balance",
            params: { warmth, structure: "medium", duration: duration || "10" },
          })
        }
      />

      <View style={{ height: 12 }} />

      <Button
        title="Often unclear or inconsistent"
        onPress={() =>
          router.push({
            pathname: "/balance",
            params: { warmth, structure: "low", duration: duration || "10" },
          })
        }
      />

      <View style={{ height: 12 }} />

      <Button
        title="It depends on the situation"
        onPress={() =>
          router.push({
            pathname: "/balance",
            params: { warmth, structure: "mixed", duration: duration || "10" },
          })
        }
      />
    </View>
  );
}

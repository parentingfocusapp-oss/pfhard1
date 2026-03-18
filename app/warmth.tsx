import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { DurationOption } from "../types/session";

export default function WarmthScreen() {
  const { duration } = useLocalSearchParams<{ duration?: DurationOption }>();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: WarmTheme.bg,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 20, color: WarmTheme.text }}>
        Connection and Warmth
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 24, color: WarmTheme.mutedText }}>
        When things are difficult, how easy is it at the moment to stay calm,
        warm, or emotionally connected with your child?
      </Text>

      <Button
        title="Usually easy – I stay warm and calm"
        onPress={() =>
          router.push({
            pathname: "/structure",
            params: { warmth: "high", duration: duration || "10" },
          })
        }
      />

      <View style={{ height: 12 }} />

      <Button
        title="I manage sometimes, but not always"
        onPress={() =>
          router.push({
            pathname: "/structure",
            params: { warmth: "medium", duration: duration || "10" },
          })
        }
      />

      <View style={{ height: 12 }} />

      <Button
        title="Often difficult – I lose patience"
        onPress={() =>
          router.push({
            pathname: "/structure",
            params: { warmth: "low", duration: duration || "10" },
          })
        }
      />

      <View style={{ height: 12 }} />

      <Button
        title="It really depends on the situation"
        onPress={() =>
          router.push({
            pathname: "/structure",
            params: { warmth: "mixed", duration: duration || "10" },
          })
        }
      />
    </View>
  );
}

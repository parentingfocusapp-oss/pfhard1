import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { DurationOption } from "../types/session";

export default function DeepDiveScreen() {
  const { duration } = useLocalSearchParams<{ duration?: DurationOption }>();

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: WarmTheme.bg,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 16,
          color: WarmTheme.text,
        }}
      >
        This route goes a bit deeper
      </Text>

      <Text
        style={{
          fontSize: 17,
          lineHeight: 26,
          marginBottom: 12,
          color: WarmTheme.mutedText,
        }}
      >
        We will look at warmth and structure in a few everyday moments.
      </Text>

      <Text
        style={{
          fontSize: 17,
          lineHeight: 26,
          marginBottom: 28,
          color: WarmTheme.mutedText,
        }}
      >
        Then we will help you choose one practical thing to try.
      </Text>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/warmth",
            params: { duration: duration || "10" },
          })
        }
        style={{
          borderRadius: 10,
          paddingVertical: 14,
          alignItems: "center",
          backgroundColor: WarmTheme.accent,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Continue
        </Text>
      </Pressable>
    </View>
  );
}

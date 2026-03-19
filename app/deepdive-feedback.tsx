import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { buildParentingProfile, getProfileInterpretation } from "../lib/deepdive";
import { DurationOption } from "../types/session";

function parseSelectionList(value?: string) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export default function DeepDiveFeedbackScreen() {
  const { warmthSelections, structureSelections, duration } =
    useLocalSearchParams<{
      warmthSelections?: string;
      structureSelections?: string;
      duration?: DurationOption;
    }>();

  const profile = useMemo(
    () =>
      buildParentingProfile({
        warmthSelections: parseSelectionList(warmthSelections),
        structureSelections: parseSelectionList(structureSelections),
      }),
    [structureSelections, warmthSelections]
  );

  const interpretation = getProfileInterpretation(profile);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: WarmTheme.bg,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 12, color: WarmTheme.text }}>
        A simple picture of your pattern
      </Text>

      <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 10, color: WarmTheme.accent }}>
        {profile.quadrant}
      </Text>

      <Text style={{ fontSize: 17, lineHeight: 26, marginBottom: 14, color: WarmTheme.text }}>
        {interpretation}
      </Text>

      <Text style={{ fontSize: 16, lineHeight: 25, marginBottom: 28, color: WarmTheme.mutedText }}>
        {profile.suggestedDirection}
      </Text>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/deepdive-goal",
            params: {
              duration: duration || "10",
              warmth: profile.warmthLevel,
              structure: profile.structureLevel,
              quadrant: profile.quadrant,
              suggestedDirection: profile.suggestedDirection,
            },
          })
        }
        style={{
          borderRadius: 10,
          paddingVertical: 14,
          alignItems: "center",
          backgroundColor: WarmTheme.accent,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Continue
        </Text>
      </Pressable>
    </View>
  );
}

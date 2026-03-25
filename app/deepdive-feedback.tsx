import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { buildParentingProfile } from "../lib/deepdive";
import { AgeBand } from "../types/experiment";
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
  const { warmthSelections, structureSelections, duration, ageBand } =
    useLocalSearchParams<{
      warmthSelections?: string;
      structureSelections?: string;
      duration?: DurationOption;
      ageBand?: AgeBand;
    }>();

  const profile = useMemo(
    () =>
      buildParentingProfile({
        warmthSelections: parseSelectionList(warmthSelections),
        structureSelections: parseSelectionList(structureSelections),
      }),
    [structureSelections, warmthSelections]
  );

  const leanLabel =
    profile.quadrant === "higher warmth / lower structure"
      ? "more on warmth"
      : profile.quadrant === "higher structure / lower warmth"
      ? "more on structure"
      : profile.quadrant === "lower both"
      ? "stretched in both"
      : "fairly balanced";
  const directionLabel =
    profile.quadrant === "higher warmth / lower structure"
      ? "clearer structure while keeping your warmth"
      : profile.quadrant === "higher structure / lower warmth"
      ? "a little more connection inside your clarity"
      : profile.quadrant === "lower both"
      ? "something simpler, calmer, and clearer"
      : "using both warmth and structure more deliberately";

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
        A quick reflection
      </Text>

      <Text style={{ fontSize: 17, lineHeight: 26, marginBottom: 10, color: WarmTheme.text }}>
        You tend to lean {leanLabel}.
      </Text>

      <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 28, color: WarmTheme.mutedText }}>
        We&apos;ll gently move toward {directionLabel}.
      </Text>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/deepdive-goal",
            params: {
              duration: duration || "10",
              ageBand: ageBand || "",
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
          Now let&apos;s focus this on one real situation.
        </Text>
      </Pressable>
    </View>
  );
}

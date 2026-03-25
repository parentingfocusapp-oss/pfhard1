import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { goalSuggestions } from "../lib/deepdive";
import { AgeBand } from "../types/experiment";
import { DurationOption } from "../types/session";

export default function DeepDiveGoalScreen() {
  const { warmth, structure, quadrant, suggestedDirection, duration, ageBand } =
    useLocalSearchParams<{
      warmth?: string;
      structure?: string;
      quadrant?: string;
      suggestedDirection?: string;
      duration?: DurationOption;
      ageBand?: AgeBand;
    }>();

  const [goal, setGoal] = useState("");

  const trimmedGoal = goal.trim();

  function continueToReality() {
    const nextGoal = trimmedGoal || "a calmer repeated moment";

    router.push({
      pathname: "/topic",
      params: {
        duration: duration || "10",
        ageBand: ageBand || "",
        routeType: "deepdive",
        balance: nextGoal,
        warmth: warmth || "",
        structure: structure || "",
        quadrant: quadrant || "",
        suggestedDirection: suggestedDirection || "",
      },
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: WarmTheme.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 12, color: WarmTheme.text }}>
          What do you most want to improve or change?
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 18, color: WarmTheme.mutedText }}>
          Now let&apos;s focus this on one real situation.
        </Text>

        <TextInput
          value={goal}
          onChangeText={setGoal}
          placeholder="For example: calmer mornings, less arguing at bedtime, clearer follow-through"
          multiline
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 10,
            padding: 12,
            minHeight: 110,
            textAlignVertical: "top",
            marginBottom: 20,
            backgroundColor: WarmTheme.surface,
            color: WarmTheme.text,
          }}
          placeholderTextColor={WarmTheme.mutedText}
        />

        <Text style={{ fontSize: 14, fontWeight: "700", marginBottom: 10, color: WarmTheme.accent }}>
          Suggestions
        </Text>

        {goalSuggestions.map((suggestion) => (
          <Pressable
            key={suggestion}
            onPress={() => setGoal(suggestion)}
            style={{
              borderWidth: 1,
              borderColor: WarmTheme.border,
              borderRadius: 10,
              padding: 12,
              marginBottom: 10,
              backgroundColor: WarmTheme.surface,
            }}
          >
            <Text style={{ color: WarmTheme.text }}>{suggestion}</Text>
          </Pressable>
        ))}

        <View style={{ height: 16 }} />

        <Pressable
          onPress={continueToReality}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

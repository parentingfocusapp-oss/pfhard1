import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { DurationOption } from "../types/session";

export default function RealityMomentGoalScreen() {
  const { warmth, structure, duration } = useLocalSearchParams<{
    warmth?: string;
    structure?: string;
    duration?: DurationOption;
  }>();

  const [reality, setReality] = useState("");
  const [moment, setMoment] = useState("");
  const [goal, setGoal] = useState("");

  function continueToIdeas() {
    router.push({
      pathname: "/balance",
      params: {
        warmth: warmth || "",
        structure: structure || "",
        duration: duration || "10",
        reality: reality.trim(),
        moment: moment.trim(),
        balance: goal.trim(),
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
        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 14, color: WarmTheme.text }}>
          Reality, moment, goal
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 20, color: WarmTheme.mutedText }}>
          Before generating ideas, capture what is real right now, one concrete
          moment, and what you are aiming for.
        </Text>

        <Text style={{ fontWeight: "600", marginBottom: 8, color: WarmTheme.text }}>Reality now</Text>
        <TextInput
          value={reality}
          onChangeText={setReality}
          placeholder="What feels most true right now?"
          multiline
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 8,
            padding: 12,
            minHeight: 80,
            textAlignVertical: "top",
            marginBottom: 14,
            backgroundColor: WarmTheme.surface,
            color: WarmTheme.text,
          }}
          placeholderTextColor={WarmTheme.mutedText}
        />

        <Text style={{ fontWeight: "600", marginBottom: 8, color: WarmTheme.text }}>Moment</Text>
        <TextInput
          value={moment}
          onChangeText={setMoment}
          placeholder="Describe one recent moment"
          multiline
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 8,
            padding: 12,
            minHeight: 80,
            textAlignVertical: "top",
            marginBottom: 14,
            backgroundColor: WarmTheme.surface,
            color: WarmTheme.text,
          }}
          placeholderTextColor={WarmTheme.mutedText}
        />

        <Text style={{ fontWeight: "600", marginBottom: 8, color: WarmTheme.text }}>Goal</Text>
        <TextInput
          value={goal}
          onChangeText={setGoal}
          placeholder="What would a better next step look like?"
          multiline
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 8,
            padding: 12,
            minHeight: 80,
            textAlignVertical: "top",
            marginBottom: 20,
            backgroundColor: WarmTheme.surface,
            color: WarmTheme.text,
          }}
          placeholderTextColor={WarmTheme.mutedText}
        />

        <Button title="Continue to your ideas" onPress={continueToIdeas} />
        <View style={{ height: 12 }} />
        <Button title="Back" onPress={() => router.back()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

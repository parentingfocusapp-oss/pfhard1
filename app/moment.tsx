import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput
} from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { momentOptions } from "../data/options";
import { interpretOwnMoment } from "../lib/ai/client";

export default function MomentScreen() {
  const { topic, duration } = useLocalSearchParams<{
    topic?: string;
    duration?: string;
  }>();

  const [selectedMoment, setSelectedMoment] = useState("");
  const [momentText, setMomentText] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const options = momentOptions[topic || ""] || [];
  const chosenMoment = selectedMoment || momentText.trim();
  const canContinue = chosenMoment.length > 0 && !isLoadingAi;
  const hasPresetOptions = options.length > 0;

  async function handleContinue() {
    const isTypedMoment = !selectedMoment && momentText.trim().length > 0;

    // If the user selected a preset moment, skip AI
    if (!isTypedMoment) {
      router.push({
        pathname: "/process",
        params: {
          topic: topic || "",
          moment: chosenMoment,
          momentSource: "preset",
          duration: duration || "10",
        },
      });
      return;
    }

    try {
      setIsLoadingAi(true);

      const interpreted = await interpretOwnMoment({
        topic,
        momentText: momentText.trim(),
        knownMoments: options,
      });

      router.push({
        pathname: "/process",
        params: {
          topic: interpreted.topic !== "Unknown" ? interpreted.topic : topic || "",
          moment: interpreted.label,
          matchedMoment: interpreted.matchedMoment,
          momentSummary: interpreted.summary,
          momentThemes: JSON.stringify(interpreted.themes),
          rawMoment: momentText.trim(),
          momentSource: "typed",
          duration: duration || "10",
        },
      });
    } catch {
      // Fallback if AI fails
      router.push({
        pathname: "/process",
        params: {
          topic: topic || "",
          moment: momentText.trim(),
          matchedMoment: "custom",
          rawMoment: momentText.trim(),
          momentSource: "typed",
          duration: duration || "10",
        },
      });
    } finally {
      setIsLoadingAi(false);
    }
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
        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16, color: WarmTheme.text }}>
          What moment is hardest right now?
        </Text>

        {topic ? (
          <Text style={{ marginBottom: 16, color: WarmTheme.mutedText }}>
            Topic: {topic}
          </Text>
        ) : null}

        {hasPresetOptions
          ? options.map((option) => {
              const isSelected = selectedMoment === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    setSelectedMoment(option);
                    setMomentText("");
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: isSelected ? WarmTheme.accent : WarmTheme.border,
                    borderRadius: 8,
                    padding: 14,
                    marginBottom: 12,
                    backgroundColor: isSelected
                      ? WarmTheme.surfaceAlt
                      : WarmTheme.surface,
                  }}
                >
                  <Text style={{ color: WarmTheme.text }}>{option}</Text>
                </Pressable>
              );
            })
          : (
            <Text
              style={{
                marginBottom: 12,
                color: WarmTheme.mutedText,
              }}
            >
              There is no preset list for this topic, so describe the moment in
              your own words.
            </Text>
          )}

        <Text style={{ fontSize: 16, marginTop: 8, marginBottom: 8, color: WarmTheme.mutedText }}>
          {hasPresetOptions ? "Or describe it in your own words" : "Describe the moment"}
        </Text>

        <TextInput
          value={momentText}
          onChangeText={(text) => {
            setMomentText(text);
            if (text.trim().length > 0) {
              setSelectedMoment("");
            }
          }}
          placeholder="Describe the moment"
          multiline
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 8,
            padding: 12,
            minHeight: 100,
            textAlignVertical: "top",
            marginBottom: 24,
            backgroundColor: WarmTheme.surface,
            color: WarmTheme.text,
          }}
          placeholderTextColor={WarmTheme.mutedText}
        />

        <Pressable
          onPress={() => {
            if (canContinue) {
              void handleContinue();
            }
          }}
          disabled={!canContinue}
          style={{
            borderRadius: 8,
            paddingVertical: 14,
            paddingHorizontal: 16,
            alignItems: "center",
            backgroundColor: canContinue ? WarmTheme.accent : WarmTheme.border,
          }}
        >
          <Text
            style={{
              color: canContinue ? "#fff" : "#475569",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {isLoadingAi ? "Making sense of your moment..." : "Continue"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

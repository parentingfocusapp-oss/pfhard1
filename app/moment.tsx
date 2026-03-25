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
import { AgeBand } from "../types/experiment";

export default function MomentScreen() {
  const {
    topic,
    duration,
    routeType,
    balance,
    warmth,
    structure,
    quadrant,
    suggestedDirection,
    ageBand,
  } = useLocalSearchParams<{
    topic?: string;
    duration?: string;
    routeType?: string;
    balance?: string;
    warmth?: string;
    structure?: string;
    quadrant?: string;
    suggestedDirection?: string;
    ageBand?: AgeBand;
  }>();

  const [selectedMoment, setSelectedMoment] = useState("");
  const [momentText, setMomentText] = useState("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const options = momentOptions[topic || ""] || [];
  const chosenMoment = selectedMoment || momentText.trim();
  const canContinue = chosenMoment.length > 0 && !isLoadingAi;
  const hasPresetOptions = options.length > 0;

  function buildNextParams(nextValues: {
    topic: string;
    moment: string;
    rawMoment?: string;
    momentSource: "preset" | "typed";
  }) {
    if (routeType === "deepdive") {
      return {
        pathname: "/balance" as const,
        params: {
          topic: nextValues.topic,
          moment: nextValues.moment,
          rawMoment: nextValues.rawMoment || "",
          momentSource: nextValues.momentSource,
          duration: duration || "10",
          routeType: "deepdive",
          balance: balance || "",
          warmth: warmth || "",
          structure: structure || "",
          quadrant: quadrant || "",
          suggestedDirection: suggestedDirection || "",
          ageBand: ageBand || "",
        },
      };
    }

    return {
      pathname: "/process" as const,
      params: {
        topic: nextValues.topic,
        moment: nextValues.moment,
        rawMoment: nextValues.rawMoment || "",
        momentSource: nextValues.momentSource,
        duration: duration || "10",
        ageBand: ageBand || "",
      },
    };
  }

  async function handleContinue() {
    const isTypedMoment = !selectedMoment && momentText.trim().length > 0;

    // If the user selected a preset moment, skip AI
    if (!isTypedMoment) {
      router.push(
        buildNextParams({
          topic: topic || "",
          moment: chosenMoment,
          momentSource: "preset",
        })
      );
      return;
    }

    try {
      setIsLoadingAi(true);

      const interpreted = await interpretOwnMoment({
        topic,
        momentText: momentText.trim(),
        knownMoments: options,
      });

      const nextTopic =
        interpreted.topic !== "Unknown" ? interpreted.topic : topic || "";

      router.push(
        buildNextParams({
          topic: nextTopic,
          moment: interpreted.label,
          rawMoment: momentText.trim(),
          momentSource: "typed",
        })
      );
    } catch {
      // Fallback if AI fails
      router.push(
        buildNextParams({
          topic: topic || "",
          moment: momentText.trim(),
          rawMoment: momentText.trim(),
          momentSource: "typed",
        })
      );
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

        <Text style={{ marginBottom: 16, color: WarmTheme.mutedText }}>
          {routeType === "deepdive"
            ? "Before I suggest anything, let's include your own ideas."
            : topic
            ? `Topic: ${topic}`
            : ""}
        </Text>

        {routeType !== "deepdive" && topic ? (
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
            {isLoadingAi
              ? "Making sense of your moment..."
              : routeType === "deepdive"
              ? "Continue to your ideas"
              : "Continue"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

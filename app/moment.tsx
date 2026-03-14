import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput
} from "react-native";
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

  async function handleContinue() {
    const isTypedMoment = !selectedMoment && momentText.trim().length > 0;

    // If the user selected a preset moment, skip AI
    if (!isTypedMoment) {
      router.push({
        pathname: "/experiment",
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
        pathname: "/experiment",
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
        pathname: "/experiment",
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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>
          What moment is hardest right now?
        </Text>

        {options.map((option) => {
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
                borderColor: isSelected ? "#333" : "#ccc",
                borderRadius: 8,
                padding: 14,
                marginBottom: 12,
                backgroundColor: isSelected ? "#f2f2f2" : "#fff",
              }}
            >
              <Text>{option}</Text>
            </Pressable>
          );
        })}

        <Text style={{ fontSize: 16, marginTop: 8, marginBottom: 8 }}>
          Or type your own
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
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 12,
            minHeight: 100,
            textAlignVertical: "top",
            marginBottom: 24,
          }}
        />

        <Button
          title={isLoadingAi ? "Making sense of your moment..." : "Continue"}
          onPress={handleContinue}
          disabled={!canContinue}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
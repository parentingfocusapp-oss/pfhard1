import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { DurationOption } from "../types/session";

const MAX_IDEAS = 3;

export default function OptionsScreen() {
  const { topic, moment, balance, warmth, structure, duration } =
    useLocalSearchParams<{
      topic?: string;
      moment?: string;
      balance?: string;
      warmth?: string;
      structure?: string;
      duration?: DurationOption;
    }>();

  const [currentIdea, setCurrentIdea] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);

  function addIdea() {
    const trimmed = currentIdea.trim();
    if (!trimmed) return;
    if (ideas.length >= MAX_IDEAS) return;

    setIdeas((prev) => [...prev, trimmed]);
    setCurrentIdea("");
  }

  function removeIdea(index: number) {
    setIdeas((prev) => prev.filter((_, i) => i !== index));
  }

  function continueWithIdeas() {
    const trimmed = currentIdea.trim();

    let finalIdeas = ideas;
    if (trimmed && ideas.length < MAX_IDEAS) {
      finalIdeas = [...ideas, trimmed];
    }

    if (finalIdeas.length === 0) return;

    router.push({
      pathname: "/choose-parent-option",
      params: {
        topic: topic || "",
        moment: moment || "",
        balance: balance || "",
        warmth: warmth || "",
        structure: structure || "",
        duration: duration || "10",
        parentOptions: JSON.stringify(finalIdeas.slice(0, MAX_IDEAS)),
      },
    });
  }

  function skipForNow() {
    router.push({
      pathname: "/experiment",
      params: {
        topic: topic || "",
        moment: moment || "",
        balance: balance || "",
        warmth: warmth || "",
        structure: structure || "",
        duration: duration || "10",
        parentOptions: JSON.stringify([]),
      },
    });
  }

  const canAddMore = ideas.length < MAX_IDEAS;

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
          Your ideas
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 16 }}>
          What have you already thought of trying? Add up to three ideas, even if
          they feel rough or unfinished.
        </Text>

        {ideas.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
              Your ideas so far
            </Text>

            {ideas.map((idea, index) => (
              <View
                key={`${idea}-${index}`}
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
                <Text style={{ marginBottom: 8 }}>{idea}</Text>

                <Pressable onPress={() => removeIdea(index)}>
                  <Text style={{ color: "red" }}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {canAddMore ? (
          <>
            <TextInput
              value={currentIdea}
              onChangeText={setCurrentIdea}
              placeholder="Type one idea here"
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 12,
                minHeight: 90,
                textAlignVertical: "top",
                marginBottom: 12,
              }}
            />

            <Button title="Add idea" onPress={addIdea} />
          </>
        ) : (
          <Text style={{ marginBottom: 16, color: "#555" }}>
            You’ve added three ideas. You can continue, or remove one if you want
            to change it.
          </Text>
        )}

        <View style={{ height: 24 }} />

        <Button title="Continue with my ideas" onPress={continueWithIdeas} />

        <View style={{ height: 12 }} />

        <Button title="Skip for now" onPress={skipForNow} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
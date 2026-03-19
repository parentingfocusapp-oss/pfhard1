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
import { WarmTheme } from "../constants/warmTheme";

const presetTopics = [
  "Morning routine",
  "Screen time",
  "Bedtime",
  "Homework",
];

export default function TopicScreen() {
  const {
    duration,
    routeType,
    balance,
    warmth,
    structure,
    quadrant,
    suggestedDirection,
  } = useLocalSearchParams<{
    duration?: string;
    routeType?: string;
    balance?: string;
    warmth?: string;
    structure?: string;
    quadrant?: string;
    suggestedDirection?: string;
  }>();
  const [customTopic, setCustomTopic] = useState("");

  function goToMoment(topic: string) {
    router.push({
      pathname: "/moment",
      params: {
        topic,
        duration: duration || "",
        routeType: routeType || "",
        balance: balance || "",
        warmth: warmth || "",
        structure: structure || "",
        quadrant: quadrant || "",
        suggestedDirection: suggestedDirection || "",
      },
    });
  }

  const trimmedTopic = customTopic.trim();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: WarmTheme.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 40,
          paddingBottom: 140,
          backgroundColor: WarmTheme.bg,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            marginBottom: 12,
            color: WarmTheme.text,
          }}
        >
          Tell me which problem you have chosen
        </Text>

        <Text style={{ marginBottom: 20, color: WarmTheme.mutedText }}>
          {routeType === "deepdive"
            ? "Good — now choose where this shows up most."
            : "Pick the closest fit, or describe another problem if the main issue is somewhere else."}
        </Text>

        {presetTopics.map((topic) => (
          <View key={topic} style={{ marginBottom: 12 }}>
            <Button title={topic} onPress={() => goToMoment(topic)} />
          </View>
        ))}

        <View
          style={{
            marginTop: 16,
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 12,
            padding: 16,
            backgroundColor: WarmTheme.surface,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
              color: WarmTheme.text,
            }}
          >
            Describe another problem
          </Text>

          <TextInput
            value={customTopic}
            onChangeText={setCustomTopic}
            placeholder="For example: sibling conflict, shouting in the car, transitions after school, conflict around meals"
            multiline
            scrollEnabled
            style={{
              borderWidth: 1,
              borderColor: WarmTheme.border,
              borderRadius: 8,
              padding: 12,
              minHeight: 110,
              textAlignVertical: "top",
              backgroundColor: WarmTheme.bg,
              color: WarmTheme.text,
              marginBottom: 12,
            }}
            placeholderTextColor={WarmTheme.mutedText}
          />
        </View>

        <View style={{ marginTop: 20, marginBottom: 16 }}>
          <Button title="Back" onPress={() => router.back()} />
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? 24 : 16,
          borderTopWidth: 1,
          borderTopColor: WarmTheme.border,
          backgroundColor: WarmTheme.bg,
        }}
      >
        <Pressable
          onPress={() => {
            if (trimmedTopic) {
              goToMoment(trimmedTopic);
            }
          }}
          disabled={!trimmedTopic}
          style={{
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: "center",
            backgroundColor: trimmedTopic ? WarmTheme.accent : WarmTheme.border,
          }}
        >
          <Text
            style={{
              color: trimmedTopic ? "#fff" : WarmTheme.mutedText,
              fontWeight: "600",
            }}
          >
            Continue with this problem
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { AgeBand } from "../types/experiment";

const triedOptions = [
  "Repeating reminders",
  "Explaining",
  "Consequences",
  "Staying calm",
  "Nothing yet",
] as const;

const hopeOptions = [
  "Listen first time",
  "Less arguing",
  "Stay calm",
  "More independence",
] as const;

function toggleChip(current: string[], value: string, isExclusive = false) {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }

  if (isExclusive) {
    return [value];
  }

  return [...current.filter((item) => item !== "Nothing yet"), value];
}

export default function ProcessScreen() {
  const params = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    rawMoment?: string;
    momentSource?: "typed" | "preset";
    matchedMoment?: string;
    momentSummary?: string;
    momentThemes?: string;
    balance?: string;
    warmth?: string;
    structure?: string;
    reality?: string;
    duration?: string;
    ageBand?: AgeBand;
  }>();

  const [selectedTried, setSelectedTried] = useState<string[]>([]);
  const [selectedHopes, setSelectedHopes] = useState<string[]>([]);

  const canContinue = selectedTried.length > 0 || selectedHopes.length > 0;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: WarmTheme.bg,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          marginBottom: 10,
          color: WarmTheme.text,
        }}
      >
        A little more context
      </Text>

      <Text style={{ marginBottom: 22, color: WarmTheme.mutedText }}>
        Just enough to make the suggestion feel more relevant.
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: WarmTheme.border,
          borderRadius: 16,
          padding: 16,
          marginBottom: 18,
          backgroundColor: WarmTheme.surface,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            marginBottom: 12,
            color: WarmTheme.text,
          }}
        >
          What have you already tried?
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {triedOptions.map((option) => {
            const isSelected = selectedTried.includes(option);

            return (
              <Pressable
                key={option}
                onPress={() =>
                  setSelectedTried((current) =>
                    option === "Nothing yet"
                      ? toggleChip(current, option, true)
                      : toggleChip(current, option)
                  )
                }
                style={{
                  borderWidth: 1,
                  borderColor: isSelected ? WarmTheme.accent : WarmTheme.border,
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  backgroundColor: isSelected ? WarmTheme.surfaceAlt : WarmTheme.bg,
                }}
              >
                <Text
                  style={{
                    color: isSelected ? WarmTheme.accent : WarmTheme.text,
                    fontWeight: "600",
                  }}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: WarmTheme.border,
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          backgroundColor: WarmTheme.surface,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            marginBottom: 12,
            color: WarmTheme.text,
          }}
        >
          What are you hoping for?
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {hopeOptions.map((option) => {
            const isSelected = selectedHopes.includes(option);

            return (
              <Pressable
                key={option}
                onPress={() =>
                  setSelectedHopes((current) =>
                    current.includes(option)
                      ? current.filter((item) => item !== option)
                      : [...current, option]
                  )
                }
                style={{
                  borderWidth: 1,
                  borderColor: isSelected ? WarmTheme.accent : WarmTheme.border,
                  borderRadius: 999,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  backgroundColor: isSelected ? WarmTheme.surfaceAlt : WarmTheme.bg,
                }}
              >
                <Text
                  style={{
                    color: isSelected ? WarmTheme.accent : WarmTheme.text,
                    fontWeight: "600",
                  }}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/experiment",
            params: {
              topic: params.topic || "",
              moment: params.moment || "",
              rawMoment: params.rawMoment || "",
              momentSource: params.momentSource || "preset",
              matchedMoment: params.matchedMoment || "",
              momentSummary: params.momentSummary || "",
              momentThemes: params.momentThemes || "",
              balance: params.balance || "",
              warmth: params.warmth || "",
              structure: params.structure || "",
              reality: params.reality || "",
              duration: params.duration || "",
              ageBand: params.ageBand || "",
              tried: JSON.stringify(selectedTried),
              goal: JSON.stringify(selectedHopes),
            },
          })
        }
        disabled={!canContinue}
        style={{
          borderRadius: 10,
          paddingVertical: 14,
          paddingHorizontal: 18,
          alignItems: "center",
          backgroundColor: canContinue ? WarmTheme.accent : WarmTheme.border,
        }}
      >
        <Text
          style={{
            color: canContinue ? "#fff" : WarmTheme.mutedText,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Choose my experiment
        </Text>
      </Pressable>

      <View style={{ height: 12 }} />

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/experiment",
            params: {
              topic: params.topic || "",
              moment: params.moment || "",
              rawMoment: params.rawMoment || "",
              momentSource: params.momentSource || "preset",
              matchedMoment: params.matchedMoment || "",
              momentSummary: params.momentSummary || "",
              momentThemes: params.momentThemes || "",
              balance: params.balance || "",
              warmth: params.warmth || "",
              structure: params.structure || "",
              reality: params.reality || "",
              duration: params.duration || "",
              ageBand: params.ageBand || "",
              tried: JSON.stringify([]),
              goal: JSON.stringify([]),
            },
          })
        }
        style={{
          borderRadius: 10,
          paddingVertical: 14,
          alignItems: "center",
          borderWidth: 1,
          borderColor: WarmTheme.border,
          backgroundColor: WarmTheme.surface,
        }}
      >
        <Text style={{ color: WarmTheme.text, fontWeight: "600" }}>Skip for now</Text>
      </Pressable>
    </ScrollView>
  );
}

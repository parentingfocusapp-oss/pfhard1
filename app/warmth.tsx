import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { warmthScenarios } from "../lib/deepdive";
import { DurationOption } from "../types/session";

export default function WarmthScreen() {
  const { duration } = useLocalSearchParams<{ duration?: DurationOption }>();
  const [selected, setSelected] = useState<Record<string, string>>({});

  const allSelected = warmthScenarios.every((scenario) => selected[scenario.id]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        paddingBottom: 40,
        backgroundColor: WarmTheme.bg,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 12, color: WarmTheme.text }}>
        Warmth in hard moments
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 24, color: WarmTheme.mutedText }}>
        Pick the response that feels most like you on an ordinary hard day.
      </Text>

      {warmthScenarios.map((scenario, index) => (
        <View
          key={scenario.id}
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 14,
            padding: 16,
            marginBottom: 18,
            backgroundColor: WarmTheme.surface,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "700", marginBottom: 8, color: WarmTheme.accent }}>
            Scenario {index + 1}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 14, color: WarmTheme.text }}>
            {scenario.prompt}
          </Text>

          {scenario.options.map((option) => {
            const isSelected = selected[scenario.id] === option.id;

            return (
              <Pressable
                key={option.id}
                onPress={() =>
                  setSelected((current) => ({
                    ...current,
                    [scenario.id]: option.id,
                  }))
                }
                style={{
                  borderWidth: 1,
                  borderColor: isSelected ? WarmTheme.accent : WarmTheme.border,
                  borderRadius: 10,
                  padding: 14,
                  marginBottom: 10,
                  backgroundColor: isSelected
                    ? WarmTheme.surfaceAlt
                    : WarmTheme.bg,
                }}
              >
                <Text style={{ fontWeight: "700", marginBottom: 6, color: WarmTheme.text }}>
                  {option.label}
                </Text>
                <Text style={{ color: WarmTheme.text }}>{option.text}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      <Pressable
        onPress={() => {
          if (!allSelected) return;

          router.push({
            pathname: "/structure",
            params: {
              duration: duration || "10",
              warmthSelections: JSON.stringify(Object.values(selected)),
            },
          });
        }}
        disabled={!allSelected}
        style={{
          borderRadius: 10,
          paddingVertical: 14,
          alignItems: "center",
          backgroundColor: allSelected ? WarmTheme.accent : WarmTheme.border,
        }}
      >
        <Text
          style={{
            color: allSelected ? "#fff" : WarmTheme.mutedText,
            fontWeight: "600",
          }}
        >
          Continue
        </Text>
      </Pressable>
    </ScrollView>
  );
}

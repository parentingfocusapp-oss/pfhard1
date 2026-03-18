import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";

const EXPLANATION_TEXT =
  "Focusing on one problem at a time helps us feel more in charge, and children often respond better to that steadiness. Parent Focus is now thinking about one suggested experiment that might help you with the problem you have chosen to look at.";

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
  }>();

  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    if (visibleLength >= EXPLANATION_TEXT.length) return;

    const timer = setTimeout(() => {
      setVisibleLength((current) => current + 1);
    }, 28);

    return () => clearTimeout(timer);
  }, [visibleLength]);

  const typedText = useMemo(
    () => EXPLANATION_TEXT.slice(0, visibleLength),
    [visibleLength]
  );

  const isComplete = visibleLength >= EXPLANATION_TEXT.length;

  return (
    <Pressable
      onPress={() => {
        if (!isComplete) {
          setVisibleLength(EXPLANATION_TEXT.length);
        }
      }}
      style={{ flex: 1, backgroundColor: WarmTheme.bg }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
          backgroundColor: WarmTheme.bg,
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 16,
            padding: 20,
            backgroundColor: WarmTheme.surface,
            marginBottom: 20,
            minHeight: 220,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              lineHeight: 30,
              color: WarmTheme.text,
            }}
          >
            {typedText}
          </Text>
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
              },
            })
          }
          disabled={!isComplete}
          style={{
            borderRadius: 10,
            paddingVertical: 14,
            paddingHorizontal: 18,
            alignItems: "center",
            backgroundColor: isComplete ? WarmTheme.accent : WarmTheme.border,
          }}
        >
          <Text
            style={{
              color: isComplete ? "#fff" : WarmTheme.mutedText,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Choose my experiment
          </Text>
        </Pressable>
      </ScrollView>
    </Pressable>
  );
}

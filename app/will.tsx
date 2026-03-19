import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Button, Pressable, ScrollView, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";

const supportOptions = [
  "Tell my partner",
  "Mention it to my child",
  "Practise it once in my head",
  "Put a note somewhere visible",
  "Choose a few words to come back to",
];

const mantraOptions = [
  "Calm and clear",
  "Connection first, then direction",
  "Small step, steady tone",
  "Less talk, more calm follow-through",
];

export default function WillScreen() {
  const {
    topic,
    moment,
    balance,
    warmth,
    structure,
    reality,
    experimentId,
    experimentTitle,
    experimentAction,
    experimentWhy,
    index,
    duration,
  } = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    balance?: string;
    warmth?: string;
    structure?: string;
    reality?: string;
    experimentId?: string;
    experimentTitle?: string;
    experimentAction?: string;
    experimentWhy?: string;
    index?: string;
    duration?: string;
  }>();

  const isQuickRoute = duration === "2";
  const [selectedSupports, setSelectedSupports] = useState<string[]>([]);
  const [selectedMantra, setSelectedMantra] = useState<string>("");

  const maxSupports = isQuickRoute ? 1 : 2;

  const intro = isQuickRoute
    ? "Pick one small thing that will help you remember this in the moment."
    : "Pick one or two small supports that will help you remember and commit to this experiment.";

  const heading = isQuickRoute
    ? "One small way to remember"
    : "Make it easier to follow through";

  const canContinue = selectedSupports.length > 0 || !!selectedMantra || isQuickRoute;

  function toggleSupport(option: string) {
    const alreadySelected = selectedSupports.includes(option);

    if (alreadySelected) {
      setSelectedSupports(selectedSupports.filter((item) => item !== option));
      return;
    }

    if (selectedSupports.length < maxSupports) {
      setSelectedSupports([...selectedSupports, option]);
      return;
    }

    if (isQuickRoute) {
      setSelectedSupports([option]);
    }
  }

  const visibleMantraOptions = useMemo(
    () => (isQuickRoute ? mantraOptions.slice(0, 2) : mantraOptions),
    [isQuickRoute]
  );

  function continueToReminder() {
    router.push({
      pathname: "/reminder",
      params: {
        topic: topic || "",
        moment: moment || "",
        balance: balance || "",
        warmth: warmth || "",
        structure: structure || "",
        reality: reality || "",
        experimentId: experimentId || "",
        experimentTitle: experimentTitle || "",
        experimentAction: experimentAction || "",
        experimentWhy: experimentWhy || "",
        index: index || "",
        supports: selectedSupports.join(" • "),
        mantra: selectedMantra,
        duration: duration || "",
      },
    });
  }

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
          marginBottom: 16,
          color: WarmTheme.text,
        }}
      >
        {heading}
      </Text>

      <Text style={{ marginBottom: 24, color: WarmTheme.mutedText }}>{intro}</Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 12,
          color: WarmTheme.text,
        }}
      >
        What would help?
      </Text>

      {supportOptions.map((option) => {
        const selected = selectedSupports.includes(option);

        return (
          <Pressable
            key={option}
            onPress={() => toggleSupport(option)}
            style={{
              borderWidth: 1,
              borderColor: selected ? WarmTheme.accent : WarmTheme.border,
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
              backgroundColor: selected ? WarmTheme.surfaceAlt : WarmTheme.surface,
            }}
          >
            <Text style={{ color: WarmTheme.text }}>{option}</Text>
          </Pressable>
        );
      })}

      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginTop: 12,
          marginBottom: 12,
          color: WarmTheme.text,
        }}
      >
        Optional words to come back to
      </Text>

      {visibleMantraOptions.map((option) => {
        const selected = selectedMantra === option;

        return (
          <Pressable
            key={option}
            onPress={() => setSelectedMantra(option)}
            style={{
              borderWidth: 1,
              borderColor: selected ? WarmTheme.accent : WarmTheme.border,
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
              backgroundColor: selected ? WarmTheme.surfaceAlt : WarmTheme.surface,
            }}
          >
            <Text style={{ color: WarmTheme.text }}>{option}</Text>
          </Pressable>
        );
      })}

      <View style={{ height: 16 }} />

      <Button title="Continue" onPress={continueToReminder} disabled={!canContinue} />
      <View style={{ height: 12 }} />
      <Button title="Back" onPress={() => router.back()} />
    </ScrollView>
  );
}

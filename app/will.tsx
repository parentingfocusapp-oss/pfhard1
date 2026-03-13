import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, Pressable, Text, View } from "react-native";

const supportOptions = [
  "Tell my partner",
  "Mention it to my child",
  "Practise it once in my head",
  "Put a note somewhere visible",
  "Use a short reminder phrase",
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
    experimentTitle?: string;
    experimentAction?: string;
    experimentWhy?: string;
    index?: string;
    duration?: string;
  }>();

  const [selectedSupports, setSelectedSupports] = useState<string[]>([]);
  const [selectedMantra, setSelectedMantra] = useState<string>("");

  function toggleSupport(option: string) {
    const alreadySelected = selectedSupports.includes(option);

    if (alreadySelected) {
      setSelectedSupports(selectedSupports.filter((item) => item !== option));
      return;
    }

    if (selectedSupports.length < 2) {
      setSelectedSupports([...selectedSupports, option]);
    }
  }

  function continueToReminder() {
    router.push({
      pathname: "/reminder",
      params: {
        topic: topic || "",
        moment: moment || "",
        balance: balance || "",
        warmth: warmth || "",
        structure: structure || "",
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
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
        Make it easier to follow through
      </Text>

      <Text style={{ marginBottom: 24 }}>
        Pick one or two small supports that will help you remember and commit to
        this experiment.
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
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
              borderColor: selected ? "#444" : "#999",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
              backgroundColor: selected ? "#eee" : "#fff",
            }}
          >
            <Text>{option}</Text>
          </Pressable>
        );
      })}

      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        Pick a reminder phrase
      </Text>

      {mantraOptions.map((option) => {
        const selected = selectedMantra === option;

        return (
          <Pressable
            key={option}
            onPress={() => setSelectedMantra(option)}
            style={{
              borderWidth: 1,
              borderColor: selected ? "#444" : "#999",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
              backgroundColor: selected ? "#eee" : "#fff",
            }}
          >
            <Text>{option}</Text>
          </Pressable>
        );
      })}

      <View style={{ height: 16 }} />

      <Button title="Continue" onPress={continueToReminder} />
      <View style={{ height: 12 }} />

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}
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

export default function MomentScreen() {
  const { topic, duration } = useLocalSearchParams<{
    topic?: string;
    duration?: string;
  }>();

  const [selectedMoment, setSelectedMoment] = useState("");
  const [momentText, setMomentText] = useState("");

  const options = momentOptions[topic || ""] || [];
  const chosenMoment = selectedMoment || momentText.trim();
  const canContinue = chosenMoment.length > 0;

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
          title="Continue"
          onPress={() =>
            router.push({
              pathname: "/experiment",
              params: {
                topic: topic || "",
                moment: chosenMoment,
                momentSource: selectedMoment ? "preset" : "typed",
                duration: duration || "10",
              },
            })
          }
          disabled={!canContinue}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
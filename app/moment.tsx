import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, Pressable, Text, TextInput, View } from "react-native";
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
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 12 }}>
        What is the one moment that tends to go wrong?
      </Text>

      <Text style={{ marginBottom: 16 }}>Topic: {topic}</Text>

      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => {
            setSelectedMoment(option);
            setMomentText("");
          }}
          style={{
            borderWidth: 2,
            borderColor: selectedMoment === option ? "#000" : "#999",
            backgroundColor: selectedMoment === option ? "#eaeaea" : "transparent",
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text>{option}</Text>
        </Pressable>
      ))}

      <Text style={{ marginTop: 10, marginBottom: 8 }}>
        Or type your own:
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#999",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
        placeholder="Type one or two lines..."
        value={momentText}
        onChangeText={(text) => {
          setSelectedMoment("");
          setMomentText(text);
        }}
      />

      {canContinue ? (
        <Button
          title="Continue"
          onPress={() =>
            router.push({
              pathname: "/experiment",
              params: {
                topic: topic || "",
                moment: chosenMoment,
                momentSource: momentText.trim() ? "typed" : "preset",
                duration: duration || "",
              },
            })
          }
        />
      ) : (
        <Text style={{ marginBottom: 12, color: "red" }}>
          Please select an option or type your own.
        </Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    </View>
  );
}
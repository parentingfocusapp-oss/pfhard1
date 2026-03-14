import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Button, Text, View } from "react-native";

export default function ChooseParentOptionScreen() {
  const params = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    duration?: string;
    balance?: string;
    warmth?: string;
    structure?: string;
    parentOptions?: string;
    suggestedOptions?: string;
  }>();

  const {
    topic,
    moment,
    duration,
    balance,
    warmth,
    structure,
    parentOptions,
    suggestedOptions,
  } = params;

  const options = useMemo(() => {
    if (!parentOptions) return [];

    try {
      const parsed = JSON.parse(parentOptions);
      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }, [parentOptions]);

  const suggested = useMemo(() => {
    if (!suggestedOptions) return [];

    try {
      const parsed = JSON.parse(suggestedOptions);
      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }, [suggestedOptions]);

  function continueWithIdeas() {
    router.push({
      pathname: "/experiment",
      params: {
        topic: topic || "",
        moment: moment || "",
        duration: duration || "",
        balance: balance || "",
        warmth: warmth || "",
        structure: structure || "",
        parentOptions: JSON.stringify(options),
      },
    });
  }

  function skipToLibraryOnly() {
    router.push({
      pathname: "/experiment",
      params: {
        topic: topic || "",
        moment: moment || "",
        duration: duration || "",
        balance: balance || "",
        warmth: warmth || "",
        structure: structure || "",
        parentOptions: JSON.stringify([]),
      },
    });
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>
        Your ideas so far
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 16 }}>
        Here are the ideas you came up with. The highlighted ones may be a
        helpful place to start.
      </Text>

      <View style={{ gap: 12 }}>
        {options.map((option, index) => {
          const isSuggested = suggested.includes(option);

          return (
            <View
              key={`${option}-${index}`}
              style={{
                borderWidth: 1,
                borderColor: isSuggested ? "#333" : "#ccc",
                borderRadius: 10,
                padding: 14,
                marginBottom: 12,
                backgroundColor: isSuggested ? "#f2f2f2" : "#fff",
              }}
            >
              <Text style={{ fontSize: 16 }}>{option}</Text>

              {isSuggested && (
                <Text style={{ fontSize: 12, marginTop: 6, color: "#555" }}>
                  Suggested starting point
                </Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={{ marginTop: "auto", gap: 12 }}>
        <Button
          title="Continue to choose experiment"
          onPress={continueWithIdeas}
        />

        <Button
          title="Skip my ideas and show only the suggestion"
          onPress={skipToLibraryOnly}
        />
      </View>
    </View>
  );
}
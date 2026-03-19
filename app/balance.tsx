import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { generateBlendedOptions } from "../lib/deepdive";
import { ParentingProfile } from "../types/deepdive";
import { DurationOption } from "../types/session";

const MAX_IDEAS = 3;
const TARGET_IDEAS = 2;

export default function BalanceScreen() {
  const {
    topic,
    moment,
    rawMoment,
    momentSource,
    balance,
    warmth,
    structure,
    quadrant,
    suggestedDirection,
    duration,
  } = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    rawMoment?: string;
    momentSource?: string;
    balance?: string;
    warmth?: ParentingProfile["warmthLevel"];
    structure?: ParentingProfile["structureLevel"];
    quadrant?: string;
    suggestedDirection?: string;
    duration?: DurationOption;
  }>();

  const [currentIdea, setCurrentIdea] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const profile: ParentingProfile = {
    warmthLevel: warmth || "medium",
    structureLevel: structure || "medium",
    quadrant: quadrant || "relatively balanced",
    suggestedDirection:
      suggestedDirection ||
      "A small shift in one repeated moment could help here.",
  };

  function addIdea() {
    const trimmed = currentIdea.trim();
    if (!trimmed || ideas.length >= MAX_IDEAS) return;

    setIdeas((current) => [...current, trimmed]);
    setCurrentIdea("");
  }

  function removeIdea(index: number) {
    setIdeas((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  async function continueToOptions(useIdeas: string[]) {
    try {
      setIsLoading(true);

      const generated = await generateBlendedOptions({
        topic,
        moment,
        goal: balance,
        profile,
        parentOptions: useIdeas,
      });

      router.push({
        pathname: "/choose-parent-option",
        params: {
          topic: topic || "",
          moment: moment || "",
          rawMoment: rawMoment || "",
          momentSource: momentSource || "",
          balance: balance || "",
          warmth: profile.warmthLevel,
          structure: profile.structureLevel,
          quadrant: profile.quadrant,
          suggestedDirection: profile.suggestedDirection,
          duration: duration || "10",
          parentOptions: JSON.stringify(useIdeas),
          generatedOptions: JSON.stringify(
            generated.map(({ experimentCard, ...option }) => option)
          ),
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  const canAddMore = ideas.length < MAX_IDEAS;
  const trimmedIdea = currentIdea.trim();
  const currentTotal = ideas.length + (trimmedIdea ? 1 : 0);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: WarmTheme.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 12, color: WarmTheme.text }}>
          What ideas have you already had?
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 20, color: WarmTheme.mutedText }}>
          They don&apos;t need to be perfect. Two or three is enough.
        </Text>

        {ideas.length > 0 ? (
          <View style={{ marginBottom: 18 }}>
            {ideas.map((idea, index) => (
              <View
                key={`${idea}-${index}`}
                style={{
                  borderWidth: 1,
                  borderColor: WarmTheme.border,
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  backgroundColor: WarmTheme.surface,
                }}
              >
                <Text style={{ marginBottom: 8, color: WarmTheme.text }}>{idea}</Text>
                <Pressable onPress={() => removeIdea(index)}>
                  <Text style={{ color: WarmTheme.danger }}>Remove</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

        {canAddMore ? (
          <>
            <TextInput
              value={currentIdea}
              onChangeText={setCurrentIdea}
              placeholder="For example: keep my words shorter, give a warning earlier, stay calmer at the start"
              multiline
              style={{
                borderWidth: 1,
                borderColor: WarmTheme.border,
                borderRadius: 10,
                padding: 12,
                minHeight: 110,
                textAlignVertical: "top",
                marginBottom: 12,
                backgroundColor: WarmTheme.surface,
                color: WarmTheme.text,
              }}
              placeholderTextColor={WarmTheme.mutedText}
            />

            <Pressable
              onPress={addIdea}
              style={{
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: "center",
                marginBottom: 20,
                backgroundColor: WarmTheme.surfaceAlt,
              }}
            >
              <Text style={{ color: WarmTheme.text, fontWeight: "600" }}>Add idea</Text>
            </Pressable>
          </>
        ) : (
          <Text style={{ marginBottom: 20, color: WarmTheme.mutedText }}>
            You have enough ideas here to make a useful set of options.
          </Text>
        )}

        {currentTotal > 0 && currentTotal < TARGET_IDEAS ? (
          <Text style={{ marginBottom: 20, color: WarmTheme.mutedText }}>
            One more would be ideal, but you can continue now if you want.
          </Text>
        ) : null}

        <Pressable
          onPress={() =>
            continueToOptions(
              trimmedIdea && ideas.length < MAX_IDEAS ? [...ideas, trimmedIdea] : ideas
            )
          }
          disabled={isLoading || currentTotal === 0}
          style={{
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: "center",
            marginBottom: 12,
            backgroundColor:
              isLoading || currentTotal === 0 ? WarmTheme.border : WarmTheme.accent,
          }}
        >
          <Text
            style={{
              color: isLoading || currentTotal === 0 ? WarmTheme.mutedText : "#fff",
              fontWeight: "600",
            }}
          >
            {isLoading ? "Building your options..." : "Continue"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => continueToOptions([])}
          disabled={isLoading}
          style={{
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: "center",
            backgroundColor: WarmTheme.surface,
            borderWidth: 1,
            borderColor: WarmTheme.border,
          }}
        >
          <Text style={{ color: WarmTheme.text, fontWeight: "600" }}>
            Skip if nothing comes to mind
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

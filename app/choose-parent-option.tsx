import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { generateBlendedOptions, reviveGeneratedOptions } from "../lib/deepdive";
import { GeneratedOptionWithCard, ParentingProfile } from "../types/deepdive";

function readString(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseStringArray(value: string | string[] | undefined) {
  const raw = readString(value);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export default function ChooseParentOptionScreen() {
  const params = useLocalSearchParams<{
    topic?: string | string[];
    moment?: string | string[];
    rawMoment?: string | string[];
    momentSource?: string | string[];
    duration?: string | string[];
    balance?: string | string[];
    warmth?: ParentingProfile["warmthLevel"] | ParentingProfile["warmthLevel"][];
    structure?: ParentingProfile["structureLevel"] | ParentingProfile["structureLevel"][];
    quadrant?: string | string[];
    suggestedDirection?: string | string[];
    parentOptions?: string | string[];
    generatedOptions?: string | string[];
  }>();

  const topic = readString(params.topic);
  const moment = readString(params.moment);
  const rawMoment = readString(params.rawMoment);
  const momentSource = readString(params.momentSource);
  const duration = readString(params.duration);
  const balance = readString(params.balance);
  const quadrant = readString(params.quadrant);
  const suggestedDirection = readString(params.suggestedDirection);
  const warmth = readString(params.warmth) as ParentingProfile["warmthLevel"] | undefined;
  const structure = readString(
    params.structure
  ) as ParentingProfile["structureLevel"] | undefined;

  const profile = useMemo<ParentingProfile>(
    () => ({
      warmthLevel: warmth || "medium",
      structureLevel: structure || "medium",
      quadrant: quadrant || "relatively balanced",
      suggestedDirection:
        suggestedDirection ||
        "A small shift in one repeated moment could help here.",
    }),
    [quadrant, structure, suggestedDirection, warmth]
  );

  const initialOptions = useMemo(
    () => reviveGeneratedOptions(readString(params.generatedOptions)),
    [params.generatedOptions]
  );
  const parentOptions = useMemo(
    () => parseStringArray(params.parentOptions),
    [params.parentOptions]
  );

  const [options, setOptions] = useState<GeneratedOptionWithCard[]>(initialOptions);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  useEffect(() => {
    if (initialOptions.length > 0) {
      return;
    }

    void (async () => {
      setIsRecovering(true);

      try {
        const regenerated = await generateBlendedOptions({
          topic,
          moment,
          goal: balance,
          profile,
          parentOptions,
        });

        setOptions(regenerated);
      } finally {
        setIsRecovering(false);
      }
    })();
  }, [balance, initialOptions, moment, parentOptions, profile, topic]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: WarmTheme.bg }}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 24,
        paddingBottom: 40,
        backgroundColor: WarmTheme.bg,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 12, color: WarmTheme.text }}>
        Options shaped around your ideas
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 22, color: WarmTheme.mutedText }}>
        Each option starts from what you said, then links to one structured experiment from the library.
      </Text>

      {options.map((option) => (
        <Pressable
          key={option.id}
          onPress={() =>
            router.push({
              pathname: "/experiment",
              params: {
                topic: topic || "",
                moment: moment || "",
                rawMoment: rawMoment || "",
                momentSource: momentSource || "",
                duration: duration || "10",
                balance: balance || "",
                warmth: profile.warmthLevel,
                structure: profile.structureLevel,
                quadrant: profile.quadrant,
                suggestedDirection: profile.suggestedDirection,
                experimentId: option.experimentId,
              },
            })
          }
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            backgroundColor: WarmTheme.surface,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "700", marginBottom: 8, color: WarmTheme.accent }}>
            Based on your idea to {option.parentText.toLowerCase()}
          </Text>

          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10, color: WarmTheme.text }}>
            {option.title}
          </Text>

          <Text style={{ marginBottom: 12, color: WarmTheme.text }}>
            {option.whatToDo}
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: WarmTheme.border,
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
              backgroundColor: WarmTheme.bg,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", marginBottom: 6, color: WarmTheme.mutedText }}>
              Example
            </Text>
            <Text style={{ color: WarmTheme.text }}>{option.example}</Text>
          </View>

          <Text style={{ marginBottom: 10, color: WarmTheme.mutedText }}>
            Why this might help: {option.whyItWorks}
          </Text>

          <Text style={{ color: WarmTheme.mutedText }}>
            Interpreted as: {option.interpretedAs}
          </Text>
        </Pressable>
      ))}

      {options.length === 0 ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            backgroundColor: WarmTheme.surface,
          }}
        >
          <Text style={{ marginBottom: 10, color: WarmTheme.text }}>
            {isRecovering
              ? "Rebuilding your options..."
              : "We could not load the blended options for this moment."}
          </Text>

          {!isRecovering ? (
            <Text style={{ color: WarmTheme.mutedText }}>
              Go back once and continue again. Your ideas will be used to rebuild the options.
            </Text>
          ) : null}
        </View>
      ) : null}

      <Pressable
        onPress={() => router.back()}
        style={{
          borderRadius: 10,
          paddingVertical: 14,
          alignItems: "center",
          backgroundColor: WarmTheme.surfaceAlt,
        }}
      >
        <Text style={{ color: WarmTheme.text, fontWeight: "600" }}>
          Back
        </Text>
      </Pressable>
    </ScrollView>
  );
}

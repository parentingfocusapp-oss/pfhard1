import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import { BackHandler, Button, Platform, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { createSession } from "../lib/session";
import { sessionRepository } from "../lib/storage";
import { DurationOption } from "../types/session";

export default function ClosingScreen() {
  const {
    topic,
    moment,
    balance,
    warmth,
    structure,
    reality,
    profileQuadrant,
    suggestedDirection,
    experimentId,
    experimentTitle,
    experimentAction,
    experimentWhy,
    experimentSourceName,
    experimentSourceUrl,
    experimentSourceCitation,
    reminder,
    supports,
    mantra,
    duration,
  } = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    balance?: string;
    warmth?: string;
    structure?: string;
    reality?: string;
    profileQuadrant?: string;
    suggestedDirection?: string;
    experimentId?: string;
    experimentTitle?: string;
    experimentAction?: string;
    experimentWhy?: string;
    experimentSourceName?: string;
    experimentSourceUrl?: string;
    experimentSourceCitation?: string;
    reminder?: string;
    supports?: string;
    mantra?: string;
    duration?: DurationOption;
  }>();

  const hasSaved = useRef(false);

  const session = createSession({
    topic,
    moment,
    balance,
    warmth,
    structure,
    reality,
    profileQuadrant,
    suggestedDirection,
    experimentId,
    experimentTitle,
    experimentAction,
    experimentWhy,
    experimentSourceName,
    experimentSourceUrl,
    experimentSourceCitation,
    reminder,
    supports,
    mantra,
    duration,
  });

  useEffect(() => {
    if (hasSaved.current) return;
    if (!experimentTitle || !experimentAction) return;

    hasSaved.current = true;
    void sessionRepository.saveSession(session);
  }, [experimentAction, experimentTitle, session]);

  const outline = useMemo(() => {
    if (moment) return moment;
    if (reality) return reality;
    if (topic) return topic;
    if (balance) return balance;
    return "the problem you chose to focus on";
  }, [balance, moment, reality, topic]);

  function finishForToday() {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
      return;
    }

    router.replace("/");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: WarmTheme.bg }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16, color: WarmTheme.text }}>
        You are set
      </Text>

      <Text style={{ marginBottom: 24, color: WarmTheme.mutedText }}>
        Well done for taking time to work on your family.
      </Text>

      <Text style={{ marginBottom: 20, color: WarmTheme.mutedText }}>
        You chose one small experiment for {outline}. That is enough for today.
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: WarmTheme.border,
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
          backgroundColor: WarmTheme.surface,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: WarmTheme.text }}>
          {experimentTitle || "Your experiment"}
        </Text>

        <Text style={{ marginBottom: 12, color: WarmTheme.text }}>
          {experimentAction || "No experiment selected."}
        </Text>

        {experimentWhy ? (
          <Text style={{ fontSize: 14, color: WarmTheme.mutedText }}>
            Why this might help: {experimentWhy}
          </Text>
        ) : null}
      </View>

      {supports ? (
        <Text style={{ marginBottom: 8, color: WarmTheme.mutedText }}>
          What will help: {supports}
        </Text>
      ) : null}

      {mantra ? (
        <Text style={{ marginBottom: 8, color: WarmTheme.mutedText }}>
          Words to come back to: {mantra}
        </Text>
      ) : null}

      {reminder ? (
        <Text style={{ marginBottom: 24, color: WarmTheme.mutedText }}>
          Reflection reminder: {reminder}
        </Text>
      ) : null}

      <Button title="Done for today" onPress={finishForToday} />
    </View>
  );
}

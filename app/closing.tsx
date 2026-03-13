import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { sessionRepository } from "../lib/storage";
import { DurationOption, StoredSession } from "../types/session";

function getRouteType(topic?: string): StoredSession["routeType"] {
  return topic ? "short" : "deepdive";
}

function getDurationLabel(duration?: string) {
  if (duration === "2") return "2 minutes";
  if (duration === "5") return "5 minutes";
  if (duration === "10") return "10 minutes";
  return undefined;
}

export default function ClosingScreen() {
  const {
    topic,
    moment,
    balance,
    warmth,
    structure,
    experimentTitle,
    experimentAction,
    experimentWhy,
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
    experimentTitle?: string;
    experimentAction?: string;
    experimentWhy?: string;
    reminder?: string;
    supports?: string;
    mantra?: string;
    duration?: DurationOption;
  }>();

  const session: StoredSession = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),

    routeType: getRouteType(topic),
    duration,

    topic,
    moment,

    warmth,
    structure,
    balance,

    experimentTitle: experimentTitle || "Your experiment",
    experimentAction: experimentAction || "No experiment selected.",
    experimentWhy,

    support: supports,
    mantra,
    reminder,

    followUpStatus: "pending",
  };

  useEffect(() => {
  if (!experimentTitle || !experimentAction) return;
  void sessionRepository.saveSession(session);
}, []);

  const isDeepDive = !!balance;
  const durationLabel = getDurationLabel(duration);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
        You're set
      </Text>

      <Text style={{ marginBottom: 24 }}>
        You chose one small experiment to try. That is enough for today.
      </Text>

      <View style={{ marginBottom: 24 }}>
        {topic ? <Text style={{ marginBottom: 8 }}>Topic: {topic}</Text> : null}
        {moment ? <Text style={{ marginBottom: 8 }}>Moment: {moment}</Text> : null}

        {isDeepDive ? (
          <>
            <Text style={{ marginBottom: 8 }}>Warmth: {warmth}</Text>
            <Text style={{ marginBottom: 8 }}>Structure: {structure}</Text>
            <Text style={{ marginBottom: 8 }}>Focus: {balance}</Text>
          </>
        ) : null}
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#999",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          {experimentTitle || "Your experiment"}
        </Text>

        <Text style={{ marginBottom: 12 }}>
          {experimentAction || "No experiment selected."}
        </Text>

        {experimentWhy ? (
          <Text style={{ fontSize: 14, color: "#555" }}>
            Why this might help: {experimentWhy}
          </Text>
        ) : null}
      </View>

      {durationLabel ? (
        <Text style={{ marginBottom: 8 }}>Session length: {durationLabel}</Text>
      ) : null}

      {supports ? (
        <Text style={{ marginBottom: 8 }}>Support plan: {supports}</Text>
      ) : null}

      {mantra ? (
        <Text style={{ marginBottom: 8 }}>Reminder phrase: {mantra}</Text>
      ) : null}

      <Text style={{ marginBottom: 24 }}>
        Reminder: {reminder || "None chosen"}
      </Text>

      <Button title="Done for today" onPress={() => router.replace("/")} />
    </View>
  );
}

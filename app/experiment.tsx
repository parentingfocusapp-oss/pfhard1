import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import {
  FollowupMode,
  getExperimentList,
  getSelectedExperimentIndex,
} from "../lib/experiments";
import { sessionRepository } from "../lib/storage";
import { StoredSession } from "../types/session";

export default function ExperimentScreen() {
  const params = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    balance?: string;
    warmth?: string;
    structure?: string;
    index?: string;
    duration?: string;
    followupMode?: FollowupMode;
    sessionId?: string;
  }>();


  const topic = params.topic;
  const moment = params.moment;
  const balance = params.balance;
  const warmth = params.warmth;
  const structure = params.structure;
  const requestedIndex = params.index;
  const duration = params.duration;
  const followupMode = params.followupMode;
  const sessionId = params.sessionId;

  const isDeepDive = !!balance;

  const [previousSession, setPreviousSession] = useState<StoredSession | null>(null);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(true);

  useEffect(() => {
    async function loadPreviousSession() {
      if (!sessionId) {
        setIsLoadingPrevious(false);
        return;
      }

      const sessions = await sessionRepository.getAllSessions();
      const found =
  sessions.find((session: StoredSession) => session.id === sessionId) || null;
      setPreviousSession(found);
      setIsLoadingPrevious(false);
    }

    loadPreviousSession();
  }, [sessionId]);

  const experiments = getExperimentList({ topic, moment, balance });

  const suggestionIndex = getSelectedExperimentIndex({
    experiments,
    requestedIndex,
    followupMode,
    previousExperimentTitle: previousSession?.experimentTitle,
  });

  const experiment = experiments[suggestionIndex];
  const hasNextSuggestion = suggestionIndex < experiments.length - 1;

  const heading =
    followupMode === "build"
      ? "Build on what worked"
      : followupMode === "alternative"
      ? "Try another idea for this area"
      : "Your experiment";

  if (isLoadingPrevious) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text>Loading experiment...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
        {heading}
      </Text>

      {isDeepDive ? (
        <>
          <Text style={{ marginBottom: 8 }}>Warmth: {warmth}</Text>
          <Text style={{ marginBottom: 8 }}>Structure: {structure}</Text>
          <Text style={{ marginBottom: 24 }}>Focus: {balance}</Text>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 12 }}>Topic: {topic}</Text>
          <Text style={{ marginBottom: 24 }}>Moment: {moment}</Text>
        </>
      )}

      {experiment ? (
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
            {experiment.title}
          </Text>

          <Text style={{ marginBottom: 12 }}>{experiment.action}</Text>

          <Text style={{ fontSize: 14, color: "#555" }}>
            Why this might help: {experiment.why}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            borderWidth: 1,
            borderColor: "#999",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          No more suggestions available right now for this route.
        </Text>
      )}

      <Button
        title="I'll try this"
        onPress={() => {
          if (!experiment) return;

          const nextScreen = duration === "2" ? "/reminder" : "/will";

          router.push({
            pathname: nextScreen,
            params: {
              topic: topic || "",
              moment: moment || "",
              balance: balance || "",
              warmth: warmth || "",
              structure: structure || "",
              experimentTitle: experiment.title,
              experimentAction: experiment.action,
              experimentWhy: experiment.why,
              index: String(suggestionIndex),
              duration: duration || "",
            },
          });
        }}
      />

      <View style={{ height: 12 }} />

      <Button
        title="This doesn't fit"
        onPress={() => {
          if (hasNextSuggestion) {
            router.replace({
              pathname: "/experiment",
              params: {
                topic: topic || "",
                moment: moment || "",
                balance: balance || "",
                warmth: warmth || "",
                structure: structure || "",
                index: String(suggestionIndex + 1),
                duration: duration || "",
              },
            });
          }
        }}
      />

      <View style={{ height: 12 }} />

      <Button title="Back" onPress={() => router.back()} />

      {!hasNextSuggestion && (
        <Text style={{ marginTop: 16, fontSize: 14 }}>
          You have reached the end of the current suggestions.
        </Text>
      )}
    </View>
  );
}

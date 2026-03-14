import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { getReflectionAssist } from "../lib/ai/client";
import {
  FollowupMode,
  getExperimentList,
  getSelectedExperimentIndex,
} from "../lib/experiments";
import { sessionRepository } from "../lib/storage";
import { StoredSession } from "../types/session";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type Choice =
  | {
      kind: "parent";
      title: string;
      action: string;
      why: string;
    }
  | {
      kind: "library";
      title: string;
      action: string;
      why: string;
    };

export default function ExperimentScreen() {
  const params = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    momentSource?: "typed" | "preset";
    balance?: string;
    warmth?: string;
    structure?: string;
    parentOptions?: string;
    index?: string;
    duration?: string;
    followupMode?: FollowupMode;
    sessionId?: string;
  }>();

  const topic = params.topic;
  const moment = params.moment;
  const momentSource = params.momentSource;
  const balance = params.balance;
  const warmth = params.warmth;
  const structure = params.structure;
  const requestedIndex = params.index;
  const duration = params.duration;
  const followupMode = params.followupMode;
  const sessionId = params.sessionId;
  const parentOptions = params.parentOptions;

  const isDeepDive = !!balance;

  const [previousSession, setPreviousSession] = useState<StoredSession | null>(
    null
  );
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(true);
  const [aiSuggestionIndex, setAiSuggestionIndex] = useState<number | null>(
    null
  );
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [selectedChoiceKey, setSelectedChoiceKey] = useState("");

  useEffect(() => {
    async function maybeAssist() {
      if (momentSource !== "typed") return;
      if (!moment) return;

      const experiments = getExperimentList({ topic, moment, balance });

      await delay(800);

      const response = await getReflectionAssist({
        routeType: isDeepDive ? "deepdive" : "short",
        duration: Number(duration) as 2 | 5 | 10,
        topic,
        moment,
        warmth,
        structure,
        balance,
        reflectionText: moment,
        experimentOptions: experiments,
      });

      if (response.summary) {
        setAiReflection(response.summary);
      }

      if (response.suggestedExperimentIds.length > 0) {
        const index = experiments.findIndex(
          (e) => e.id === response.suggestedExperimentIds[0]
        );

        if (index >= 0) {
          setAiSuggestionIndex(index);
        }
      }
    }

    maybeAssist();
  }, [
    momentSource,
    moment,
    topic,
    balance,
    isDeepDive,
    duration,
    warmth,
    structure,
  ]);

  useEffect(() => {
    async function loadPreviousSession() {
      if (!sessionId) {
        setIsLoadingPrevious(false);
        return;
      }

      const sessions = await sessionRepository.getAllSessions();
      const found =
        sessions.find((session: StoredSession) => session.id === sessionId) ||
        null;

      setPreviousSession(found);
      setIsLoadingPrevious(false);
    }

    loadPreviousSession();
  }, [sessionId]);

  const experiments = getExperimentList({ topic, moment, balance });

  const suggestionIndex =
    aiSuggestionIndex ??
    getSelectedExperimentIndex({
      experiments,
      requestedIndex,
      followupMode,
      previousExperimentTitle: previousSession?.experimentTitle,
    });

  const libraryExperiment = experiments[suggestionIndex];
  const hasNextSuggestion = suggestionIndex < experiments.length - 1;

  const parsedParentIdeas = useMemo(() => {
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

  const choices: Choice[] = [
    ...parsedParentIdeas.map((idea) => ({
      kind: "parent" as const,
      title: "Your idea",
      action: idea,
      why: "This is one of the ideas you generated yourself.",
    })),
    ...(libraryExperiment
      ? [
          {
            kind: "library" as const,
            title: libraryExperiment.title,
            action: libraryExperiment.action,
            why: libraryExperiment.why,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (choices.length === 0) {
      setSelectedChoiceKey("");
      return;
    }

    setSelectedChoiceKey(choices[0].action);
  }, [parentOptions, suggestionIndex]);

  const selectedChoice =
    choices.find((choice) => choice.action === selectedChoiceKey) || choices[0];

  const heading =
    followupMode === "build"
      ? "Build on what worked"
      : followupMode === "alternative"
      ? "Try another idea for this area"
      : "Choose your experiment";

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

      {aiReflection && (
        <Text
          style={{
            fontSize: 16,
            fontStyle: "italic",
            marginBottom: 16,
            color: "#444",
          }}
        >
          {aiReflection}
        </Text>
      )}

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

      {choices.length > 0 ? (
        <>
          {choices.map((choice, index) => {
            const isSelected = selectedChoiceKey === choice.action;

            return (
              <Pressable
                key={`${choice.kind}-${choice.action}-${index}`}
                onPress={() => setSelectedChoiceKey(choice.action)}
                style={{
                  borderWidth: 1,
                  borderColor: isSelected ? "#333" : "#999",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                  backgroundColor: isSelected ? "#f2f2f2" : "#fff",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
                  {choice.kind === "library"
                    ? "Suggested experiment"
                    : `Parent option ${index + 1}`}
                </Text>

                <Text style={{ marginBottom: 12 }}>{choice.action}</Text>

                <Text style={{ fontSize: 14, color: "#555" }}>
                  Why this might help: {choice.why}
                </Text>
              </Pressable>
            );
          })}
        </>
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
          No suggestions available right now for this route.
        </Text>
      )}

      <Button
        title="I'll try this"
        onPress={() => {
          if (!selectedChoice) return;

          const nextScreen = duration === "2" ? "/reminder" : "/will";

          router.push({
            pathname: nextScreen,
            params: {
              topic: topic || "",
              moment: moment || "",
              balance: balance || "",
              warmth: warmth || "",
              structure: structure || "",
              experimentTitle: selectedChoice.title,
              experimentAction: selectedChoice.action,
              experimentWhy: selectedChoice.why,
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
                parentOptions: parentOptions || JSON.stringify([]),
                index: String(suggestionIndex + 1),
                duration: duration || "",
              },
            });
          }
        }}
      />

      <View style={{ height: 12 }} />

      <Button title="Back" onPress={() => router.back()} />

      {!hasNextSuggestion && libraryExperiment && (
        <Text style={{ marginTop: 16, fontSize: 14 }}>
          You have reached the end of the current library suggestions.
        </Text>
      )}
    </View>
  );
}
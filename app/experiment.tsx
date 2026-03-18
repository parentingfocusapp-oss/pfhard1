import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import {
  getBackendDebugSource,
  getAppliedExperimentExample,
} from "../lib/ai/client";
import {
  FollowupMode,
  getExperimentList,
  getSelectedExperimentIndex,
} from "../lib/experiments";
import { sessionRepository } from "../lib/storage";
import { StoredSession } from "../types/session";

type Choice =
  | {
      kind: "parent";
      title: string;
      action: string;
      why: string;
      capacityLevel?: 1 | 2 | 3;
    }
  | {
      kind: "library";
      title: string;
      action: string;
      why: string;
      capacityLevel: 1 | 2 | 3;
    };

function buildForExampleText(action: string) {
  const normalizedAction = action.toLowerCase();

  if (
    normalizedAction.includes("sentence") ||
    normalizedAction.includes("phrase") ||
    normalizedAction.includes("script")
  ) {
    return "For example: decide the exact words you want to use before the moment starts, then say the same thing calmly each time instead of adding more explanations.";
  }

  if (
    normalizedAction.includes("warning") ||
    normalizedAction.includes("countdown") ||
    normalizedAction.includes("timer")
  ) {
    return "For example: give one clear heads-up before the hard moment, then move to the next step when the time comes instead of starting a long discussion.";
  }

  if (
    normalizedAction.includes("choice") ||
    normalizedAction.includes("choose one") ||
    normalizedAction.includes("two")
  ) {
    return "For example: keep the boundary with you, but make cooperation easier by offering a small acceptable choice inside that boundary.";
  }

  if (
    normalizedAction.includes("prepare") ||
    normalizedAction.includes("night before") ||
    normalizedAction.includes("predictable") ||
    normalizedAction.includes("routine")
  ) {
    return "For example: make one small change before the hard moment begins, so there is less pressure and less to argue about when it arrives.";
  }

  if (
    normalizedAction.includes("less words") ||
    normalizedAction.includes("fewer words") ||
    normalizedAction.includes("brief")
  ) {
    return "For example: keep your response short and steady, so the moment does not grow through extra talking.";
  }

  return "For example: think about what you want to do in that moment, make it smaller and clearer in your mind, then carry it through without adding lots of new explanation.";
}

export default function ExperimentScreen() {
  const params = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    rawMoment?: string;
    momentSource?: "typed" | "preset";
    balance?: string;
    warmth?: string;
    structure?: string;
    reality?: string;
    parentOptions?: string;
    index?: string;
    duration?: string;
    followupMode?: FollowupMode;
    sessionId?: string;
  }>();

  const topic = params.topic;
  const moment = params.moment;
  const rawMoment = params.rawMoment;
  const momentSource = params.momentSource;
  const balance = params.balance;
  const warmth = params.warmth;
  const structure = params.structure;
  const reality = params.reality;
  const requestedIndex = params.index;
  const duration = params.duration;
  const followupMode = params.followupMode;
  const sessionId = params.sessionId;
  const parentOptions = params.parentOptions;

  const [previousSession, setPreviousSession] = useState<StoredSession | null>(
    null
  );
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(true);
  const [aiBadgeLabel, setAiBadgeLabel] = useState("AI fallback");
  const [isApplyingExample, setIsApplyingExample] = useState(false);
  const [appliedExample, setAppliedExample] = useState<string | null>(null);
  const [appliedExampleSource, setAppliedExampleSource] = useState<
    "backend" | "fallback" | null
  >(null);

  useEffect(() => {
    async function loadAiBadge() {
      const source = await getBackendDebugSource();

      if (!source) {
        setAiBadgeLabel("AI fallback");
        return;
      }

      if (!source.openAiConfigured) {
        setAiBadgeLabel("AI fallback");
        return;
      }

      setAiBadgeLabel(`AI ${source.model}`);
    }

    void loadAiBadge();
  }, []);

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

    void loadPreviousSession();
  }, [sessionId]);

  const experiments = getExperimentList({ topic, moment, balance });

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

  const parentChoices: Choice[] = parsedParentIdeas.map((idea) => ({
    kind: "parent",
    title: "Your idea",
    action: idea,
    why: "It starts with what already feels realistic to you.",
    capacityLevel: 1,
  }));

  const libraryChoices: Choice[] = experiments.map((experiment) => ({
    kind: "library",
    title: experiment.title,
    action: experiment.action,
    why: experiment.why,
    capacityLevel: experiment.capacityLevel,
  }));

  const choices = [...parentChoices, ...libraryChoices];
  const parentChoiceCount = parentChoices.length;

  const firstLevelOneIndex = experiments.findIndex(
    (experiment) => experiment.capacityLevel === 1
  );
  const libraryStartIndex = firstLevelOneIndex >= 0 ? firstLevelOneIndex : 0;

  const requestedLibraryIndex =
    requestedIndex !== undefined &&
    Number(requestedIndex) >= parentChoiceCount
      ? String(Number(requestedIndex) - parentChoiceCount)
      : undefined;

  const followupLibraryIndex = getSelectedExperimentIndex({
    experiments,
    requestedIndex: requestedLibraryIndex,
    followupMode,
    previousExperimentTitle: previousSession?.experimentTitle,
  });

  const requestedChoiceIndex = Number(requestedIndex);

  const selectedChoiceIndex =
    Number.isInteger(requestedChoiceIndex) &&
    requestedChoiceIndex >= 0 &&
    requestedChoiceIndex < choices.length
      ? requestedChoiceIndex
      : choices.length > 0
      ? Math.min(
          parentChoiceCount +
            (followupMode ? followupLibraryIndex : libraryStartIndex),
          choices.length - 1
        )
      : 0;

  const selectedChoice = choices[selectedChoiceIndex];
  const hasAlternativeChoices = choices.length > 1;
  const forExampleText = selectedChoice
    ? buildForExampleText(selectedChoice.action)
    : null;

  const heading =
    followupMode === "build"
      ? "Build on what worked"
      : followupMode === "alternative"
      ? "Try another idea for this area"
      : "Choose one experiment";

  if (isLoadingPrevious) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ color: WarmTheme.text }}>Loading experiment...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: WarmTheme.bg,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          marginBottom: 20,
          color: WarmTheme.text,
        }}
      >
        {heading}
      </Text>

      <View
        style={{
          alignSelf: "flex-start",
          borderWidth: 1,
          borderColor: WarmTheme.border,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 4,
          marginBottom: 16,
          backgroundColor: WarmTheme.surface,
        }}
      >
        <Text style={{ color: WarmTheme.mutedText, fontSize: 12, fontWeight: "600" }}>
          {aiBadgeLabel}
        </Text>
      </View>

      {selectedChoice ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 16,
            padding: 18,
            marginBottom: 20,
            backgroundColor: WarmTheme.surfaceAlt,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 10,
              color: WarmTheme.accent,
            }}
          >
            {selectedChoice.kind === "library" ? "Suggested experiment" : "Your idea"}
          </Text>

          {selectedChoice.capacityLevel ? (
            <Text style={{ marginBottom: 10, color: WarmTheme.mutedText }}>
              Capacity level {selectedChoice.capacityLevel}
            </Text>
          ) : null}

          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              lineHeight: 30,
              marginBottom: 12,
              color: WarmTheme.text,
            }}
          >
            {selectedChoice.action}
          </Text>

          <Text style={{ marginBottom: 10, color: WarmTheme.mutedText }}>
            Why this might help: {selectedChoice.why}
          </Text>

          {forExampleText ? (
            <Text style={{ marginBottom: 10, color: WarmTheme.mutedText }}>
              {forExampleText}
            </Text>
          ) : null}

          {appliedExample ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: WarmTheme.border,
                borderRadius: 10,
                padding: 12,
                backgroundColor: WarmTheme.surface,
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  borderWidth: 1,
                  borderColor:
                    appliedExampleSource === "backend"
                      ? WarmTheme.accent
                      : WarmTheme.border,
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginBottom: 10,
                  backgroundColor: WarmTheme.bg,
                }}
              >
                <Text
                  style={{
                    color:
                      appliedExampleSource === "backend"
                        ? WarmTheme.accent
                        : WarmTheme.mutedText,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {appliedExampleSource === "backend"
                    ? "AI applied to your moment"
                    : "Fallback example"}
                </Text>
              </View>
              <Text style={{ color: WarmTheme.text }}>{appliedExample}</Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            backgroundColor: WarmTheme.surface,
          }}
        >
          <Text style={{ color: WarmTheme.text }}>
            No suggestions are available right now, so go back and describe the
            moment a little differently.
          </Text>
        </View>
      )}

      <Button
        title="I will try this"
        onPress={() => {
          if (!selectedChoice) return;

          router.push({
            pathname: "/will",
            params: {
              topic: topic || "",
              moment: moment || "",
              balance: balance || "",
              warmth: warmth || "",
              structure: structure || "",
              reality: reality || "",
              experimentTitle: selectedChoice.title,
              experimentAction: selectedChoice.action,
              experimentWhy: selectedChoice.why,
              index: String(selectedChoiceIndex),
              duration: duration || "",
            },
          });
        }}
        disabled={!selectedChoice}
      />

      <View style={{ height: 12 }} />

      <Button
        title={
          isApplyingExample
            ? "Applying it to your moment..."
            : "I like the sound of this but don't see how to use it yet"
        }
        onPress={() => {
          if (!selectedChoice) return;

          void (async () => {
            setIsApplyingExample(true);

            const result = await getAppliedExperimentExample({
              topic,
              moment,
              rawMoment,
              experimentTitle: selectedChoice.title,
              experimentAction: selectedChoice.action,
              experimentWhy: selectedChoice.why,
            });

            setAppliedExample(result.example);
            setAppliedExampleSource(result.source);
            setIsApplyingExample(false);
          })();
        }}
        disabled={!selectedChoice || isApplyingExample}
      />

      <View style={{ height: 12 }} />

      <Button
        title="Show the next level"
        onPress={() => {
          if (!hasAlternativeChoices) return;

          setAppliedExample(null);
          setAppliedExampleSource(null);

          router.replace({
            pathname: "/experiment",
            params: {
              topic: topic || "",
              moment: moment || "",
              rawMoment: rawMoment || "",
              balance: balance || "",
              warmth: warmth || "",
              structure: structure || "",
              reality: reality || "",
              parentOptions: parentOptions || JSON.stringify([]),
              index: String((selectedChoiceIndex + 1) % choices.length),
              duration: duration || "",
              momentSource: momentSource || "preset",
            },
          });
        }}
        disabled={!hasAlternativeChoices}
      />

      <View style={{ height: 12 }} />

      <Button
        title="Back"
        onPress={() => {
          setAppliedExample(null);
          setAppliedExampleSource(null);
          router.back();
        }}
      />
    </ScrollView>
  );
}

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
  getBestScriptVariants,
  getExperimentCardById,
  getExperimentList,
  getSelectedExperimentIndex,
} from "../lib/experiments";
import { sessionRepository } from "../lib/storage";
import { CapacityLevel, ExperimentCard, ScriptVariant } from "../types/experiment";
import { StoredSession } from "../types/session";

type Choice =
  | {
      kind: "parent";
      id?: string;
      title: string;
      action: string;
      why: string;
      primaryScript?: string;
      secondaryScripts?: string[];
      lowCapacityTip?: string;
      commonMistake?: string;
      capacityLabel?: string;
    }
  | {
      kind: "library";
      id: string;
      title: string;
      action: string;
      why: string;
      primaryScript?: string;
      secondaryScripts: string[];
      lowCapacityTip?: string;
      commonMistake?: string;
      capacityLabel?: string;
      card: ExperimentCard;
      primaryVariant: ScriptVariant | null;
    };

function formatCapacityLabel(level?: CapacityLevel) {
  if (!level) return undefined;
  if (level === "low") return "Low-energy fit";
  if (level === "medium") return "Medium-capacity fit";
  return "Higher-capacity fit";
}

function getPrimaryCapacityLevel(levels: CapacityLevel[]) {
  if (levels.includes("low")) return "low";
  if (levels.includes("medium")) return "medium";
  return levels[0];
}

function buildParentIdeaExampleText(action: string) {
  const normalizedAction = action.toLowerCase();

  if (
    normalizedAction.includes("sentence") ||
    normalizedAction.includes("phrase") ||
    normalizedAction.includes("script")
  ) {
    return "For example: pick one exact line and use it the same way each time.";
  }

  if (
    normalizedAction.includes("warning") ||
    normalizedAction.includes("countdown") ||
    normalizedAction.includes("timer")
  ) {
    return "For example: give one heads-up, then move calmly to the next step.";
  }

  if (
    normalizedAction.includes("choice") ||
    normalizedAction.includes("choose") ||
    normalizedAction.includes("two")
  ) {
    return "For example: keep the boundary with you, but offer one small acceptable choice inside it.";
  }

  return "For example: make the idea a little smaller and a little clearer before you try it.";
}

function buildLibraryChoice(
  card: ExperimentCard,
  params: {
    ageBand?: ExperimentCard["ageBands"][number];
    parentCapacity?: CapacityLevel;
  }
): Choice {
  const { primary, secondary } = getBestScriptVariants(card, params);
  const primaryCapacity = getPrimaryCapacityLevel(card.parentCapacity);

  return {
    kind: "library",
    id: card.id,
    title: card.title,
    action: card.whatToDo,
    why: card.whyItWorks,
    primaryScript: primary?.text,
    secondaryScripts: secondary.map((script) => script.text),
    lowCapacityTip: card.lowCapacityTip,
    commonMistake: card.commonMistake,
    capacityLabel: formatCapacityLabel(primaryCapacity),
    card,
    primaryVariant: primary,
  };
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
    ageBand?: ExperimentCard["ageBands"][number];
    parentCapacity?: CapacityLevel;
    experimentId?: string;
    quadrant?: string;
    suggestedDirection?: string;
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
  const ageBand = params.ageBand;
  const parentCapacity = params.parentCapacity;
  const experimentId = params.experimentId;
  const quadrant = params.quadrant;
  const suggestedDirection = params.suggestedDirection;

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

      if (!source || !source.openAiConfigured) {
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

  const rankedExperiments = getExperimentList({
    topic,
    moment,
    balance,
    warmthLevel:
      warmth === "low" || warmth === "medium" || warmth === "high"
        ? warmth
        : undefined,
    structureLevel:
      structure === "low" || structure === "medium" || structure === "high"
        ? structure
        : undefined,
    ageBand,
    parentCapacity,
  });

  const experiments = useMemo(() => {
    if (!experimentId) {
      return rankedExperiments;
    }

    const selectedCard = getExperimentCardById(experimentId);

    if (!selectedCard) {
      return rankedExperiments;
    }

    const others = rankedExperiments.filter((card) => card.id !== selectedCard.id);
    return [selectedCard, ...others];
  }, [experimentId, rankedExperiments]);

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

  const parentChoices: Choice[] = parsedParentIdeas.map((idea, index) => ({
    kind: "parent",
    id: `parent-idea-${index}`,
    title: "Your idea",
    action: idea,
    why: "It starts with what already feels realistic to you.",
    primaryScript: buildParentIdeaExampleText(idea),
    secondaryScripts: [],
    lowCapacityTip: "Keep your version short enough that you could still do it on a hard day.",
    commonMistake: "Trying to make the idea too ambitious can make it harder to try.",
    capacityLabel: "Parent-led option",
  }));

  const libraryChoices: Choice[] = experiments.map((experiment) =>
    buildLibraryChoice(experiment, { ageBand, parentCapacity })
  );

  const choices = [...parentChoices, ...libraryChoices];
  const parentChoiceCount = parentChoices.length;
  const libraryStartIndex = 0;

  const requestedLibraryIndex =
    requestedIndex !== undefined &&
    Number(requestedIndex) >= parentChoiceCount
      ? String(Number(requestedIndex) - parentChoiceCount)
      : undefined;

  const followupLibraryIndex = getSelectedExperimentIndex({
    experiments,
    requestedIndex: requestedLibraryIndex,
    followupMode,
    previousExperimentId: previousSession?.experimentId,
    previousExperimentTitle: previousSession?.experimentTitle,
  });

  const requestedChoiceIndex = Number(requestedIndex);

  const selectedChoiceIndex =
    Number.isInteger(requestedChoiceIndex) &&
    requestedChoiceIndex >= 0 &&
    requestedChoiceIndex < choices.length
      ? requestedChoiceIndex
      : experimentId
      ? Math.min(parentChoiceCount, choices.length - 1)
      : choices.length > 0
      ? Math.min(
          parentChoiceCount +
            (followupMode ? followupLibraryIndex : libraryStartIndex),
          choices.length - 1
        )
      : 0;

  const selectedChoice = choices[selectedChoiceIndex];
  const hasAlternativeChoices = choices.length > 1;

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

          {selectedChoice.capacityLabel ? (
            <Text style={{ marginBottom: 10, color: WarmTheme.mutedText }}>
              {selectedChoice.capacityLabel}
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
            {selectedChoice.title}
          </Text>

          <Text style={{ marginBottom: 12, color: WarmTheme.text }}>
            {selectedChoice.action}
          </Text>

          {selectedChoice.primaryScript ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: WarmTheme.border,
                borderRadius: 10,
                padding: 12,
                marginBottom: 12,
                backgroundColor: WarmTheme.surface,
              }}
            >
              <Text
                style={{
                  marginBottom: 8,
                  color: WarmTheme.mutedText,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                Example
              </Text>
              <Text style={{ color: WarmTheme.text }}>{selectedChoice.primaryScript}</Text>
            </View>
          ) : null}

          <Text style={{ marginBottom: 10, color: WarmTheme.mutedText }}>
            Why this might help: {selectedChoice.why}
          </Text>

          {selectedChoice.lowCapacityTip ? (
            <Text style={{ marginBottom: 10, color: WarmTheme.mutedText }}>
              Low-energy tip: {selectedChoice.lowCapacityTip}
            </Text>
          ) : null}

          {selectedChoice.secondaryScripts?.length ? (
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  marginBottom: 8,
                  color: WarmTheme.mutedText,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                More ways to say it
              </Text>

              {selectedChoice.secondaryScripts.map((script, index) => (
                <Text
                  key={`${selectedChoice.id || selectedChoice.title}-script-${index}`}
                  style={{ marginBottom: 6, color: WarmTheme.text }}
                >
                  {script}
                </Text>
              ))}
            </View>
          ) : null}

          {selectedChoice.commonMistake ? (
            <Text style={{ color: WarmTheme.mutedText }}>
              Common mistake: {selectedChoice.commonMistake}
            </Text>
          ) : null}

          {appliedExample ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: WarmTheme.border,
                borderRadius: 10,
                padding: 12,
                marginTop: 14,
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
              profileQuadrant: quadrant || "",
              suggestedDirection: suggestedDirection || "",
              experimentId: selectedChoice.kind === "library" ? selectedChoice.id : "",
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
              quadrant: quadrant || "",
              suggestedDirection: suggestedDirection || "",
              parentOptions: parentOptions || JSON.stringify([]),
              index: String((selectedChoiceIndex + 1) % choices.length),
              duration: duration || "",
              momentSource: momentSource || "preset",
              ageBand: ageBand || "",
              parentCapacity: parentCapacity || "",
              sessionId: sessionId || "",
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

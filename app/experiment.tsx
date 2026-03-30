import { router, useLocalSearchParams } from "expo-router";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Button, Pressable, ScrollView, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import {
  getAppliedExperimentExample,
  getTailoredShortExperiment,
} from "../lib/ai/client";
import {
  FollowupMode,
  getBestScriptVariants,
  getExperimentCardById,
  getExperimentSelection,
  getSelectedExperimentIndex,
  toShortExperimentSource,
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

type DisplayExperiment = {
  title: string;
  whatToDo: string;
  script?: string;
  whyItWorks: string;
  source: "ai" | "library";
  sourceName?: string;
  sourceUrl?: string;
  sourceCitation?: string;
};

type DetailSectionKey = "how" | "say" | "why";

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

function normalizeText(value?: string) {
  return value?.trim().toLowerCase() || "";
}

function normalizeMomentForShortExperiment(params: {
  topic?: string;
  moment?: string;
  rawMoment?: string;
}) {
  const source = params.rawMoment?.trim() || params.moment?.trim() || "";
  const normalized = normalizeText(source);
  const topic = normalizeText(params.topic);

  if (!normalized) return undefined;

  if (
    normalized.includes("argu") ||
    normalized.includes("back and forth") ||
    normalized.includes("battle")
  ) {
    return "back-and-forth conflict in this repeated moment";
  }

  if (
    normalized.includes("won't") ||
    normalized.includes("will not") ||
    normalized.includes("refus") ||
    normalized.includes("no ") ||
    normalized.includes("doesn't") ||
    normalized.includes("not ")
  ) {
    return "slow or resistant response to the first instruction in this moment";
  }

  if (
    normalized.includes("shout") ||
    normalized.includes("yell") ||
    normalized.includes("scream") ||
    normalized.includes("meltdown")
  ) {
    return "quick escalation and raised emotion in this moment";
  }

  if (
    normalized.includes("stall") ||
    normalized.includes("delay") ||
    normalized.includes("dawdle") ||
    normalized.includes("dragging") ||
    normalized.includes("slow")
  ) {
    return "slow start with repeated prompting in this moment";
  }

  if (topic.includes("screen")) {
    return "difficulty stopping screen time and moving to the next step";
  }

  if (topic.includes("bed")) {
    return "resistance and delay around settling into bedtime";
  }

  if (topic.includes("morning")) {
    return "slow transitions and repeated prompting in the morning routine";
  }

  if (topic.includes("homework")) {
    return "resistance or slow start around homework";
  }

  return source;
}

function getTriedTags(tried: string[]) {
  const tags = new Set<string>();

  tried.forEach((label) => {
    const normalized = normalizeText(label);

    if (!normalized || normalized === "nothing yet") return;
    if (normalized.includes("reminder")) tags.add("repeated-reminders");
    if (normalized.includes("explain")) tags.add("extra-explaining");
    if (normalized.includes("consequence")) tags.add("consequences");
    if (normalized.includes("calm")) tags.add("staying-calm");
    if (normalized.includes("shout") || normalized.includes("yell")) tags.add("shouting");
    if (normalized.includes("device") || normalized.includes("screen")) tags.add("device-removal");
    if (normalized.includes("take") && normalized.includes("away")) {
      tags.add("removal-tactic");
    }
  });

  return [...tags];
}

function normalizeGoalLabels(goal: string[]) {
  return goal
    .map((label) => {
      const normalized = normalizeText(label);

      if (normalized === "listen first time") {
        return "faster response to the first instruction without repeated prompting";
      }

      if (normalized === "less arguing") {
        return "less back-and-forth and quicker cooperation";
      }

      if (normalized === "stay calm") {
        return "calmer response with less escalation in the hard moment";
      }

      if (normalized === "more independence") {
        return "more independent follow-through with less parent prompting";
      }

      if (normalized === "less shouting") {
        return "calmer transition with less escalation";
      }

      if (normalized === "do it without an argument") {
        return "more cooperation with less escalation";
      }

      return label.trim();
    })
    .filter(Boolean);
}

function shouldUseNormalizedBehaviourHints(ageBand?: ExperimentCard["ageBands"][number]) {
  return ageBand !== "11-16";
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

function getCardStrategySignals(card: ExperimentCard) {
  return new Set((card.tags || []).slice(0, 5));
}

function buildDiverseSourceCards(cards: ExperimentCard[], limit = 3) {
  if (cards.length <= 1) {
    return cards.slice(0, limit);
  }

  const selected: ExperimentCard[] = [cards[0]];
  const usedSignals = getCardStrategySignals(cards[0]);
  const remaining = cards.slice(1);

  while (selected.length < limit && remaining.length > 0) {
    let bestIndex = 0;
    let bestScore = Number.NEGATIVE_INFINITY;

    remaining.forEach((card, index) => {
      const signals = getCardStrategySignals(card);
      const overlap = [...signals].filter((signal) => usedSignals.has(signal)).length;
      const diversityScore = signals.size - overlap;

      if (diversityScore > bestScore) {
        bestScore = diversityScore;
        bestIndex = index;
      }
    });

    const [nextCard] = remaining.splice(bestIndex, 1);
    selected.push(nextCard);

    getCardStrategySignals(nextCard).forEach((signal) => usedSignals.add(signal));
  }

  return selected;
}

function splitExperimentAction(text?: string) {
  const value = text?.trim() || "";

  if (!value) {
    return { summary: "", detail: "" };
  }

  const sentenceMatch = value.match(/^.*?[.!?](?:\s|$)/);

  if (!sentenceMatch) {
    return { summary: value, detail: "" };
  }

  const summary = sentenceMatch[0].trim();
  const detail = value.slice(summary.length).trim();

  return {
    summary,
    detail,
  };
}

function DetailSection(props: {
  title: string;
  expanded: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  const { title, expanded, onPress, children } = props;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: WarmTheme.border,
        borderRadius: 12,
        marginTop: 12,
        backgroundColor: WarmTheme.surface,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={onPress}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: WarmTheme.text,
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: WarmTheme.accent,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {expanded ? "−" : "+"}
        </Text>
      </Pressable>

      {expanded ? (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: WarmTheme.border,
            paddingHorizontal: 14,
            paddingVertical: 14,
          }}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
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
    tried?: string;
    goal?: string;
  }>();

  function parseStringArray(value?: string) {
    if (!value) return [];

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }

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
  const tried = useMemo(() => parseStringArray(params.tried), [params.tried]);
  const goal = useMemo(() => parseStringArray(params.goal), [params.goal]);
  const goals = goal;
  const useNormalizedHints = useMemo(
    () => shouldUseNormalizedBehaviourHints(ageBand),
    [ageBand]
  );
  const momentNormalized = useMemo(
    () =>
      useNormalizedHints
        ? normalizeMomentForShortExperiment({ topic, moment, rawMoment })
        : undefined,
    [moment, rawMoment, topic, useNormalizedHints]
  );
  const triedTags = useMemo(() => getTriedTags(tried), [tried]);
  const goalNormalized = useMemo(
    () => (useNormalizedHints ? normalizeGoalLabels(goal) : []),
    [goal, useNormalizedHints]
  );
  const tags = useMemo(() => {
    const triedTagMap: Record<string, string[]> = {
      "Repeating reminders": ["script", "routine"],
      Explaining: ["connection"],
      Consequences: ["structure", "follow-through"],
      "Staying calm": ["connection", "small-step"],
      "Nothing yet": [],
    };

    return [...new Set(tried.flatMap((label) => triedTagMap[label] || []))];
  }, [tried]);

  const [previousSession, setPreviousSession] = useState<StoredSession | null>(
    null
  );
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(true);
  const [isApplyingExample, setIsApplyingExample] = useState(false);
  const [appliedExample, setAppliedExample] = useState<string | null>(null);
  const [appliedExampleSource, setAppliedExampleSource] = useState<
    "backend" | "fallback" | null
  >(null);
  const [isLoadingTailoredExperiment, setIsLoadingTailoredExperiment] = useState(true);
  const [tailoredExperiment, setTailoredExperiment] = useState<DisplayExperiment | null>(
    null
  );
  const [expandedSections, setExpandedSections] = useState<Record<DetailSectionKey, boolean>>({
    how: false,
    say: false,
    why: false,
  });

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

  const experimentSelection = useMemo(
    () =>
      getExperimentSelection({
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
        goals,
        tags,
        ageBand,
        parentCapacity,
      }),
    [
      ageBand,
      balance,
      goals,
      moment,
      parentCapacity,
      structure,
      tags,
      topic,
      warmth,
    ]
  );

  const rankedExperiments = experimentSelection.experiments;
  const matchStrength = experimentSelection.matchStrength;

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
  const selectedLibraryChoice = selectedChoice?.kind === "library" ? selectedChoice : null;
  const selectedLibraryChoiceId = selectedLibraryChoice?.id;
  const selectedLibraryCard = useMemo(
    () =>
      selectedLibraryChoiceId
        ? experiments.find((card) => card.id === selectedLibraryChoiceId) || null
        : null,
    [experiments, selectedLibraryChoiceId]
  );
  const sourceCards = useMemo(() => {
    const preferredCards = selectedLibraryCard
      ? [
          selectedLibraryCard,
          ...experiments.filter((card) => card.id !== selectedLibraryCard.id),
        ]
      : experiments;

    return buildDiverseSourceCards(preferredCards, 3);
  }, [experiments, selectedLibraryCard]);
  const sourceCardIds = useMemo(
    () => sourceCards.map((card) => card.id),
    [sourceCards]
  );
  const sourceCardsKey = sourceCardIds.join("|");
  const shortExperimentOptions = useMemo(
    () =>
      sourceCards.map((card) =>
        toShortExperimentSource(card, { ageBand, parentCapacity })
      ),
    [ageBand, parentCapacity, sourceCards]
  );

  const heading =
    followupMode === "build"
      ? "Build on what worked"
      : followupMode === "alternative"
      ? "Try another idea for this area"
      : experimentId
      ? "Experiment"
      : "Choose one experiment";
  const fallbackExperiment = useMemo<DisplayExperiment | null>(() => {
    if (!selectedChoice) {
      return null;
    }

    return {
      title: selectedChoice.title,
      whatToDo: selectedChoice.action,
      script: selectedChoice.primaryScript,
      whyItWorks: selectedChoice.why,
      source: "library",
      sourceName: selectedChoice.kind === "library" ? selectedChoice.card.source?.name : undefined,
      sourceUrl: selectedChoice.kind === "library" ? selectedChoice.card.source?.url : undefined,
      sourceCitation:
        selectedChoice.kind === "library" ? selectedChoice.card.source?.citation : undefined,
    };
  }, [selectedChoice]);
  const displayExperiment =
    tailoredExperiment || (!isLoadingTailoredExperiment ? fallbackExperiment : null);
  const displaySource = tailoredExperiment
    ? "ai"
    : !isLoadingTailoredExperiment && fallbackExperiment
    ? "library-fallback"
    : null;
  const actionContent = useMemo(
    () => splitExperimentAction(displayExperiment?.whatToDo),
    [displayExperiment?.whatToDo]
  );
  const hasHowToDetail = actionContent.detail.length > 0;

  useEffect(() => {
    if (!displayExperiment || !displaySource) return;

    console.log(
      "[ExperimentAI] display source=%s title=%s",
      displaySource,
      displayExperiment.title
    );
  }, [displayExperiment, displaySource]);

  useEffect(() => {
    let isActive = true;

    async function loadTailoredExperiment() {
      setIsLoadingTailoredExperiment(true);
      setTailoredExperiment(null);

      if (!sourceCards.length) {
        console.log("[ExperimentAI] skipped: no source cards");
        setIsLoadingTailoredExperiment(false);
        return;
      }

      console.log(
        "[ExperimentAI] request topic=%s moment=%s ageBand=%s sourceCards=%s",
        topic || "-",
        rawMoment || moment || "-",
        ageBand || "-",
        sourceCardIds.join("|")
      );

      const result = await getTailoredShortExperiment({
        ageBand,
        topic,
        moment: rawMoment || moment,
        momentNormalized,
        tried,
        triedTags,
        goal,
        goalNormalized,
        experimentOptions: shortExperimentOptions,
      });

      if (!isActive) return;

      console.log(
        "[ExperimentAI] result source=%s title=%s",
        result.source,
        result.title
      );
      setExpandedSections({
        how: false,
        say: false,
        why: false,
      });
      setTailoredExperiment({
        title: result.title,
        whatToDo: result.whatToDo,
        script: result.script,
        whyItWorks: result.whyItWorks,
        source: result.source === "backend" ? "ai" : "library",
        sourceName: sourceCards[0]?.source?.name,
        sourceUrl: sourceCards[0]?.source?.url,
        sourceCitation: sourceCards[0]?.source?.citation,
      });
      setIsLoadingTailoredExperiment(false);
    }

    void loadTailoredExperiment();

    return () => {
      isActive = false;
    };
  }, [
    ageBand,
    goal,
    goalNormalized,
    moment,
    momentNormalized,
    rawMoment,
    sourceCardIds,
    sourceCards.length,
    sourceCardsKey,
    shortExperimentOptions,
    topic,
    tried,
    triedTags,
  ]);

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
          marginBottom: 10,
          color: WarmTheme.text,
        }}
      >
        {heading}
      </Text>

      {experimentId ? (
        <Text style={{ marginBottom: 20, color: WarmTheme.mutedText }}>
          Here&apos;s one small way to try this.
        </Text>
      ) : null}

      {isLoadingTailoredExperiment ? (
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
              fontSize: 22,
              fontWeight: "700",
              lineHeight: 30,
              marginBottom: 12,
              color: WarmTheme.text,
            }}
          >
            Finding a good fit
          </Text>
          <Text style={{ color: WarmTheme.mutedText }}>
            Pulling together one small thing to try.
          </Text>
        </View>
      ) : null}

      {displayExperiment ? (
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
            Suggested experiment
          </Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              lineHeight: 30,
              marginBottom: 10,
              color: WarmTheme.text,
            }}
          >
            {displayExperiment.title}
          </Text>

          <Text style={{ marginBottom: 6, color: WarmTheme.text }}>
            {actionContent.summary}
          </Text>

          {hasHowToDetail ? (
            <DetailSection
              title="How to do it"
              expanded={expandedSections.how}
              onPress={() =>
                setExpandedSections((current) => ({
                  ...current,
                  how: !current.how,
                }))
              }
            >
              <Text style={{ color: WarmTheme.text }}>{actionContent.detail}</Text>
            </DetailSection>
          ) : null}

          {displayExperiment.script ? (
            <DetailSection
              title="What to say"
              expanded={expandedSections.say}
              onPress={() =>
                setExpandedSections((current) => ({
                  ...current,
                  say: !current.say,
                }))
              }
            >
              <Text style={{ color: WarmTheme.text }}>{displayExperiment.script}</Text>
            </DetailSection>
          ) : null}

          <DetailSection
            title="Why this may help"
            expanded={expandedSections.why}
            onPress={() =>
              setExpandedSections((current) => ({
                ...current,
                why: !current.why,
              }))
            }
          >
            <Text style={{ color: WarmTheme.mutedText }}>
              {displayExperiment.whyItWorks}
            </Text>
          </DetailSection>

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
      ) : null}

      <Button
        title="I will try this"
        onPress={() => {
          if (!displayExperiment || !selectedChoice) return;

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
              experimentTitle: displayExperiment.title,
              experimentAction: displayExperiment.whatToDo,
              experimentWhy: displayExperiment.whyItWorks,
              experimentSourceName: displayExperiment.sourceName || "",
              experimentSourceUrl: displayExperiment.sourceUrl || "",
              experimentSourceCitation: displayExperiment.sourceCitation || "",
              index: String(selectedChoiceIndex),
              duration: duration || "",
              tried: JSON.stringify(tried),
              goal: JSON.stringify(goal),
            },
          });
        }}
        disabled={!selectedChoice || isLoadingTailoredExperiment || !displayExperiment}
      />

      <View style={{ height: 12 }} />

      <Button
        title={
          isApplyingExample
            ? "Applying it to your moment..."
            : "I like the sound of this but don't see how to use it yet"
        }
        onPress={() => {
          if (!displayExperiment) return;

          void (async () => {
            setIsApplyingExample(true);

            const result = await getAppliedExperimentExample({
              topic,
              moment,
              rawMoment,
              experimentTitle: displayExperiment.title,
              experimentAction: displayExperiment.whatToDo,
              experimentWhy: displayExperiment.whyItWorks,
            });

            setAppliedExample(result.example);
            setAppliedExampleSource(result.source);
            setIsApplyingExample(false);
          })();
        }}
        disabled={!displayExperiment || isApplyingExample || isLoadingTailoredExperiment}
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
              tried: JSON.stringify(tried),
              goal: JSON.stringify(goal),
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

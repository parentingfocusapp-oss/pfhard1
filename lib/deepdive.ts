import { interpretParentOptions } from "./ai/client";
import {
  getExperimentCardById,
  getMatchingExperimentCards,
  rankExperimentCards,
} from "./experiments";
import {
  GeneratedOption,
  GeneratedOptionWithCard,
  InterpretedOption,
  ParentingProfile,
  ReflectionScenario,
} from "../types/deepdive";
import { ExperimentCard } from "../types/experiment";

export const warmthScenarios: ReflectionScenario[] = [
  {
    id: "warmth-getting-ready",
    prompt: "Your child is upset and refusing to get ready.",
    options: [
      {
        id: "warmth-getting-ready-a",
        label: "A",
        text: "We are late. Come on, just get dressed.",
        warmthDelta: 0,
      },
      {
        id: "warmth-getting-ready-b",
        label: "B",
        text: "I can see you are upset. We still need to get ready.",
        warmthDelta: 1,
      },
      {
        id: "warmth-getting-ready-c",
        label: "C",
        text: "You are really upset. Let us pause for a moment, then we will keep moving.",
        warmthDelta: 2,
      },
    ],
  },
  {
    id: "warmth-screen-end",
    prompt: "Screen time ends and your child starts shouting.",
    options: [
      {
        id: "warmth-screen-end-a",
        label: "A",
        text: "That is enough. Stop shouting and hand it over.",
        warmthDelta: 0,
      },
      {
        id: "warmth-screen-end-b",
        label: "B",
        text: "You do not like this. It is still time to stop.",
        warmthDelta: 1,
      },
      {
        id: "warmth-screen-end-c",
        label: "C",
        text: "I know stopping feels hard. I will help you through it.",
        warmthDelta: 2,
      },
    ],
  },
  {
    id: "warmth-homework",
    prompt: "Your child says homework is stupid and starts to shut down.",
    options: [
      {
        id: "warmth-homework-a",
        label: "A",
        text: "You still have to do it, so stop arguing.",
        warmthDelta: 0,
      },
      {
        id: "warmth-homework-b",
        label: "B",
        text: "You really do not want to do this. Let us look at the first bit together.",
        warmthDelta: 1,
      },
      {
        id: "warmth-homework-c",
        label: "C",
        text: "This feels big right now. I am with you while we get started.",
        warmthDelta: 2,
      },
    ],
  },
];

export const structureScenarios: ReflectionScenario[] = [
  {
    id: "structure-bedtime",
    prompt: "Your child keeps getting out of bed.",
    options: [
      {
        id: "structure-bedtime-a",
        label: "A",
        text: "Okay, just one more thing.",
        structureDelta: 0,
      },
      {
        id: "structure-bedtime-b",
        label: "B",
        text: "Back to bed now. It is bedtime.",
        structureDelta: 2,
      },
      {
        id: "structure-bedtime-c",
        label: "C",
        text: "Back to bed. I will stay with you briefly, then I am leaving.",
        structureDelta: 1,
      },
    ],
  },
  {
    id: "structure-morning",
    prompt: "You have asked three times and your child still has not put shoes on.",
    options: [
      {
        id: "structure-morning-a",
        label: "A",
        text: "Please do it when you are ready.",
        structureDelta: 0,
      },
      {
        id: "structure-morning-b",
        label: "B",
        text: "Shoes on now. I am waiting.",
        structureDelta: 2,
      },
      {
        id: "structure-morning-c",
        label: "C",
        text: "Shoes on now. You can choose which pair.",
        structureDelta: 1,
      },
    ],
  },
  {
    id: "structure-sibling",
    prompt: "Two children are arguing and the noise is rising fast.",
    options: [
      {
        id: "structure-sibling-a",
        label: "A",
        text: "Can you both just sort it out yourselves?",
        structureDelta: 0,
      },
      {
        id: "structure-sibling-b",
        label: "B",
        text: "Stop. Separate now. We will talk when it is calmer.",
        structureDelta: 2,
      },
      {
        id: "structure-sibling-c",
        label: "C",
        text: "Stop. I am separating you and I will help you reset first.",
        structureDelta: 1,
      },
    ],
  },
];

export const goalSuggestions = [
  "Less arguing in one repeated moment",
  "A calmer bedtime",
  "Clearer follow-through without more shouting",
  "A smoother start to the day",
];

function toLevel(score: number) {
  if (score <= 1) return "low";
  if (score <= 3) return "medium";
  return "high";
}

export function buildParentingProfile(params: {
  warmthSelections: string[];
  structureSelections: string[];
}): ParentingProfile {
  const warmthScore = warmthScenarios.reduce((total, scenario) => {
    const selected = scenario.options.find((option) =>
      params.warmthSelections.includes(option.id)
    );
    return total + (selected?.warmthDelta || 0);
  }, 0);

  const structureScore = structureScenarios.reduce((total, scenario) => {
    const selected = scenario.options.find((option) =>
      params.structureSelections.includes(option.id)
    );
    return total + (selected?.structureDelta || 0);
  }, 0);

  const warmthLevel = toLevel(warmthScore);
  const structureLevel = toLevel(structureScore);

  if (
    (warmthLevel === "high" || warmthLevel === "medium") &&
    structureLevel === "low"
  ) {
    return {
      warmthLevel,
      structureLevel,
      quadrant: "higher warmth / lower structure",
      suggestedDirection:
        "It may help to bring in clearer boundaries while keeping your warmth.",
    };
  }

  if (
    (structureLevel === "high" || structureLevel === "medium") &&
    warmthLevel === "low"
  ) {
    return {
      warmthLevel,
      structureLevel,
      quadrant: "higher structure / lower warmth",
      suggestedDirection:
        "It may help to keep your clarity while showing a little more warmth in the hard moment.",
    };
  }

  if (warmthLevel === "low" && structureLevel === "low") {
    return {
      warmthLevel,
      structureLevel,
      quadrant: "lower both",
      suggestedDirection:
        "It may help to make the moment smaller, calmer, and clearer all at once.",
    };
  }

  return {
    warmthLevel,
    structureLevel,
    quadrant: "relatively balanced",
    suggestedDirection:
      "You already bring some warmth and structure. The next step may be using them more deliberately in one repeated moment.",
  };
}

export function getProfileInterpretation(profile: ParentingProfile) {
  if (profile.quadrant === "higher warmth / lower structure") {
    return "You may already bring a lot of warmth, but in harder moments your structure can become less clear.";
  }

  if (profile.quadrant === "higher structure / lower warmth") {
    return "You may already bring clarity, but in harder moments the emotional connection can drop away.";
  }

  if (profile.quadrant === "lower both") {
    return "Hard moments may be stretching both your warmth and your clarity at the same time.";
  }

  return "You seem to have some warmth and structure available already, even if the hard moments still catch you.";
}

function normalise(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function interpretIdea(text: string, profile: ParentingProfile): InterpretedOption {
  const idea = text.toLowerCase();

  if (
    idea.includes("boundary") ||
    idea.includes("limit") ||
    idea.includes("follow through") ||
    idea.includes("routine") ||
    idea.includes("warning") ||
    idea.includes("clear")
  ) {
    return {
      parentText: text,
      interpretedAs: "bring in clearer structure",
      clusterId: "structure",
    };
  }

  if (
    idea.includes("connect") ||
    idea.includes("calm") ||
    idea.includes("empathy") ||
    idea.includes("comfort") ||
    idea.includes("warm")
  ) {
    return {
      parentText: text,
      interpretedAs: "increase warmth in the moment",
      clusterId: "warmth",
    };
  }

  if (
    idea.includes("choice") ||
    idea.includes("together") ||
    idea.includes("help") ||
    idea.includes("support")
  ) {
    return {
      parentText: text,
      interpretedAs: "combine warmth with structure",
      clusterId: "balanced",
    };
  }

  if (profile.structureLevel === "low") {
    return {
      parentText: text,
      interpretedAs: "bring in clearer structure",
      clusterId: "structure",
    };
  }

  if (profile.warmthLevel === "low") {
    return {
      parentText: text,
      interpretedAs: "increase warmth in the moment",
      clusterId: "warmth",
    };
  }

  return {
    parentText: text,
    interpretedAs: "make the moment smaller and steadier",
    clusterId: "small-step",
  };
}

function getClusterGoals(interpretedAs: string) {
  if (interpretedAs.includes("structure")) {
    return ["hold the boundary calmly", "reduce friction before the moment"];
  }

  if (interpretedAs.includes("warmth")) {
    return ["stay connected while guiding", "lower tension quickly"];
  }

  if (interpretedAs.includes("combine")) {
    return ["stay connected while guiding", "hold the boundary calmly"];
  }

  return ["make the next moment easier", "help the child get started"];
}

function getClusterTags(interpretedAs: string) {
  if (interpretedAs.includes("structure")) {
    return ["structure", "routine", "script"];
  }

  if (interpretedAs.includes("warmth")) {
    return ["connection", "script"];
  }

  if (interpretedAs.includes("combine")) {
    return ["connection", "structure"];
  }

  return ["small-step", "routine"];
}

function getStrategyLabel(interpretedAs: string) {
  if (interpretedAs.includes("structure")) {
    return "More structure first";
  }

  if (interpretedAs.includes("warmth")) {
    return "More connection first";
  }

  return "Balanced approach";
}

function getWhyThisFits(params: {
  interpretedAs: string;
  profile: ParentingProfile;
  experiment: ExperimentCard;
}) {
  if (params.interpretedAs.includes("structure")) {
    return "Helps make the next step clearer without adding more pressure.";
  }

  if (params.interpretedAs.includes("warmth")) {
    return "Helps reduce resistance before the limit or task.";
  }

  if (params.profile.quadrant === "lower both") {
    return "Keeps things simpler for you while still giving your child direction.";
  }

  return params.experiment.whyItWorks;
}

function getRankedMatch(params: {
  topic?: string;
  moment?: string;
  profile: ParentingProfile;
  interpreted: InterpretedOption;
  goal?: string;
}): ExperimentCard | undefined {
  const goals = getClusterGoals(params.interpreted.interpretedAs);
  const tags = getClusterTags(params.interpreted.interpretedAs);
  const ranked = rankExperimentCards(
    getMatchingExperimentCards({
      topic: params.topic,
      moment: params.moment,
      goals,
      tags,
    }),
    {
      topic: params.topic,
      moment: params.moment,
      goals,
      tags,
      warmthLevel:
        params.profile.warmthLevel === "low"
          ? "high"
          : params.profile.warmthLevel === "medium"
          ? "medium"
          : undefined,
      structureLevel:
        params.profile.structureLevel === "low"
          ? "high"
          : params.profile.structureLevel === "medium"
          ? "medium"
          : undefined,
    }
  );

  if (ranked[0]) {
    return ranked[0];
  }

  const fallback = rankExperimentCards(
    getMatchingExperimentCards({
      topic: params.topic,
      moment: params.moment,
    }),
    {
      topic: params.topic,
      moment: params.moment,
      goals: params.goal ? [params.goal] : undefined,
    }
  );

  return fallback[0];
}

export async function generateBlendedOptions(params: {
  topic?: string;
  moment?: string;
  goal?: string;
  profile: ParentingProfile;
  parentOptions: string[];
}): Promise<GeneratedOptionWithCard[]> {
  const rawIdeas =
    params.parentOptions.map(normalise).filter(Boolean).slice(0, 6) || [];

  const interpretedResponse = rawIdeas.length
    ? await interpretParentOptions({
        topic: params.topic,
        moment: params.moment,
        balance: params.goal,
        warmth: params.profile.warmthLevel,
        structure: params.profile.structureLevel,
        parentOptions: rawIdeas,
      })
    : {
        cleanedOptions: [],
        suggestedCarryForward: [],
      };

  const cleanedIdeas =
    interpretedResponse.cleanedOptions.length > 0
      ? interpretedResponse.cleanedOptions
      : rawIdeas;

  const baseIdeas =
    cleanedIdeas.length > 0
      ? cleanedIdeas
      : [
          params.goal
            ? `I want to improve ${params.goal.toLowerCase()}`
            : "I want a steadier way to handle this moment",
        ];

  const interpretedIdeas = baseIdeas.map((idea) =>
    interpretIdea(idea, params.profile)
  );

  const dedupedByCluster = new Map<string, InterpretedOption>();

  for (const idea of interpretedIdeas) {
    if (!dedupedByCluster.has(idea.clusterId)) {
      dedupedByCluster.set(idea.clusterId, idea);
    }
  }

  const selectedIdeas = [...dedupedByCluster.values()].slice(0, 4);
  const results: GeneratedOptionWithCard[] = [];
  const usedExperimentIds = new Set<string>();

  for (const interpreted of selectedIdeas) {
    const experiment = getRankedMatch({
      topic: params.topic,
      moment: params.moment,
      profile: params.profile,
      interpreted,
      goal: params.goal,
    });

    if (!experiment || usedExperimentIds.has(experiment.id)) {
      continue;
    }

    usedExperimentIds.add(experiment.id);
    results.push({
      id: `generated-${experiment.id}`,
      parentText: interpreted.parentText,
      interpretedAs: interpreted.interpretedAs,
      strategyLabel: getStrategyLabel(interpreted.interpretedAs),
      experimentId: experiment.id,
      title: experiment.title,
      whatToDo: experiment.whatToDo,
      whyThisFits: getWhyThisFits({
        interpretedAs: interpreted.interpretedAs,
        profile: params.profile,
        experiment,
      }),
      source: "blended",
      experimentCard: experiment,
    });
  }

  if (results.length === 0) {
    const fallback = getMatchingExperimentCards({
      topic: params.topic,
      moment: params.moment,
    })[0];

    if (fallback) {
      results.push({
        id: `generated-${fallback.id}`,
        parentText: params.goal || "A steadier response",
        interpretedAs: "make the moment smaller and steadier",
        strategyLabel: "Balanced approach",
        experimentId: fallback.id,
        title: fallback.title,
        whatToDo: fallback.whatToDo,
        whyThisFits: fallback.whyItWorks,
        source: "blended",
        experimentCard: fallback,
      });
    }
  }

  return results.slice(0, 3);
}

export function reviveGeneratedOptions(payload: string | undefined): GeneratedOptionWithCard[] {
  if (!payload) return [];

  try {
    const parsed = JSON.parse(payload) as GeneratedOption[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        const experimentCard = getExperimentCardById(item.experimentId);

        if (!experimentCard) {
          return null;
        }

        return {
          ...item,
          experimentCard,
        };
      })
      .filter((item): item is GeneratedOptionWithCard => item !== null);
  } catch {
    return [];
  }
}

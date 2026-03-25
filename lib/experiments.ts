import {
  getAllExperimentCards,
  getDeepDiveExperimentCards,
  getExperimentCards,
} from "../data/experiments";
import {
  AgeBand,
  CapacityLevel,
  ExperimentAIPayload,
  ExperimentCard,
  IntensityLevel,
  ScriptVariant,
} from "../types/experiment";
import { ShortExperimentSource } from "./ai/types";

export type FollowupMode = "build" | "alternative";
export type MatchStrength = "strong" | "fallback";

type ExperimentMatchParams = {
  topic?: string;
  moment?: string;
  balance?: string;
  goals?: string[];
  tags?: string[];
  warmthLevel?: IntensityLevel;
  structureLevel?: IntensityLevel;
  ageBand?: AgeBand;
  parentCapacity?: CapacityLevel;
};

type ScriptSelectionParams = {
  ageBand?: AgeBand;
  parentCapacity?: CapacityLevel;
};

const ageBandOverlapMap: Record<AgeBand, AgeBand[]> = {
  "2-3": ["2-3"],
  "3-5": ["2-3", "4-5"],
  "4-5": ["4-5"],
  "6-8": ["6-8"],
  "6-10": ["6-8", "9-12"],
  "9-12": ["9-12"],
  "11-16": ["9-12", "13-16"],
  "13-16": ["13-16"],
};

function ageBandMatches(selectedAgeBand: AgeBand | undefined, supportedAgeBands: AgeBand[]) {
  if (!selectedAgeBand) return false;

  const matchingBands = ageBandOverlapMap[selectedAgeBand] || [selectedAgeBand];

  return supportedAgeBands.some((supportedAgeBand) =>
    matchingBands.includes(supportedAgeBand)
  );
}

function getCapacityRank(level: CapacityLevel) {
  if (level === "low") return 1;
  if (level === "medium") return 2;
  return 3;
}

function getPrimaryCapacity(card: ExperimentCard) {
  return [...card.parentCapacity].sort(
    (left, right) => getCapacityRank(left) - getCapacityRank(right)
  )[0] || "medium";
}

function scoreCard(card: ExperimentCard, params: ExperimentMatchParams) {
  let score = 0;

  if (params.topic && card.topic === params.topic) score += 10;
  if (params.moment && card.moments.includes(params.moment)) score += 10;
  if (params.balance && card.topic === params.balance) score += 10;
  if (params.ageBand && ageBandMatches(params.ageBand, card.ageBands)) score += 3;
  if (params.parentCapacity && card.parentCapacity.includes(params.parentCapacity)) {
    score += 5;
  }
  if (params.warmthLevel && card.warmthLevel === params.warmthLevel) score += 3;
  if (params.structureLevel && card.structureLevel === params.structureLevel) {
    score += 3;
  }
  if (params.goals?.length) {
    score += params.goals.filter((goal) => card.goals?.includes(goal)).length * 2;
  }
  if (params.tags?.length) {
    score += params.tags.filter((tag) => card.tags?.includes(tag)).length * 2;
  }

  return score;
}

export function getMatchingExperimentCards(
  params: ExperimentMatchParams
): ExperimentCard[] {
  const { topic, moment, balance, goals, tags, warmthLevel, structureLevel, ageBand, parentCapacity } =
    params;

  const baseCards =
    topic && moment
      ? getExperimentCards(topic, moment)
      : balance
      ? getDeepDiveExperimentCards(balance)
      : getAllExperimentCards();

  return baseCards.filter((card) => {
    if (goals?.length && !goals.some((goal) => card.goals?.includes(goal))) {
      return false;
    }

    if (tags?.length && !tags.some((tag) => card.tags?.includes(tag))) {
      return false;
    }

    if (warmthLevel && card.warmthLevel !== warmthLevel) {
      return false;
    }

    if (structureLevel && card.structureLevel !== structureLevel) {
      return false;
    }

    if (ageBand && !ageBandMatches(ageBand, card.ageBands)) {
      return false;
    }

    if (parentCapacity && !card.parentCapacity.includes(parentCapacity)) {
      return false;
    }

    return true;
  });
}

export function rankExperimentCards(
  cards: ExperimentCard[],
  params: ExperimentMatchParams
): ExperimentCard[] {
  return [...cards].sort((left, right) => {
    const scoreDifference = scoreCard(right, params) - scoreCard(left, params);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    const capacityDifference =
      getCapacityRank(getPrimaryCapacity(left)) -
      getCapacityRank(getPrimaryCapacity(right));

    if (capacityDifference !== 0) {
      return capacityDifference;
    }

    return left.title.localeCompare(right.title);
  });
}

function scoreScriptVariant(
  script: ScriptVariant,
  params: ScriptSelectionParams
) {
  let score = 0;

  if (params.ageBand && script.ageBands && ageBandMatches(params.ageBand, script.ageBands)) {
    score += 4;
  }

  if (params.parentCapacity && script.capacity?.includes(params.parentCapacity)) {
    score += 3;
  }

  if (!script.ageBands?.length) {
    score += 1;
  }

  if (!script.capacity?.length) {
    score += 1;
  }

  if (script.label === "Default") {
    score += 1;
  }

  return score;
}

export function getBestScriptVariants(
  card: ExperimentCard,
  params: ScriptSelectionParams
): {
  primary: ScriptVariant | null;
  secondary: ScriptVariant[];
} {
  const ranked = [...card.scripts].sort((left, right) => {
    const scoreDifference =
      scoreScriptVariant(right, params) - scoreScriptVariant(left, params);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return left.label.localeCompare(right.label);
  });

  return {
    primary: ranked[0] || null,
    secondary: ranked.slice(1, 3),
  };
}

export function getExperimentCardById(id: string): ExperimentCard | undefined {
  return getAllExperimentCards().find((card) => card.id === id);
}

export function toExperimentAIPayload(card: ExperimentCard): ExperimentAIPayload {
  return {
    id: card.id,
    title: card.title,
    whatToDo: card.whatToDo,
    whyItWorks: card.whyItWorks,
    ageBands: card.ageBands,
    parentCapacity: card.parentCapacity,
    goals: card.goals,
  };
}

export function toShortExperimentSource(
  card: ExperimentCard,
  params: ScriptSelectionParams
): ShortExperimentSource {
  const { primary } = getBestScriptVariants(card, params);

  return {
    ...toExperimentAIPayload(card),
    script: primary?.text,
    tags: card.tags,
  };
}

export function getExperimentList(params: ExperimentMatchParams): ExperimentCard[] {
  return getExperimentSelection(params).experiments;
}

function getTopicFallbackCards(params: ExperimentMatchParams) {
  if (!params.topic) return [];

  const allCards = getAllExperimentCards().filter((card) => card.topic === params.topic);

  const ageFiltered = params.ageBand
    ? allCards.filter((card) => ageBandMatches(params.ageBand, card.ageBands))
    : allCards;

  const capacityFiltered = params.parentCapacity
    ? ageFiltered.filter((card) => card.parentCapacity.includes(params.parentCapacity!))
    : ageFiltered;

  return capacityFiltered.length > 0
    ? capacityFiltered
    : ageFiltered.length > 0
    ? ageFiltered
    : allCards;
}

function getUniversalFallbackCards(params: ExperimentMatchParams) {
  const allCards = getAllExperimentCards();
  const ageFiltered = params.ageBand
    ? allCards.filter((card) => ageBandMatches(params.ageBand, card.ageBands))
    : allCards;

  const lowRiskCards = ageFiltered.filter((card) => getPrimaryCapacity(card) === "low");

  return lowRiskCards.length > 0 ? lowRiskCards : ageFiltered;
}

export function getExperimentSelection(params: ExperimentMatchParams): {
  experiments: ExperimentCard[];
  matchStrength: MatchStrength;
} {
  const strongMatches = rankExperimentCards(getMatchingExperimentCards(params), params);

  if (strongMatches.length > 0) {
    return {
      experiments: strongMatches,
      matchStrength: "strong",
    };
  }

  const relaxedParams: ExperimentMatchParams = {
    topic: params.topic,
    moment: params.moment,
    balance: params.balance,
    ageBand: params.ageBand,
    parentCapacity: params.parentCapacity,
    warmthLevel: params.warmthLevel,
    structureLevel: params.structureLevel,
  };

  const closeMatches = rankExperimentCards(getMatchingExperimentCards(relaxedParams), relaxedParams);

  if (closeMatches.length > 0) {
    return {
      experiments: closeMatches,
      matchStrength: "fallback",
    };
  }

  const topicFallbacks = rankExperimentCards(getTopicFallbackCards(relaxedParams), relaxedParams);

  if (topicFallbacks.length > 0) {
    return {
      experiments: topicFallbacks,
      matchStrength: "fallback",
    };
  }

  return {
    experiments: rankExperimentCards(getUniversalFallbackCards(relaxedParams), relaxedParams),
    matchStrength: "fallback",
  };
}

export function getSelectedExperimentIndex(params: {
  experiments: ExperimentCard[];
  requestedIndex?: string;
  followupMode?: FollowupMode;
  previousExperimentId?: string;
  previousExperimentTitle?: string;
}): number {
  const {
    experiments,
    requestedIndex,
    followupMode,
    previousExperimentId,
    previousExperimentTitle,
  } = params;

  if (experiments.length === 0) return 0;

  if (requestedIndex !== undefined) {
    const parsedIndex = Number(requestedIndex);

    if (
      Number.isInteger(parsedIndex) &&
      parsedIndex >= 0 &&
      parsedIndex < experiments.length
    ) {
      return parsedIndex;
    }
  }

  if (!followupMode) {
    return 0;
  }

  const previousIndex = experiments.findIndex(
    (experiment) =>
      experiment.id === previousExperimentId ||
      experiment.title === previousExperimentTitle
  );

  if (previousIndex < 0) {
    return 0;
  }

  const previousExperiment = experiments[previousIndex];

  if (!previousExperiment) {
    return 0;
  }

  const previousCapacityRank = getCapacityRank(getPrimaryCapacity(previousExperiment));

  if (followupMode === "build") {
    const higherCapacityIndex = experiments.findIndex(
      (experiment) => getCapacityRank(getPrimaryCapacity(experiment)) > previousCapacityRank
    );

    return higherCapacityIndex >= 0 ? higherCapacityIndex : previousIndex;
  }

  const sameLevelAlternativeIndex = experiments.findIndex(
    (experiment) =>
      getCapacityRank(getPrimaryCapacity(experiment)) === previousCapacityRank &&
      experiment.id !== previousExperiment.id
  );

  if (sameLevelAlternativeIndex >= 0) {
    return sameLevelAlternativeIndex;
  }

  const nextAlternativeIndex = experiments.findIndex(
    (experiment) => experiment.id !== previousExperiment.id
  );

  return nextAlternativeIndex >= 0 ? nextAlternativeIndex : previousIndex;
}

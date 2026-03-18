import { getDeepDiveExperiments, getExperiments } from "../data/experiments";
import { Experiment } from "../types/experiment";

export type FollowupMode = "build" | "alternative";

function sortExperimentsByCapacity(experiments: Experiment[]): Experiment[] {
  return [...experiments].sort((left, right) => {
    if (left.capacityLevel !== right.capacityLevel) {
      return left.capacityLevel - right.capacityLevel;
    }

    return left.title.localeCompare(right.title);
  });
}

export function getExperimentList(params: {
  topic?: string;
  moment?: string;
  balance?: string;
}): Experiment[] {
  const { topic, moment, balance } = params;

  if (topic && moment) {
    return sortExperimentsByCapacity(getExperiments(topic, moment));
  }

  if (balance) {
    return sortExperimentsByCapacity(getDeepDiveExperiments(balance));
  }

  return [];
}

export function getSelectedExperimentIndex(params: {
  experiments: Experiment[];
  requestedIndex?: string;
  followupMode?: FollowupMode;
  previousExperimentTitle?: string;
}): number {
  const {
    experiments,
    requestedIndex,
    followupMode,
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

  if (!followupMode || !previousExperimentTitle) {
    return 0;
  }

  const previousIndex = experiments.findIndex(
    (experiment) => experiment.title === previousExperimentTitle
  );

  if (previousIndex < 0) {
    return 0;
  }

  const previousExperiment = experiments[previousIndex];

  if (!previousExperiment) {
    return 0;
  }

  if (followupMode === "build") {
    const higherCapacityIndex = experiments.findIndex(
      (experiment) =>
        experiment.capacityLevel > previousExperiment.capacityLevel
    );

    return higherCapacityIndex >= 0 ? higherCapacityIndex : previousIndex;
  }

  const sameLevelAlternativeIndex = experiments.findIndex(
    (experiment) =>
      experiment.capacityLevel === previousExperiment.capacityLevel &&
      experiment.title !== previousExperiment.title
  );

  if (sameLevelAlternativeIndex >= 0) {
    return sameLevelAlternativeIndex;
  }

  const nextAlternativeIndex = experiments.findIndex(
    (experiment) => experiment.title !== previousExperiment.title
  );

  return nextAlternativeIndex >= 0 ? nextAlternativeIndex : previousIndex;
}

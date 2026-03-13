import { getDeepDiveExperiments, getExperiments } from "../data/experiments";
import { Experiment } from "../types/experiment";

export function getExperimentList(params: {
  topic?: string;
  moment?: string;
  balance?: string;
}): Experiment[] {
  const { topic, moment, balance } = params;

  if (topic && moment) {
    return getExperiments(topic, moment);
  }

  if (balance) {
    return getDeepDiveExperiments(balance);
  }

  return [];
}

export function getSelectedExperimentIndex(
  list: Experiment[],
  experimentTitle?: string
): number {
  if (!experimentTitle) return 0;

  const index = list.findIndex(
    (experiment) => experiment.title === experimentTitle
  );

  return index >= 0 ? index : 0;
}

export function getNextBuildExperiment(
  list: Experiment[],
  currentTitle?: string
): Experiment | null {
  if (list.length === 0) return null;

  const currentIndex = getSelectedExperimentIndex(list, currentTitle);
  const current = list[currentIndex];

  if (!current) return list[0] ?? null;

  const higherCapacity = list.find(
    (experiment) =>
      experiment.capacityLevel > current.capacityLevel &&
      experiment.title !== current.title
  );

  return higherCapacity ?? current;
}

export function getAlternativeExperiment(
  list: Experiment[],
  currentTitle?: string
): Experiment | null {
  if (list.length === 0) return null;

  const currentIndex = getSelectedExperimentIndex(list, currentTitle);
  const current = list[currentIndex];

  if (!current) return list[0] ?? null;

  const sameLevelAlternative = list.find(
    (experiment) =>
      experiment.capacityLevel === current.capacityLevel &&
      experiment.title !== current.title
  );

  if (sameLevelAlternative) return sameLevelAlternative;

  const nextAlternative = list.find(
    (experiment) => experiment.title !== current.title
  );

  return nextAlternative ?? current;
}
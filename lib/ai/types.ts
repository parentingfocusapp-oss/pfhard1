import { ExperimentAIPayload } from "../../types/experiment";

export type ReflectionAssistRequest = {
  routeType: "short" | "deepdive";
  duration: 2 | 5 | 10;

  topic?: string;
  moment?: string;

  warmth?: string;
  structure?: string;
  balance?: string;

  reflectionText?: string;

  experimentOptions: ExperimentAIPayload[];
};

export type ReflectionAssistResponse = {
  summary: string;
  themes: string[];
  recommendedCapacityLevel: 1 | 2 | 3;
  suggestedExperimentIds: string[];
  encouragement: string;
};

export type InterpretedMoment = {
  label: string;
  topic: "Morning routine" | "Screen time" | "Bedtime" | "Homework" | "Unknown";
  matchedMoment: string;
  summary: string;
  themes: string[];
};

export type ShortExperimentSource = ExperimentAIPayload & {
  script?: string;
  tags?: string[];
};

export type ShortExperimentRequest = {
  ageBand?: string;
  topic?: string;
  moment?: string;
  tried?: string[];
  goal?: string[];
  experimentOptions: ShortExperimentSource[];
};

export type ShortExperimentResponse = {
  title: string;
  whatToDo: string;
  script: string;
  whyItWorks: string;
};

import { ExperimentCard } from "./experiment";

export type ParentingProfile = {
  warmthLevel: "low" | "medium" | "high";
  structureLevel: "low" | "medium" | "high";
  quadrant: string;
  suggestedDirection: string;
};

export type ReflectionOption = {
  id: string;
  label: string;
  text: string;
  warmthDelta?: number;
  structureDelta?: number;
};

export type ReflectionScenario = {
  id: string;
  prompt: string;
  options: ReflectionOption[];
};

export type InterpretedOption = {
  parentText: string;
  interpretedAs: string;
  clusterId: string;
};

export type GeneratedOption = {
  id: string;
  parentText: string;
  interpretedAs: string;
  experimentId: string;
  title: string;
  whatToDo: string;
  example: string;
  whyItWorks: string;
  source: "blended";
};

export type GeneratedOptionWithCard = GeneratedOption & {
  experimentCard: ExperimentCard;
};

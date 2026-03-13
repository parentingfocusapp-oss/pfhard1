import { ReflectionAssistResponse } from "./types";

export function getFallbackResponse(): ReflectionAssistResponse {
  return {
    summary: "",
    themes: [],
    recommendedCapacityLevel: 1,
    suggestedExperimentIds: [],
    encouragement: "",
  };
}
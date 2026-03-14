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

export function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
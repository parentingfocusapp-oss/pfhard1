import {
    ReflectionAssistRequest,
    ReflectionAssistResponse,
} from "./types";

import { getFallbackResponse } from "./fallback";

export async function getReflectionAssist(
  request: ReflectionAssistRequest
): Promise<ReflectionAssistResponse> {
  try {
    if (request.reflectionText?.trim()) {
      return {
        summary: "It sounds like this moment quickly becomes tense for both of you.",
        themes: ["tension", "stuck pattern"],
        recommendedCapacityLevel: 1,
        suggestedExperimentIds: [],
        encouragement: "Small changes count.",
      };
    }

    return getFallbackResponse();
  } catch {
    return getFallbackResponse();
  }
}
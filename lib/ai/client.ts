import {
  ReflectionAssistRequest,
  ReflectionAssistResponse,
} from "./types";

import { getFallbackResponse } from "./fallback";

const BACKEND_URL = ""; // add later, e.g. https://your-api/reflect

export async function getReflectionAssist(
  request: ReflectionAssistRequest
): Promise<ReflectionAssistResponse> {
  try {
    // If a backend exists, try calling it
    if (BACKEND_URL) {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const data: ReflectionAssistResponse = await response.json();
        return data;
      }
    }

    // Temporary local AI behaviour (kept for now)
    if (request.reflectionText?.trim()) {
      return {
        summary:
          "It sounds like this moment quickly becomes tense for both of you.",
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
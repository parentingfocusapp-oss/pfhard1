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

import { safeJsonParse } from "./fallback";
import { buildMomentInterpretationPrompt } from "./prompts";
import { InterpretedMoment } from "./types";

export async function interpretOwnMoment(input: {
  topic?: string;
  momentText: string;
  knownMoments?: string[];
}): Promise<InterpretedMoment> {

  const prompt = buildMomentInterpretationPrompt(input);

  const response = await callAi(prompt); // you should already have this

  const parsed = safeJsonParse(response);

  return {
    label: parsed?.label ?? input.momentText,
    topic: parsed?.topic ?? "Unknown",
    matchedMoment: parsed?.matchedMoment ?? "custom",
    summary: parsed?.summary ?? "",
    themes: Array.isArray(parsed?.themes) ? parsed.themes.slice(0,3) : []
  };
}
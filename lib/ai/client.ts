import { getFallbackResponse, safeJsonParse } from "./fallback";
import { buildMomentInterpretationPrompt } from "./prompts";
import {
  InterpretedMoment,
  ReflectionAssistRequest,
  ReflectionAssistResponse,
} from "./types";

const BACKEND_URL = ""; // add later, e.g. https://your-api/reflect

export async function getReflectionAssist(
  request: ReflectionAssistRequest
): Promise<ReflectionAssistResponse> {
  try {
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

async function callAi(prompt: string): Promise<string> {
  // temporary placeholder until backend is connected

  return JSON.stringify({
    label: "Custom moment",
    topic: "Unknown",
    matchedMoment: "custom",
    summary: "The parent described a challenging moment.",
    themes: ["tension"],
  });
}

export async function interpretOwnMoment(input: {
  topic?: string;
  momentText: string;
  knownMoments?: string[];
}): Promise<InterpretedMoment> {
  try {
    const prompt = buildMomentInterpretationPrompt(input);
    const response = await callAi(prompt);
    const parsed = safeJsonParse(response);

    return {
      label:
        typeof parsed?.label === "string" && parsed.label.trim()
          ? parsed.label
          : input.momentText,
      topic:
        parsed?.topic === "Morning routine" ||
        parsed?.topic === "Screen time" ||
        parsed?.topic === "Bedtime" ||
        parsed?.topic === "Homework"
          ? parsed.topic
          : "Unknown",
      matchedMoment:
        typeof parsed?.matchedMoment === "string" && parsed.matchedMoment.trim()
          ? parsed.matchedMoment
          : "custom",
      summary: typeof parsed?.summary === "string" ? parsed.summary : "",
      themes: Array.isArray(parsed?.themes)
        ? parsed.themes
            .filter((item: unknown) => typeof item === "string")
            .slice(0, 3)
        : [],
    };
  } catch {
    return {
      label: input.momentText,
      topic: "Unknown",
      matchedMoment: "custom",
      summary: "",
      themes: [],
    };
  }
}

export async function interpretParentOptions(input: {
  topic?: string;
  moment?: string;
  balance?: string;
  warmth?: string;
  structure?: string;
  parentOptions: string[];
}): Promise<{
  cleanedOptions: string[];
  suggestedCarryForward: string[];
}> {
  try {
    const cleaned = input.parentOptions
      .map((idea) => idea.trim())
      .filter((idea) => idea.length > 0);

    return {
      cleanedOptions: cleaned,
      suggestedCarryForward: cleaned.slice(0, 2),
    };
  } catch {
    return {
      cleanedOptions: input.parentOptions,
      suggestedCarryForward: input.parentOptions.slice(0, 2),
    };
  }
}
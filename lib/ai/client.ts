import { getFallbackResponse } from "./fallback";
import { buildMomentInterpretationPrompt } from "./prompts";
import {
  InterpretedMoment,
  ReflectionAssistRequest,
  ReflectionAssistResponse,
  ShortExperimentRequest,
  ShortExperimentResponse,
} from "./types";

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || "").replace(
  /\/$/,
  ""
);

type ParentOptionsResponse = {
  cleanedOptions: string[];
  suggestedCarryForward: string[];
};

export type BackendDebugSource = {
  ok: boolean;
  backendReachable: boolean;
  openAiConfigured: boolean;
  model: string;
  timestamp: string;
};

export type AppliedExperimentExampleResult = {
  example: string;
  source: "backend" | "fallback";
};

export type TailoredShortExperimentResult = ShortExperimentResponse & {
  source: "backend" | "fallback";
};

async function postToBackend<T>(
  path: string,
  body: unknown
): Promise<T | null> {
  if (!API_BASE_URL) {
    console.warn(`[AI] Missing EXPO_PUBLIC_API_BASE_URL. Skipping ${path}.`);
    return null;
  }

  try {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.warn(`[AI] Backend request failed: ${url} (${response.status})`);
      return null;
    }
    console.log(`[AI] Backend request ok: ${url}`);
    return (await response.json()) as T;
  } catch (error) {
    console.warn(
      `[AI] Backend request threw for ${path}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return null;
  }
}

export async function getBackendDebugSource(): Promise<BackendDebugSource | null> {
  if (!API_BASE_URL) {
    console.warn("[AI] Missing EXPO_PUBLIC_API_BASE_URL. Cannot debug backend source.");
    return null;
  }

  const url = `${API_BASE_URL}/api/debug/source`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[AI] Backend debug request failed: ${url} (${response.status})`);
      return null;
    }
    return (await response.json()) as BackendDebugSource;
  } catch (error) {
    console.warn(
      `[AI] Backend debug request threw: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return null;
  }
}

export async function getReflectionAssist(
  request: ReflectionAssistRequest
): Promise<ReflectionAssistResponse> {
  try {
    const backendResponse = await postToBackend<ReflectionAssistResponse>(
      "/api/ai/reflect",
      request
    );
    if (backendResponse) {
      console.log("[AI] Using backend reflection response.");
      return backendResponse;
    }
    console.warn("[AI] Using local reflection fallback.");

    const suggestedExperiment =
      request.experimentOptions.find((option) =>
        option.parentCapacity.includes("low")
      ) || request.experimentOptions[0];

    if (request.reflectionText?.trim()) {
      return {
        summary:
          "It looks like this moment quickly becomes tense for both of you.",
        themes: ["tension", "stuck pattern"],
        recommendedCapacityLevel: 1,
        suggestedExperimentIds: suggestedExperiment
          ? [suggestedExperiment.id]
          : [],
        encouragement: "Small changes count.",
      };
    }

    return getFallbackResponse();
  } catch {
    return getFallbackResponse();
  }
}

export async function interpretOwnMoment(input: {
  topic?: string;
  momentText: string;
  knownMoments?: string[];
}): Promise<InterpretedMoment> {
  try {
    const backendResponse = await postToBackend<InterpretedMoment>(
      "/api/ai/interpret-moment",
      {
        topic: input.topic,
        momentText: input.momentText,
        knownMoments: input.knownMoments || [],
        prompt: buildMomentInterpretationPrompt(input),
      }
    );

    if (backendResponse) {
      console.log("[AI] Using backend moment interpretation response.");
      return {
        label: backendResponse.label?.trim() || input.momentText,
        topic:
          backendResponse.topic === "Morning routine" ||
          backendResponse.topic === "Screen time" ||
          backendResponse.topic === "Bedtime" ||
          backendResponse.topic === "Homework"
            ? backendResponse.topic
            : "Unknown",
        matchedMoment: backendResponse.matchedMoment?.trim() || "custom",
        summary: backendResponse.summary || "",
        themes: Array.isArray(backendResponse.themes)
          ? backendResponse.themes.slice(0, 3)
          : [],
      };
    }
    console.warn("[AI] Using local moment interpretation fallback.");

    return {
      label: input.momentText,
      topic: "Unknown",
      matchedMoment: "custom",
      summary: "",
      themes: [],
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
    const backendResponse = await postToBackend<ParentOptionsResponse>(
      "/api/ai/interpret-parent-options",
      input
    );
    if (backendResponse) {
      console.log("[AI] Using backend parent-options response.");
      return {
        cleanedOptions: backendResponse.cleanedOptions.slice(0, 3),
        suggestedCarryForward: backendResponse.suggestedCarryForward.slice(0, 2),
      };
    }
    console.warn("[AI] Using local parent-options fallback.");

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

function lowerFirst(text: string) {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function stripLeadingInstruction(text: string) {
  return text
    .replace(/^Try\s+/i, "")
    .replace(/^Focus on\s+/i, "focus on ")
    .replace(/^Use\s+/i, "use ")
    .replace(/^Keep\s+/i, "keep ")
    .replace(/^Make\s+/i, "make ")
    .replace(/^Choose\s+/i, "choose ")
    .replace(/^Start\s+/i, "start ")
    .replace(/^Offer\s+/i, "offer ")
    .replace(/^Reduce\s+/i, "reduce ")
    .replace(/^Acknowledge\s+/i, "acknowledge ")
    .replace(/\.$/, "");
}

function buildLocalAppliedExperimentExample(input: {
  topic?: string;
  moment?: string;
  rawMoment?: string;
  experimentAction: string;
}) {
  const situation = lowerFirst(
    input.rawMoment?.trim() ||
      input.moment?.trim() ||
      input.topic?.trim() ||
      "the hard moment"
  );
  const action = lowerFirst(stripLeadingInstruction(input.experimentAction));

  return `When your child does ${situation}, you ${action}. Keep your words steady and brief so the moment stays simple.`;
}

export async function getAppliedExperimentExample(input: {
  topic?: string;
  moment?: string;
  rawMoment?: string;
  experimentTitle?: string;
  experimentAction: string;
  experimentWhy?: string;
}): Promise<AppliedExperimentExampleResult> {
  try {
    const backendResponse = await postToBackend<{ example: string }>(
      "/api/ai/apply-experiment",
      input
    );

    if (backendResponse?.example?.trim()) {
      console.log("[AI] Using backend applied-experiment response.");
      return {
        example: backendResponse.example.trim(),
        source: "backend",
      };
    }

    console.warn("[AI] Using local applied-experiment fallback.");
    return {
      example: buildLocalAppliedExperimentExample(input),
      source: "fallback",
    };
  } catch {
    return {
      example: buildLocalAppliedExperimentExample(input),
      source: "fallback",
    };
  }
}

function buildLocalShortExperimentFallback(
  request: ShortExperimentRequest
): ShortExperimentResponse {
  const baseOption = request.experimentOptions[0];

  return {
    title: baseOption?.title || "One small calm step",
    whatToDo:
      baseOption?.whatToDo ||
      "Pick one small next step, keep your words brief, and stay steady.",
    script:
      baseOption?.script ||
      "I'm keeping this simple. Here's the next step.",
    whyItWorks:
      baseOption?.whyItWorks ||
      "A smaller, steadier response is often easier for both of you to follow.",
  };
}

export async function getTailoredShortExperiment(
  request: ShortExperimentRequest
): Promise<TailoredShortExperimentResult> {
  console.log("[AI] Short experiment start", {
    apiBaseUrl: API_BASE_URL || "(missing)",
    endpoint: `${API_BASE_URL}/api/ai/short-experiment`,
    hasOptions: request.experimentOptions.length > 0,
    topic: request.topic,
    moment: request.moment,
    ageBand: request.ageBand,
  });

  if (!request.experimentOptions.length) {
    console.warn("[AI] Short experiment skipped: no experiment options available.");
    const fallback = buildLocalShortExperimentFallback(request);
    return {
      ...fallback,
      source: "fallback",
    };
  }

  try {
    const backendResponse = await postToBackend<ShortExperimentResponse>(
      "/api/ai/short-experiment",
      request
    );

    if (
      backendResponse?.title?.trim() &&
      backendResponse?.whatToDo?.trim() &&
      backendResponse?.script?.trim() &&
      backendResponse?.whyItWorks?.trim()
    ) {
      console.log("[AI] Short experiment backend response received.");
      return {
        title: backendResponse.title.trim(),
        whatToDo: backendResponse.whatToDo.trim(),
        script: backendResponse.script.trim(),
        whyItWorks: backendResponse.whyItWorks.trim(),
        source: "backend",
      };
    }

    console.warn("[AI] Short experiment falling back after empty backend response.");
    const fallback = buildLocalShortExperimentFallback(request);
    return {
      ...fallback,
      source: "fallback",
    };
  } catch {
    console.warn("[AI] Short experiment threw before backend response. Falling back.");
    const fallback = buildLocalShortExperimentFallback(request);
    return {
      ...fallback,
      source: "fallback",
    };
  }
}

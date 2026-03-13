import {
    ReflectionAssistRequest,
    ReflectionAssistResponse,
} from "./types";

import { getFallbackResponse } from "./fallback";

export async function getReflectionAssist(
  request: ReflectionAssistRequest
): Promise<ReflectionAssistResponse> {
  try {
    // AI will be connected later via backend
    return getFallbackResponse();
  } catch {
    return getFallbackResponse();
  }
}
import { DurationOption, StoredSession } from "../types/session";

function getRouteType(topic?: string): StoredSession["routeType"] {
  return topic ? "short" : "deepdive";
}

export function createSession(params: {
  topic?: string;
  moment?: string;
  balance?: string;
  reality?: string;
  warmth?: string;
  structure?: string;
  profileQuadrant?: string;
  suggestedDirection?: string;
  experimentId?: string;
  experimentTitle?: string;
  experimentAction?: string;
  experimentWhy?: string;
  reminder?: string;
  supports?: string;
  mantra?: string;
  duration?: DurationOption;
}): StoredSession {
  const {
    topic,
    moment,
    balance,
    reality,
    warmth,
    structure,
    profileQuadrant,
    suggestedDirection,
    experimentId,
    experimentTitle,
    experimentAction,
    experimentWhy,
    reminder,
    supports,
    mantra,
    duration,
  } = params;

  return {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),

    routeType: getRouteType(topic),
    duration,

    topic,
    moment,

    warmth,
    structure,
    balance,
    reality,
    profileQuadrant,
    suggestedDirection,

    experimentId,
    experimentTitle: experimentTitle || "Your experiment",
    experimentAction: experimentAction || "No experiment selected.",
    experimentWhy,

    support: supports,
    mantra,
    reminder,

    followUpStatus: "pending",
  };
}

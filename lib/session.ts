import { DurationOption, StoredSession } from "../types/session";

function getRouteType(topic?: string): StoredSession["routeType"] {
  return topic ? "short" : "deepdive";
}

export function createSession(params: {
  topic?: string;
  moment?: string;
  balance?: string;
  warmth?: string;
  structure?: string;
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
    warmth,
    structure,
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

    experimentTitle: experimentTitle || "Your experiment",
    experimentAction: experimentAction || "No experiment selected.",
    experimentWhy,

    support: supports,
    mantra,
    reminder,

    followUpStatus: "pending",
  };
}

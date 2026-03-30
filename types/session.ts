export type RouteType = "short" | "deepdive";

export type FollowUpStatus = "pending" | "completed" | "skipped";

export type DurationOption = "2" | "5" | "10";

export type StoredSession = {
  id: string;
  createdAt: string;

  routeType: RouteType;
  duration?: DurationOption;

  // Short route
  topic?: string;
  moment?: string;

  // Deep dive route
  reality?: string;
  warmth?: string;
  structure?: string;
  balance?: string;
  profileQuadrant?: string;
  suggestedDirection?: string;

  // Chosen experiment
  experimentId?: string;
  experimentTitle: string;
  experimentAction: string;
  experimentWhy?: string;
  experimentSourceName?: string;
  experimentSourceUrl?: string;
  experimentSourceCitation?: string;

  // Will / support
  support?: string;
  mantra?: string;

  // Reminder choice label
  reminder?: string;

  followUpStatus: FollowUpStatus;
};

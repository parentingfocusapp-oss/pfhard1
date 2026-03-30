export type SessionReport = {
  anonymizedSessionId: string;
  createdAt: string;
  routeType: "short" | "deepdive";
  discussed: string;
  agreedExperiment: string;
  experimentSourceName?: string;
  experimentSourceUrl?: string;
  experimentSourceCitation?: string;
  followUpStatus: string;
};

export type SessionReport = {
  anonymizedSessionId: string;
  createdAt: string;
  routeType: "short" | "deepdive";
  discussed: string;
  agreedExperiment: string;
  followUpStatus: string;
};

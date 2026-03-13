export type SessionReport = {
  sessionId: string;
  createdAt: string;
  routeType: "short" | "deepdive";
  summary: string;
  experimentTitle: string;
  experimentAction: string;
  followUpStatus: string;
};
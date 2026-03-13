import { SessionReport } from "../types/report";
import { StoredSession } from "../types/session";

export function createSessionReport(session: StoredSession): SessionReport {
  const summary =
    session.routeType === "short"
      ? `${session.topic || "General"} - ${session.moment || "Reflection"}`
      : `Warmth: ${session.warmth || "-"}, Structure: ${session.structure || "-"}, Focus: ${session.balance || "-"}`;

  return {
    sessionId: session.id,
    createdAt: session.createdAt,
    routeType: session.routeType,
    summary,
    experimentTitle: session.experimentTitle,
    experimentAction: session.experimentAction,
    followUpStatus: session.followUpStatus,
  };
}
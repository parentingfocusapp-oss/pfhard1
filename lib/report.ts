import { SessionReport } from "../types/report";
import { StoredSession } from "../types/session";

function shortHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0").slice(0, 8);
}

function createAnonymizedSessionId(session: StoredSession): string {
  return `S-${shortHash(`${session.id}:${session.createdAt}`)}`;
}

function getDiscussedSummary(session: StoredSession): string {
  if (session.routeType === "short") {
    return `Topic: ${session.topic || "General"}. Moment discussed: ${session.moment || "Not provided"}.`;
  }

  return `Deep-dive explored. Reality: ${session.reality || "-"}. Moment: ${session.moment || "-"}. Warmth: ${session.warmth || "-"}. Structure: ${session.structure || "-"}. Goal/Focus: ${session.balance || "-"}.`;
}

function getAgreedExperiment(session: StoredSession): string {
  const title = session.experimentTitle || "Your experiment";
  const action = session.experimentAction || "No experiment selected.";
  const why = session.experimentWhy ? ` Why: ${session.experimentWhy}` : "";
  return `${title}: ${action}.${why}`.trim();
}

export function createSessionReport(session: StoredSession): SessionReport {
  return {
    anonymizedSessionId: createAnonymizedSessionId(session),
    createdAt: session.createdAt,
    routeType: session.routeType,
    discussed: getDiscussedSummary(session),
    agreedExperiment: getAgreedExperiment(session),
    followUpStatus: session.followUpStatus,
  };
}

export function createSessionReportText(report: SessionReport): string {
  return [
    `Session: ${report.anonymizedSessionId}`,
    `Date: ${new Date(report.createdAt).toLocaleString()}`,
    `Route: ${report.routeType}`,
    `What was discussed: ${report.discussed}`,
    `Experiment agreed: ${report.agreedExperiment}`,
    `Follow-up status: ${report.followUpStatus}`,
  ].join("\n");
}

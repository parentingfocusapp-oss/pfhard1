import { StoredSession, FollowUpStatus } from "../../types/session";

export interface SessionRepository {
  saveSession(session: StoredSession): Promise<void>;

  getLatestSession(): Promise<StoredSession | null>;

  getAllSessions(): Promise<StoredSession[]>;

  updateFollowUpStatus(
    sessionId: string,
    status: FollowUpStatus
  ): Promise<void>;

  clearAllSessions(): Promise<void>;
}
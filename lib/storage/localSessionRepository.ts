import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoredSession } from "../../types/session";
import { SessionRepository } from "./sessionRepository";

const SESSIONS_KEY = "@parenting-focus/sessions";

async function readSessions(): Promise<StoredSession[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];
    return parsed as StoredSession[];
  } catch (error) {
    console.error("Failed to read sessions", error);
    return [];
  }
}

async function writeSessions(sessions: StoredSession[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Failed to write sessions", error);
    throw error;
  }
}

export const localSessionRepository: SessionRepository = {
  async saveSession(session) {
    const sessions = await readSessions();
    const updated = [session, ...sessions];
    await writeSessions(updated);
  },

  async getLatestSession() {
    const sessions = await readSessions();
    return sessions.length > 0 ? sessions[0] : null;
  },

  async getAllSessions() {
    return await readSessions();
  },

  async updateFollowUpStatus(sessionId, status) {
    const sessions = await readSessions();

    const updated = sessions.map((session) =>
      session.id === sessionId
        ? { ...session, followUpStatus: status }
        : session
    );

    await writeSessions(updated);
  },

  async clearAllSessions() {
    await AsyncStorage.removeItem(SESSIONS_KEY);
  },
};
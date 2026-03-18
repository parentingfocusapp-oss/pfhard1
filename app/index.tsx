import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { sessionRepository } from "../lib/storage";
import { StoredSession } from "../types/session";

export default function IndexScreen() {
  const [latestSession, setLatestSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    async function loadSession() {
      const session = await sessionRepository.getLatestSession();

      if (session && session.followUpStatus === "pending") {
        setLatestSession(session);
      }
    }

    loadSession();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: WarmTheme.bg,
      }}
    >
      {latestSession ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: WarmTheme.border,
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
            backgroundColor: WarmTheme.surface,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 8,
              color: WarmTheme.text,
            }}
          >
            Continue from last plan
          </Text>

          <Text style={{ marginBottom: 8, color: WarmTheme.mutedText }}>
            Last time you planned to try:
          </Text>

          <Text style={{ fontWeight: "500", marginBottom: 12, color: WarmTheme.text }}>
            {latestSession.experimentTitle}
          </Text>

          <Text style={{ marginBottom: 16, color: WarmTheme.mutedText }}>
            {latestSession.experimentAction}
          </Text>

          <Button
            title="Follow up"
            onPress={() =>
              router.push({
                pathname: "/followup",
                params: { sessionId: latestSession.id },
              })
            }
          />
        </View>
      ) : null}

      <Text
        style={{
          fontSize: 22,
          fontWeight: "600",
          marginBottom: 16,
          color: WarmTheme.text,
        }}
      >
        How much time have you got?
      </Text>

      <Button
        title="2 minutes"
        onPress={() =>
          router.push({
            pathname: "/focus",
            params: { duration: "2" },
          })
        }
      />

      <View style={{ height: 12 }} />

      <Button
        title="5 minutes"
        onPress={() =>
          router.push({
            pathname: "/focus",
            params: { duration: "5" },
          })
        }
      />

      <View style={{ height: 12 }} />

      <Button
        title="10 minutes"
        onPress={() =>
          router.push({
            pathname: "/focus",
            params: { duration: "10" },
          })
        }
      />

      <View style={{ height: 20 }} />

      <Button title="View reports" onPress={() => router.push("/report")} />
    </View>
  );
}

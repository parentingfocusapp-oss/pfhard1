import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { sessionRepository } from "../lib/storage";
import { AgeBand } from "../types/experiment";
import { StoredSession } from "../types/session";

const ageBandOptions: { label: string; value: AgeBand }[] = [
  { label: "3-5", value: "3-5" },
  { label: "6-10", value: "6-10" },
  { label: "11-16", value: "11-16" },
];

export default function IndexScreen() {
  const [latestSession, setLatestSession] = useState<StoredSession | null>(null);
  const [ageBand, setAgeBand] = useState<AgeBand | undefined>();

  useEffect(() => {
    async function loadSession() {
      const session = await sessionRepository.getLatestSession();

      if (session && session.followUpStatus === "pending") {
        setLatestSession(session);
      }
    }

    loadSession();
  }, []);

  function startSession(duration: "2" | "5" | "10") {
    router.push({
      pathname: "/focus",
      params: {
        duration,
        ageBand: ageBand || "",
      },
    });
  }

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

      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 10,
          color: WarmTheme.text,
        }}
      >
        How old is your child?
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: 20,
          gap: 10,
        }}
      >
        {ageBandOptions.map((option) => {
          const isSelected = ageBand === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() =>
                setAgeBand((current) => (current === option.value ? undefined : option.value))
              }
              style={{
                borderWidth: 1,
                borderColor: isSelected ? WarmTheme.accent : WarmTheme.border,
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 8,
                backgroundColor: isSelected ? WarmTheme.surfaceAlt : WarmTheme.surface,
              }}
            >
              <Text
                style={{
                  color: isSelected ? WarmTheme.accent : WarmTheme.text,
                  fontWeight: "600",
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        title="2 minutes"
        onPress={() => startSession("2")}
      />

      <View style={{ height: 12 }} />

      <Button
        title="5 minutes"
        onPress={() => startSession("5")}
      />

      <View style={{ height: 12 }} />

      <Button
        title="10 minutes"
        onPress={() => startSession("10")}
      />

      <View style={{ height: 20 }} />

      <Button title="View reports" onPress={() => router.push("/report")} />
    </View>
  );
}

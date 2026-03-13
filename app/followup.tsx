import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { sessionRepository } from "../lib/storage";
import { StoredSession } from "../types/session";

type Step =
  | "loading"
  | "tried"
  | "outcome"
  | "message"
  | "next"
  | "notYetReason"
  | "notYetOptions"
  | "explain";

type Outcome = "better" | "same" | "worse" | "notyet" | "";
type NotYetReason = "time" | "hard" | "fit" | "forgot" | "";

export default function FollowupScreen() {
  const { sessionId, experiment } = useLocalSearchParams<{
    sessionId?: string;
    experiment?: string;
  }>();

  const [step, setStep] = useState<Step>("loading");
  const [outcome, setOutcome] = useState<Outcome>("");
  const [notYetReason, setNotYetReason] = useState<NotYetReason>("");
  const [session, setSession] = useState<StoredSession | null>(null);

  useEffect(() => {
    async function loadSession() {
      if (!sessionId) {
        setStep("tried");
        return;
      }

      const sessions = await sessionRepository.getAllSessions();
      const found = sessions.find((item) => item.id === sessionId) || null;
      setSession(found);
      setStep("tried");
    }

    loadSession();
  }, [sessionId]);

  const experimentTitle =
    session?.experimentTitle || experiment || "Your experiment";

  const experimentAction =
    session?.experimentAction || "No experiment selected.";

  async function markCompleted() {
    if (!session?.id) return;
    await sessionRepository.updateFollowUpStatus(session.id, "completed");
  }

  function goToAlternative() {
    if (!session) return;

    router.push({
      pathname: "/experiment",
      params: {
        topic: session.topic,
        moment: session.moment,
        warmth: session.warmth,
        structure: session.structure,
        balance: session.balance,
        duration: session.duration,
        followupMode: "alternative",
        sessionId: session.id,
      },
    });
  }

  function goToReminder() {
    if (!session) return;

    router.push({
      pathname: "/reminder",
      params: {
        topic: session.topic || "",
        moment: session.moment || "",
        balance: session.balance || "",
        warmth: session.warmth || "",
        structure: session.structure || "",
        experimentTitle: session.experimentTitle,
        experimentAction: session.experimentAction,
        experimentWhy: session.experimentWhy || "",
        duration: session.duration || "",
      },
    });
  }

  if (step === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text>Loading follow-up...</Text>
      </View>
    );
  }

  if (step === "explain") {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
          Here it is again
        </Text>

        <Text style={{ marginBottom: 16 }}>
          You do not need to do it perfectly. The aim is just to try it once in
          a real moment.
        </Text>

        <Text
          style={{
            borderWidth: 1,
            borderColor: "#999",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          {experimentTitle}
          {"\n\n"}
          {experimentAction}
        </Text>

        <Button title="Set a reminder" onPress={goToReminder} />

        <View style={{ height: 12 }} />

        <Button title="Back" onPress={() => setStep("notYetOptions")} />
      </View>
    );
  }

  if (step === "notYetOptions") {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
          That makes sense
        </Text>

        <Text style={{ marginBottom: 24 }}>
          Let’s make the next step easier.
        </Text>

        {(notYetReason === "time" || notYetReason === "forgot") && (
          <>
            <Button title="Keep it and set a reminder" onPress={goToReminder} />

            <View style={{ height: 12 }} />

            <Button title="Explain it again" onPress={() => setStep("explain")} />

            <View style={{ height: 12 }} />
          </>
        )}

        {notYetReason === "hard" && (
          <>
            <Button title="Adapt this" onPress={goToAlternative} />

            <View style={{ height: 12 }} />

            <Button title="Explain it again" onPress={() => setStep("explain")} />

            <View style={{ height: 12 }} />
          </>
        )}

        {notYetReason === "fit" && (
          <>
            <Button title="Change it" onPress={goToAlternative} />

            <View style={{ height: 12 }} />
          </>
        )}

        <Button
          title="Start a fresh reflection"
          onPress={async () => {
            await markCompleted();
            router.replace("/");
          }}
        />

        <View style={{ height: 12 }} />

        <Button title="Back" onPress={() => setStep("notYetReason")} />
      </View>
    );
  }

  if (step === "notYetReason") {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
          What got in the way?
        </Text>

        <Button
          title="No time or wrong moment"
          onPress={() => {
            setNotYetReason("time");
            setStep("notYetOptions");
          }}
        />

        <View style={{ height: 12 }} />

        <Button
          title="It felt too hard to get started"
          onPress={() => {
            setNotYetReason("hard");
            setStep("notYetOptions");
          }}
        />

        <View style={{ height: 12 }} />

        <Button
          title="It didn’t feel like the right fit"
          onPress={() => {
            setNotYetReason("fit");
            setStep("notYetOptions");
          }}
        />

        <View style={{ height: 12 }} />

        <Button
          title="I forgot"
          onPress={() => {
            setNotYetReason("forgot");
            setStep("notYetOptions");
          }}
        />

        <View style={{ height: 12 }} />

        <Button title="Back" onPress={() => setStep("tried")} />
      </View>
    );
  }

  if (step === "message") {
    let message = "Nice work checking back in.";

    if (outcome === "same") {
      message =
        "That’s still useful information. You’re learning what your family needs.";
    } else if (outcome === "worse") {
      message =
        "That sounds hard. Trying something new still takes effort, and that matters.";
    }

    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
          Check-in complete
        </Text>

        <Text style={{ marginBottom: 16 }}>{message}</Text>

        <Text
          style={{
            borderWidth: 1,
            borderColor: "#999",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          {experimentTitle}
          {"\n\n"}
          {experimentAction}
        </Text>

        <Button
          title="Start a fresh reflection"
          onPress={async () => {
            await markCompleted();
            router.replace("/");
          }}
        />
      </View>
    );
  }

  if (step === "next") {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
          That’s encouraging
        </Text>

        <Text style={{ marginBottom: 16 }}>
          Something helped. What would you like to do next?
        </Text>

        <Text
          style={{
            borderWidth: 1,
            borderColor: "#999",
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
          }}
        >
          {experimentTitle}
          {"\n\n"}
          {experimentAction}
        </Text>

        <Button
          title="Keep this experiment"
          onPress={async () => {
            await markCompleted();
            router.replace("/");
          }}
        />

        <View style={{ height: 12 }} />

        <Button
          title="Build on this"
          onPress={() => {
            if (!session) return;

            router.push({
              pathname: "/experiment",
              params: {
                topic: session.topic,
                moment: session.moment,
                warmth: session.warmth,
                structure: session.structure,
                balance: session.balance,
                duration: session.duration,
                followupMode: "build",
                sessionId: session.id,
              },
            });
          }}
        />

        <View style={{ height: 12 }} />

        <Button
          title="Try another idea for this area"
          onPress={goToAlternative}
        />

        <View style={{ height: 12 }} />

        <Button
          title="Start a fresh reflection"
          onPress={async () => {
            await markCompleted();
            router.replace("/");
          }}
        />

        <View style={{ height: 12 }} />

        <Button title="Back" onPress={() => setStep("outcome")} />
      </View>
    );
  }

  if (step === "outcome") {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
          How did it go?
        </Text>

        <Button
          title="Better"
          onPress={() => {
            setOutcome("better");
            setStep("next");
          }}
        />

        <View style={{ height: 12 }} />

        <Button
          title="Same"
          onPress={() => {
            setOutcome("same");
            setStep("message");
          }}
        />

        <View style={{ height: 12 }} />

        <Button
          title="Worse"
          onPress={() => {
            setOutcome("worse");
            setStep("message");
          }}
        />

        <View style={{ height: 12 }} />

        <Button title="Back" onPress={() => setStep("tried")} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
        Did you try the experiment?
      </Text>

      <Text style={{ marginBottom: 16 }}>{experimentTitle}</Text>

      <Text style={{ marginBottom: 24 }}>{experimentAction}</Text>

      <Button title="Yes" onPress={() => setStep("outcome")} />

      <View style={{ height: 12 }} />

      <Button
        title="Not yet"
        onPress={() => {
          setOutcome("notyet");
          setStep("notYetReason");
        }}
      />

      <View style={{ height: 12 }} />

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}
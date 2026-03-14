import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";
import { DurationOption } from "../types/session";

export default function BalanceScreen() {
  const { topic, moment, warmth, structure, duration } = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    warmth?: string;
    structure?: string;
    duration?: DurationOption;
  }>();

  const summary = getBalanceSummary(warmth || "", structure || "");
  const balance = getBalanceType(warmth || "", structure || "");

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 20 }}>
        Looking at the bigger picture
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 16 }}>{summary}</Text>

      <Button
        title="Continue"
        onPress={() =>
          router.push({
            pathname: "/options",
            params: {
              topic: topic || "",
              moment: moment || "",
              balance,
              warmth: warmth || "",
              structure: structure || "",
              duration: duration || "10",
            },
          })
        }
      />
    </View>
  );
}

function getBalanceType(warmth: string, structure: string) {
  if (warmth === "low" && structure === "low") return "both";
  if (warmth === "low" && (structure === "high" || structure === "medium")) {
    return "warmth";
  }
  if ((warmth === "high" || warmth === "medium") && structure === "low") {
    return "structure";
  }
  if (warmth === "mixed" || structure === "mixed") return "depends";
  return "both";
}

function getBalanceSummary(warmth: string, structure: string) {
  if (warmth === "low" && structure === "low") {
    return "Right now, both connection and structure may need support. A small step that combines warmth and clarity may help most.";
  }

  if (warmth === "low" && (structure === "high" || structure === "medium")) {
    return "There may already be some structure here, but the relationship side may need more attention first. A small increase in warmth could make guidance easier to hear.";
  }

  if ((warmth === "high" || warmth === "medium") && structure === "low") {
    return "There seems to be some connection here already, but expectations may need to become clearer and more consistent. A small step in structure may help.";
  }

  if (warmth === "mixed" || structure === "mixed") {
    return "This looks more situation-dependent. It may help to pause and ask in the moment whether your child needs more connection, more clarity, or both.";
  }

  return "There are strengths here already. The next step may be a small adjustment that brings warmth and structure together more consistently.";
}
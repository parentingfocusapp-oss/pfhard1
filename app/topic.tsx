import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";

export default function TopicScreen() {
  const { duration } = useLocalSearchParams<{ duration?: string }>();

  function goToMoment(topic: string) {
    router.push({
      pathname: "/moment",
      params: {
        topic,
        duration: duration || "",
      },
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 20 }}>
        Choose a topic
      </Text>

      <Button title="Morning routine" onPress={() => goToMoment("Morning routine")} />
      <Button title="Screen time" onPress={() => goToMoment("Screen time")} />
      <Button title="Bedtime" onPress={() => goToMoment("Bedtime")} />
      <Button title="Homework" onPress={() => goToMoment("Homework")} />

      <View style={{ marginTop: 20 }}>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    </View>
  );
}
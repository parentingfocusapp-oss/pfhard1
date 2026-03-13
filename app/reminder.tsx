import { router, useLocalSearchParams } from "expo-router";
import { Alert, Button, Text, View } from "react-native";

export default function ReminderScreen() {
  const {
    topic,
    moment,
    balance,
    warmth,
    structure,
    experimentTitle,
    experimentAction,
    experimentWhy,
    supports,
    mantra,
    index,
    duration,
  } = useLocalSearchParams<{
    topic?: string;
    moment?: string;
    balance?: string;
    warmth?: string;
    structure?: string;
    experimentTitle?: string;
    experimentAction?: string;
    experimentWhy?: string;
    supports?: string;
    mantra?: string;
    index?: string;
    duration?: string;
  }>();

  function goToClosing(reminder: string) {
    Alert.alert("Reminder chosen", reminder);

    router.push({
      pathname: "/closing",
      params: {
        topic: topic || "",
        moment: moment || "",
        balance: balance || "",
        warmth: warmth || "",
        structure: structure || "",
        experimentTitle: experimentTitle || "",
        experimentAction: experimentAction || "",
        experimentWhy: experimentWhy || "",
        supports: supports || "",
        mantra: mantra || "",
        index: index || "",
        reminder,
        duration: duration || "",
      },
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16 }}>
        When would you like to try this?
      </Text>

      <Button title="In 2 hours" onPress={() => goToClosing("In 2 hours")} />
      <View style={{ height: 12 }} />

      <Button title="Next morning" onPress={() => goToClosing("Next morning")} />
      <View style={{ height: 12 }} />

      <Button title="Next evening" onPress={() => goToClosing("Next evening")} />
      <View style={{ height: 12 }} />

      <Button title="In two days" onPress={() => goToClosing("In two days")} />
      <View style={{ height: 12 }} />

      <Button
        title="I'll check back in myself"
        onPress={() => goToClosing("Self check-in")}
      />
    </View>
  );
}
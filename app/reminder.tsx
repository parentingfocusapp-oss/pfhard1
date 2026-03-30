import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import {
  ReminderOption,
  notificationsAreAvailable,
  requestNotificationPermissionsAsync,
  scheduleReminderNotificationAsync,
} from "@/lib/notifications";

type PickerMode = "date" | "time";

type DateTimePickerEvent = {
  type: "set" | "dismissed" | "neutralButtonPressed";
};

type DateTimePickerProps = {
  value: Date;
  mode: PickerMode;
  display?: "default" | "spinner" | "clock" | "calendar";
  minimumDate?: Date;
  is24Hour?: boolean;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
};

function getDateTimePickerComponent(): React.ComponentType<DateTimePickerProps> | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const module = require("@react-native-community/datetimepicker");
    return module.default as React.ComponentType<DateTimePickerProps>;
  } catch {
    return null;
  }
}

function formatCustomReminder(date: Date) {
  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function createInitialCustomDate() {
  const date = new Date();
  date.setHours(date.getHours() + 1, 0, 0, 0);
  return date;
}

function mergeCustomDate(current: Date, nextValue: Date, mode: PickerMode) {
  const updated = new Date(current);

  if (mode === "date") {
    updated.setFullYear(
      nextValue.getFullYear(),
      nextValue.getMonth(),
      nextValue.getDate()
    );
  } else {
    updated.setHours(nextValue.getHours(), nextValue.getMinutes(), 0, 0);
  }

  return updated;
}

export default function ReminderScreen() {
  const {
    topic,
    moment,
    balance,
    warmth,
    structure,
    reality,
    profileQuadrant,
    suggestedDirection,
    experimentId,
    experimentTitle,
    experimentAction,
    experimentWhy,
    experimentSourceName,
    experimentSourceUrl,
    experimentSourceCitation,
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
    reality?: string;
    profileQuadrant?: string;
    suggestedDirection?: string;
    experimentId?: string;
    experimentTitle?: string;
    experimentAction?: string;
    experimentWhy?: string;
    experimentSourceName?: string;
    experimentSourceUrl?: string;
    experimentSourceCitation?: string;
    supports?: string;
    mantra?: string;
    index?: string;
    duration?: string;
  }>();

  const DateTimePicker = useMemo(() => getDateTimePickerComponent(), []);
  const hasNativeNotifications = notificationsAreAvailable();

  const [isScheduling, setIsScheduling] = useState(false);
  const [customDate, setCustomDate] = useState(createInitialCustomDate);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [androidPickerMode, setAndroidPickerMode] = useState<PickerMode>("date");

  function goToClosing(reminder: string) {
    router.push({
      pathname: "/closing",
      params: {
        topic: topic || "",
        moment: moment || "",
        balance: balance || "",
        warmth: warmth || "",
        structure: structure || "",
        reality: reality || "",
        profileQuadrant: profileQuadrant || "",
        suggestedDirection: suggestedDirection || "",
        experimentId: experimentId || "",
        experimentTitle: experimentTitle || "",
        experimentAction: experimentAction || "",
        experimentWhy: experimentWhy || "",
        experimentSourceName: experimentSourceName || "",
        experimentSourceUrl: experimentSourceUrl || "",
        experimentSourceCitation: experimentSourceCitation || "",
        supports: supports || "",
        mantra: mantra || "",
        index: index || "",
        reminder,
        duration: duration || "",
      },
    });
  }

  async function scheduleReminder(params: {
    reminderLabel: string;
    preset?: ReminderOption;
    triggerDate?: Date;
  }) {
    try {
      setIsScheduling(true);

      const permission = await requestNotificationPermissionsAsync();

      if (!permission.available) {
        Alert.alert(
          "Notifications not available",
          "This build does not include the notifications native module yet. Rebuild the app to enable phone reminders."
        );
        return;
      }

      if (!permission.granted) {
        Alert.alert(
          "Notifications are off",
          "Please enable notifications for this app if you want phone reminders."
        );
        return;
      }

      await scheduleReminderNotificationAsync({
        reminderLabel: params.reminderLabel,
        reminder: params.preset,
        triggerDate: params.triggerDate,
        experimentTitle,
        experimentAction,
      });

      Alert.alert(
        "Reminder scheduled",
        `We'll remind you ${params.reminderLabel.toLowerCase()}.`
      );
      goToClosing(params.reminderLabel);
    } catch {
      Alert.alert(
        "Could not schedule reminder",
        "Something went wrong while creating the phone reminder."
      );
    } finally {
      setIsScheduling(false);
    }
  }

  function updateCustomDate(nextValue: Date, mode: PickerMode) {
    setCustomDate((current) => mergeCustomDate(current, nextValue, mode));
  }

  function handleAndroidPickerChange(
    event: DateTimePickerEvent,
    selectedValue?: Date
  ) {
    if (event.type === "dismissed") {
      setShowCustomPicker(false);
      setAndroidPickerMode("date");
      return;
    }

    if (!selectedValue) return;

    const nextCustomDate = mergeCustomDate(
      customDate,
      selectedValue,
      androidPickerMode
    );

    setCustomDate(nextCustomDate);

    if (androidPickerMode === "date") {
      setAndroidPickerMode("time");
      return;
    }

    setShowCustomPicker(false);
    setAndroidPickerMode("date");
    confirmCustomReminder(nextCustomDate);
  }

  function confirmCustomReminder(selectedDate: Date = customDate) {
    if (selectedDate.getTime() <= Date.now()) {
      Alert.alert(
        "Choose a future time",
        "Please pick a date and time that is still ahead."
      );
      return;
    }

    void scheduleReminder({
      reminderLabel: `at ${formatCustomReminder(selectedDate)}`,
      triggerDate: selectedDate,
    });
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: WarmTheme.bg,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 16, color: WarmTheme.text }}>
        When do you want to reflect on this?
      </Text>

      <Button
        title={isScheduling ? "Scheduling..." : "Next morning"}
        onPress={() =>
          void scheduleReminder({
            reminderLabel: "Next morning",
            preset: "Next morning",
          })
        }
        disabled={isScheduling}
      />
      <View style={{ height: 12 }} />

      <Button
        title={isScheduling ? "Scheduling..." : "Next evening"}
        onPress={() =>
          void scheduleReminder({
            reminderLabel: "Next evening",
            preset: "Next evening",
          })
        }
        disabled={isScheduling}
      />
      <View style={{ height: 12 }} />

      <Button
        title={isScheduling ? "Scheduling..." : "In two days"}
        onPress={() =>
          void scheduleReminder({
            reminderLabel: "In two days",
            preset: "In two days",
          })
        }
        disabled={isScheduling}
      />
      <View style={{ height: 12 }} />

      <Button
        title={isScheduling ? "Scheduling..." : "In 5 days"}
        onPress={() =>
          void scheduleReminder({
            reminderLabel: "In 5 days",
            preset: "In 5 days",
          })
        }
        disabled={isScheduling}
      />
      <View style={{ height: 20 }} />

      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: WarmTheme.text }}>
        Custom time
      </Text>

      <Text style={{ marginBottom: 12, color: WarmTheme.mutedText }}>{formatCustomReminder(customDate)}</Text>

      {DateTimePicker ? (
        <>
          <Button
            title={showCustomPicker ? "Hide custom time" : "Choose custom time"}
            onPress={() => {
              setAndroidPickerMode("date");
              setShowCustomPicker((current) => !current);
            }}
            disabled={isScheduling}
          />

          {showCustomPicker ? (
            <View style={{ marginTop: 16, marginBottom: 20 }}>
              {Platform.OS === "ios" ? (
                <>
                  <DateTimePicker
                    value={customDate}
                    mode="date"
                    display="spinner"
                    minimumDate={new Date()}
                    onChange={(_, selectedValue) => {
                      if (selectedValue) {
                        updateCustomDate(selectedValue, "date");
                      }
                    }}
                  />
                  <DateTimePicker
                    value={customDate}
                    mode="time"
                    display="spinner"
                    onChange={(_, selectedValue) => {
                      if (selectedValue) {
                        updateCustomDate(selectedValue, "time");
                      }
                    }}
                  />
                </>
              ) : (
                <DateTimePicker
                  value={customDate}
                  mode={androidPickerMode}
                  minimumDate={
                    androidPickerMode === "date" ? new Date() : undefined
                  }
                  is24Hour={false}
                  onChange={handleAndroidPickerChange}
                />
              )}

              {Platform.OS === "ios" ? (
                <>
                  <View style={{ height: 12 }} />
                  <Button
                    title={isScheduling ? "Scheduling..." : "Use this custom time"}
                    onPress={() => confirmCustomReminder()}
                    disabled={isScheduling}
                  />
                </>
              ) : null}
            </View>
          ) : null}

          {Platform.OS !== "ios" && showCustomPicker ? (
            <>
              <Button
                title={isScheduling ? "Scheduling..." : "Use this custom time"}
                onPress={() => confirmCustomReminder()}
                disabled={isScheduling}
              />
              <View style={{ height: 12 }} />
            </>
          ) : null}
        </>
      ) : (
        <Text style={{ marginBottom: 20, color: WarmTheme.mutedText }}>
          Custom time needs a rebuilt app before the native date picker is
          available.
        </Text>
      )}

      {!hasNativeNotifications ? (
        <Text style={{ marginBottom: 20, color: WarmTheme.mutedText }}>
          Phone reminders need a rebuilt app before native notifications are
          available.
        </Text>
      ) : null}

      <Button
        title="I'll check back in myself"
        onPress={() => goToClosing("Self check-in")}
        disabled={isScheduling}
      />
    </ScrollView>
  );
}

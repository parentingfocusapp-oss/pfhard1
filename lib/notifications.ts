import { Platform } from "react-native";

export type ReminderOption =
  | "Next morning"
  | "Next evening"
  | "In two days"
  | "In 5 days";

const REMINDER_CHANNEL_ID = "parenting-reminders";

let notificationHandlerInitialized = false;

function getNotificationsModule() {
  try {
    return require("expo-notifications");
  } catch {
    return null;
  }
}

export function notificationsAreAvailable() {
  return getNotificationsModule() !== null;
}

function ensureNotificationHandler() {
  const Notifications = getNotificationsModule();

  if (!Notifications || notificationHandlerInitialized) {
    return Notifications;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  notificationHandlerInitialized = true;
  return Notifications;
}

export async function initializeNotificationsAsync() {
  const Notifications = ensureNotificationHandler();

  if (!Notifications) return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: "Parenting reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

export async function requestNotificationPermissionsAsync() {
  if (Platform.OS === "web") {
    return { granted: false, available: false };
  }

  const Notifications = ensureNotificationHandler();

  if (!Notifications) {
    return { granted: false, available: false };
  }

  const current = await Notifications.getPermissionsAsync();

  if (
    current.granted ||
    current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return { granted: true, available: true };
  }

  const requested = await Notifications.requestPermissionsAsync();

  return {
    granted:
      requested.granted ||
      requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL,
    available: true,
  };
}

function atNextHour(hour: number) {
  const date = new Date();
  date.setSeconds(0, 0);
  date.setHours(hour, 0, 0, 0);

  if (date.getTime() <= Date.now()) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

function buildTriggerDate(option: ReminderOption) {
  const date = new Date();

  switch (option) {
    case "Next morning":
      return atNextHour(8);
    case "Next evening":
      return atNextHour(18);
    case "In two days":
      date.setDate(date.getDate() + 2);
      date.setHours(9, 0, 0, 0);
      return date;
    case "In 5 days":
      date.setDate(date.getDate() + 5);
      date.setHours(9, 0, 0, 0);
      return date;
  }
}

export async function scheduleReminderNotificationAsync(params: {
  reminderLabel: string;
  reminder?: ReminderOption;
  triggerDate?: Date;
  experimentTitle?: string;
  experimentAction?: string;
}) {
  const Notifications = ensureNotificationHandler();

  if (!Notifications) {
    throw new Error("Notifications native module is unavailable.");
  }

  const triggerDate =
    params.triggerDate ??
    (params.reminder ? buildTriggerDate(params.reminder) : undefined);

  if (!triggerDate) {
    throw new Error("A reminder option or trigger date is required.");
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: params.experimentTitle?.trim() || "Parenting reminder",
      body:
        params.experimentAction?.trim() ||
        "Take a small step with the experiment you chose.",
      sound: "default",
      data: {
        reminder: params.reminderLabel,
      },
    },
    trigger:
      Platform.OS === "android"
        ? {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            channelId: REMINDER_CHANNEL_ID,
            date: triggerDate,
          }
        : {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
  });
}

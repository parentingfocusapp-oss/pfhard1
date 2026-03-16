import { Stack } from "expo-router";
import { useEffect } from "react";
import { initializeNotificationsAsync } from "@/lib/notifications";

export default function Layout() {
  useEffect(() => {
    void initializeNotificationsAsync();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}

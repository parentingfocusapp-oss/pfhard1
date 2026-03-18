import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { WarmTheme } from "../constants/warmTheme";
import { DurationOption } from "../types/session";

const introText =
  "Every family has lots of different problems at any time, and that can feel overwhelming.";
const focusText =
  "For now, think of just one situation that has kept on coming up recently.";

export default function FocusScreen() {
  const { duration } = useLocalSearchParams<{ duration?: DurationOption }>();

  const [introLength, setIntroLength] = useState(0);
  const [focusLength, setFocusLength] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (introLength < introText.length) {
      const timer = setTimeout(() => {
        setIntroLength((current) => current + 1);
      }, 28);

      return () => clearTimeout(timer);
    }

    if (focusLength < focusText.length) {
      const timer = setTimeout(() => {
        setFocusLength((current) => current + 1);
      }, 28);

      return () => clearTimeout(timer);
    }

    if (!showButton) {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [focusLength, introLength, showButton]);

  const typedIntro = useMemo(
    () => introText.slice(0, introLength),
    [introLength]
  );

  const typedFocus = useMemo(
    () => focusText.slice(0, focusLength),
    [focusLength]
  );
  const isComplete =
    introLength >= introText.length && focusLength >= focusText.length;

  function finishTyping() {
    setIntroLength(introText.length);
    setFocusLength(focusText.length);
    setShowButton(true);
  }

  function continueWithFocus() {
    router.push({
      pathname: duration === "10" ? "/deepdive" : "/topic",
      params: {
        duration: duration || "2",
      },
    });
  }

  return (
    <Pressable
      onPress={() => {
        if (!isComplete || !showButton) {
          finishTyping();
        }
      }}
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: WarmTheme.bg,
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: WarmTheme.border,
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          backgroundColor: WarmTheme.surface,
          minHeight: 250,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            marginBottom: 18,
            color: WarmTheme.text,
            textAlign: "left",
          }}
        >
          Hi!
        </Text>

        <Text
          style={{
            fontSize: 19,
            lineHeight: 30,
            color: WarmTheme.mutedText,
            textAlign: "left",
            marginBottom: 18,
          }}
        >
          {typedIntro}
        </Text>

        <Text
          style={{
            fontSize: 20,
            lineHeight: 32,
            color: WarmTheme.text,
            textAlign: "left",
          }}
        >
          {typedFocus.split("just one")[0]}
          {typedFocus.includes("just one") ? (
            <Text style={{ color: WarmTheme.accent, fontWeight: "700" }}>
              just one
            </Text>
          ) : null}
          {typedFocus.includes("just one")
            ? typedFocus.split("just one")[1]
            : typedFocus}
        </Text>
      </View>

      {showButton ? (
        <Pressable
          onPress={continueWithFocus}
          style={{
            borderRadius: 10,
            paddingVertical: 14,
            paddingHorizontal: 18,
            alignItems: "center",
            backgroundColor: WarmTheme.accent,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            OK, I&apos;ve got one
          </Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

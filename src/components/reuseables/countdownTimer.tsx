import React, { useEffect, useState, useRef, useCallback } from "react";
import { Text, View, StyleSheet, AppState, AppStateStatus } from "react-native";
import useTheme from "../../hooks/useThemes";
import { useIsFocused } from "@react-navigation/native";
import { FONT_SIZES } from "../../constants/sizes";

interface TimerProps {
  minutes?: number;
  mode?: "down" | "up";
  textColor?: string;
  onFinish?: () => void;
}

const Timer: React.FC<TimerProps> = ({
  minutes = 1,
  mode = "down",
  textColor,
  onFinish,
}) => {
  const { colors } = useTheme();
  const appState = useRef(AppState.currentState);

  const startTime = useRef(Date.now()).current;
  const endTime = useRef(Date.now() + minutes * 60 * 1000).current;

  const [displayTime, setDisplayTime] = useState<number>(
    mode === "down" ? minutes * 60 : 0
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    // If the screen isn't focused, don't start the interval
    if (!isFocused) return;

    const interval = setInterval(calculateTime, 1000);

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          calculateTime();
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [mode, isFocused]);

  // Timer.tsx

  const calculateTime = useCallback(() => {
    // FINAL GUARD: If the screen lost focus while this was queued, stop.
    if (!isFocused) return;

    const now = Date.now();
    if (mode === "down") {
      const diff = Math.max(0, Math.floor((endTime - now) / 1000));

      // Only fire if screen is active and time just hit zero
      if (diff === 0 && displayTime > 0) {
        onFinish?.();
      }
      setDisplayTime(diff);
    } else {
      const diff = Math.floor((now - startTime) / 1000);
      setDisplayTime(diff);
    }
  }, [isFocused, displayTime, mode, endTime, startTime, onFinish]);

  const format = (n: number): string => String(n).padStart(2, "0");
  const mins = Math.floor(displayTime / 60);
  const secs = displayTime % 60;

  return (
    <View style={styles.container}>
      <Text style={[styles.timeText, { color: textColor || colors.titleText }]}>
        {format(mins)} : {format(secs)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontSize: FONT_SIZES.HERO,
    fontWeight: "600",
    letterSpacing: 2,
  },
});

export default Timer;

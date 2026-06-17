import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../hooks/useThemes";

export default function SafeArea() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{
        backgroundColor: colors.surfacePrimary,
      }}
    />
  );
}

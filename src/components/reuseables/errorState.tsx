import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import Buttons from "../buttons/buttons";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onBack: () => void;
  onRetry?: () => void;
};

/** Full-screen "could not load" state with a way out (Back) instead of an endless skeleton. */
export default function ErrorState({
  title = "Something went wrong",
  message = "We could not load this. Please try again.",
  onBack,
  onRetry,
}: ErrorStateProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.surfacePrimary,
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Text
          style={[
            commonStyling.title,
            { fontSize: 20, fontFamily: "Bold", textAlign: "center" },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            commonStyling.subtitle,
            { fontSize: 14, textAlign: "center", marginTop: 8 },
          ]}
        >
          {message}
        </Text>
      </View>
      {onRetry && (
        <View style={{ marginBottom: 12 }}>
          <Buttons title="Try Again" onPress={onRetry} />
        </View>
      )}
      <Buttons
        title="Back"
        type={onRetry ? "outline" : "primary"}
        onPress={onBack}
      />
    </SafeAreaView>
  );
}

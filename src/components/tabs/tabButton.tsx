import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";

interface TabButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export default function TabButton({ label, active, onPress }: TabButtonProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  return (
    <TouchableOpacity
      style={[
        styles.button,
        active && {
          backgroundColor: colors.surfacePrimary,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          commonStyling.subtitle,
          {
            color: colors.inputText,
            textAlign: "center",
          },
          active && {
            color: colors.titleText,
          },
          ,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 40,
    width: "50%",
  },
});

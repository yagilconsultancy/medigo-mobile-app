import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useTheme from "../../hooks/useThemes";
import { commonStyles } from "../../styles/commonStyles";
import { FONT_SIZES } from "../../constants/sizes";

export interface RadioItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function RadioItem({
  label,
  selected,
  onPress,
}: RadioItemProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.lightGray,
          borderColor: colors.gray,
          borderWidth: 1,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.inner}>
        {/* Radio Outer Circle */}
        <View
          style={[
            styles.radioOuter,
            selected && styles.radioOuterActive,
            { borderColor: selected ? colors.spotBlue : colors.gray },
          ]}
        >
          {selected && (
            <View
              style={[styles.radioInner, { backgroundColor: colors.spotBlue }]}
            />
          )}
        </View>

        {/* Label */}
        <Text
          style={[
            commonStyling.subtitle,
            styles.label,
            { color: colors.titleText },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioOuterActive: {
    borderWidth: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: FONT_SIZES.BODY,
    flexShrink: 1,
    flex: 1,
  },
});

import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";
import { FONT_SIZES } from "../../constants/sizes";

interface DetailItemProps {
  iconLeft?: ReactNode;
  title: string;
  fontFamily?: string;
  theme?: string;
  subtitle?: string;
  iconRight?: ReactNode;
  onPress?: () => void;
  colors: {
    stroke: string;
    [key: string]: string;
  };
  paddingHorizontal?: number;
  paddingVertical?: number;
  borderBottomWidth?: number;
  profileScreen?: boolean;
}

export default function DetailItem({
  iconLeft,
  title,
  iconRight,
  onPress,
  fontFamily = "Regular",
  theme,
  subtitle,
  paddingHorizontal = 12,
  borderBottomWidth = 1,
  profileScreen = false,
  paddingVertical = 16,
}: DetailItemProps) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.row,
        {
          borderBottomColor: colors.stroke,
          borderBottomWidth,
          paddingHorizontal,
          paddingVertical,
        },
      ]}
    >
      {/* Left Icon + Title */}
      <View style={styles.left}>
        {iconLeft}

        {/* TEXT WRAPPER */}
        <View style={styles.textContainer}>
          <Text
            numberOfLines={0}
            style={[
              commonStyling.subtitle,
              {
                fontFamily,
                color: theme ? theme : colors.subTitleText,
                fontSize: profileScreen
                  ? FONT_SIZES.BUTTON
                  : FONT_SIZES.SUBTITLE,
              },
            ]}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={[
                commonStyling.subtitle,
                {
                  marginTop: 4,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right Icon */}
      {iconRight && <View style={styles.right}>{iconRight}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  textContainer: {
    flex: 1,
    minWidth: 0,
  },

  right: {
    marginLeft: 16,
    flexShrink: 0,
  },
});

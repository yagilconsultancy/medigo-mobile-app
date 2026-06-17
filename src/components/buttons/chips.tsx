import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import useTheme from "../../hooks/useThemes";
import DownArrow from "../../../assets/icons/downArrow";
import { FONT_SIZES } from "../../constants/sizes";

interface ChipsProps {
  icon?: React.ReactNode;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  arrow?: boolean;
  backgroundColor: string;
}

function Chips({
  icon,
  label,
  onPress,
  style,
  arrow,
  backgroundColor,
}: ChipsProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
          borderRadius: 50,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        {icon}

        <Text style={[styles.label, { color: colors.titleText }]}>{label}</Text>

        {arrow && <DownArrow />}
      </View>
    </TouchableOpacity>
  );
}

export default Chips;

const styles = StyleSheet.create({
  container: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  label: {
    fontSize: FONT_SIZES.SMALL,
    marginHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

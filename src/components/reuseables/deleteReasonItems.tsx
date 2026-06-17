import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";
import Ionicons from "@expo/vector-icons/Ionicons";

interface DeleteReasonItemProps {
  label: string;
  selected: boolean;
  isOther?: boolean;
  onPress?: () => void;
  onOtherPress?: () => void;
  iconOnTheRight?: boolean;
}

const DeleteReasonItem: React.FC<DeleteReasonItemProps> = ({
  label,
  selected,
  onPress,
  onOtherPress,
  isOther = false,
  iconOnTheRight = false,
}) => {
  const { colors } = useTheme();

  const commonStyling = commonStyles(colors);

  const handlePress = () => {
    if (isOther) {
      onOtherPress?.();
    } else {
      onPress?.();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.row,
        {
          borderColor: colors.stroke,
          justifyContent: iconOnTheRight ? "space-between" : "flex-start",
        },
      ]}
    >
      {!iconOnTheRight && (
        <View
          style={[
            styles.circle,
            {
              borderColor: selected ? colors.krGreen : colors.stroke,
              backgroundColor: selected
                ? colors.krGreen
                : colors.surfacePrimary,
            },
          ]}
        >
          {selected && <Ionicons name="checkmark" size={18} color="white" />}
        </View>
      )}
      <Text
        style={[
          styles.label,
          commonStyling.subtitle,
          { color: colors.titleText },
        ]}
      >
        {label}
      </Text>

      {iconOnTheRight && (
        <View
          style={[
            styles.circle,
            {
              borderColor: selected ? colors.krGreen : colors.stroke,
              backgroundColor: selected
                ? colors.krGreen
                : colors.surfacePrimary,
            },
          ]}
        >
          {selected && <Ionicons name="checkmark" size={18} color="white" />}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DeleteReasonItem;

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    flexDirection: "row",
    columnGap: 16,
    alignItems: "center",
  },
  label: {
    fontFamily: "Medium",
    width: "85%",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

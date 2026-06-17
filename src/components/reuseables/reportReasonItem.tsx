import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RightArrow from "../../../assets/icons/rightArrow";
import CheckMark from "../../../assets/icons/checkmark";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";

interface ReportReasonItemProps {
  label: string;
  selected: boolean;
  isOther?: boolean;
  onPress?: () => void;
  onOtherPress?: () => void;
}

const ReportReasonItem: React.FC<ReportReasonItemProps> = ({
  label,
  selected,
  onPress,
  onOtherPress,
  isOther = false,
}) => {
  // ❗ Hook must be inside the component
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
          backgroundColor: selected ? colors.lightGray : colors.surfacePrimary,
          borderColor: colors.stroke,
        },
      ]}
    >
      <Text style={[styles.label, commonStyling.subtitle]}>{label}</Text>

      {isOther ? (
        <RightArrow />
      ) : (
        <View style={[styles.circle, { borderColor: colors.subTitleText }]}>
          {selected && <CheckMark />}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ReportReasonItem;

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontFamily: "Regular",
    fontSize: 15,
    width: "85%",
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

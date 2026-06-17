import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import RightArrow from "../../../assets/icons/rightArrow";

interface TermsSectionItemProps {
  title: string;
  onPress: () => void;
  colors: any;
  commonStyling: any;
}

const TermsSectionItem = memo(
  ({ title, onPress, colors, commonStyling }: TermsSectionItemProps) => {
    return (
      <TouchableOpacity
        style={[styles.sectionItem, { backgroundColor: colors.lightGray }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[commonStyling.title, { flex: 1 }]}>{title}</Text>
        <RightArrow color={colors.titleText} />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
});

export default TermsSectionItem;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { commonStyles } from "../../styles/commonStyles";
import useTheme from "../../hooks/useThemes";
import { FONT_SIZES } from "../../constants/sizes";
import DownArrow from "../../../assets/icons/downArrow";

interface DropdownProps {
  label?: string;
  data: string[];
  selected?: string | null;
  onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  data = [],
  selected,
  onSelect,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSelect = (item: string) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            commonStyling.inputTitle,
            {
              fontFamily: "Bold",
              fontSize: 14,
            },
          ]}
        >
          {label}
        </Text>
      )}

      {/* BUTTON */}
      <TouchableOpacity
        style={[commonStyling.input, styles.dropdown]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectedText, { color: colors.titleText }]}>
          {selected || "Select"}
        </Text>

        <DownArrow />
      </TouchableOpacity>

      {/* LIST */}
      {open && (
        <ScrollView
          style={[
            styles.dropdownList,
            {
              backgroundColor: colors.surfacePrimary,
              borderColor: colors.gray,
            },
          ]}
        >
          {data.map((item, index) => (
            <View key={item}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item)}
              >
                <Text
                  style={[
                    commonStyling.subtitle,
                    { color: colors.titleText, fontSize: FONT_SIZES.BODY },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>

              {index !== data.length - 1 && (
                <View
                  style={[styles.separator, { backgroundColor: colors.gray }]}
                />
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    zIndex: 10,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    fontSize: 13,
    lineHeight: 18,
  },
  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 180,
    overflow: "hidden",
    zIndex: 100,
    position: "absolute",
    top: 70,
    width: "100%",
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  separator: {
    height: 1,
  },
});
